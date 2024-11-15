import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaPlus, FaMusic, FaSearch } from 'react-icons/fa';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { showToast, ToastNotification } from '../Toast';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCZI40cOWEVO5XiVYXFQiroBKhCMRLsz1o",
  authDomain: "leobeca-ad5b8.firebaseapp.com",
  databaseURL: "https://leobeca-ad5b8-default-rtdb.firebaseio.com",
  projectId: "leobeca-ad5b8",
  storageBucket: "leobeca-ad5b8.appspot.com",
  messagingSenderId: "627592096174",
  appId: "1:627592096174:web:39ce5fb194335a5d04003f",
  measurementId: "G-SV8EZL65FY"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();

const sections = [
  'Cozinha',
  'Quarto',
  'Banheiro',
  'escritorio',
  'Area-de-servico',
  'Sala',
  'Viagens/planos',
  'Pets'
];

const colors = [
  { label: 'Preto', value: '#111111' },
  { label: 'Branco', value: '#ffffff' },
  { label: 'Cinza', value: '#808080' },
  { label: 'Vidro', value: '#ece0c9' },
  { label: 'Inox', value: '#808080' }
];

export default function Checklist() {
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [filterSection, setFilterSection] = useState('');
  const [filterColor, setFilterColor] = useState('');
  const [filterText, setFilterText] = useState('');
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isFormVisibleMobile, setIsFormVisibleMobile] = useState(false); // Controle de visibilidade para mobile
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024); // Verifica o tamanho da tela para desktop

  const [formData, setFormData] = useState({
    text: '',
    color: '',
    section: '',
    preco: '',
    quantity: ''
  });


  useEffect(() => {
    // Atualiza o estado quando a tela for redimensionada
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleFormVisibility = () => {
    setIsFormVisibleMobile(!isFormVisibleMobile);
  };


  useEffect(() => {
    const itemsRef = database.ref('checklistItems');
    
    itemsRef.on('value', (snapshot) => {
      const itemsData = snapshot.val();
      if (itemsData) {
        const itemsArray = Object.entries(itemsData).map(([key, value]) => ({
          id: key,
          ...value
        }));
        setItems(itemsArray);
      } else {
        setItems([]);
      }
    });

    return () => itemsRef.off();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.text || !formData.section) return;

    if (editItem) {
      database.ref(`checklistItems/${editItem.id}`).update(formData);
      setEditItem(null);
      showToast('Item atualizado com sucesso!');
    } else {
      database.ref('checklistItems').push({
        ...formData,
        completed: false
      });
      showToast('Item adicionado com sucesso!');
    }
    setFormData({ text: '', color: '', section: '', preco: '', quantity: '' });
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setFormData({
      text: item.text,
      color: item.color,
      section: item.section,
      preco:  item.preco,
      quantity: item.quantity
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Se estamos editando um item, garante que o formulário estará visível
    if (editItem) {
      setIsFormVisibleMobile(true);
    }
  }, [editItem]);


  

  const handleDeleteClick = (itemId) => {
    setDeleteItemId(itemId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteItemId) {
      setItems(items.filter(item => item.id !== deleteItemId));
      const itemToDelete = items.find(item => item.id === deleteItemId);
      if (itemToDelete) {
        database.ref(`checklistItems/${itemToDelete.id}`).remove()
          .then(() => {
            showToast('Item excluído com sucesso!');
          })
          .catch((error) => {
            console.error("Erro ao excluir item do banco de dados:", error);
            showToast('Erro ao excluir item. Tente novamente.');
          });
      }
      setDeleteModalOpen(false);
      setDeleteItemId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);  
    setDeleteItemId(null);
  };

  const toggleComplete = (item) => {
    database.ref(`checklistItems/${item.id}`).update({
      completed: !item.completed
    });
  };

  // Filter items based on section, color, and search text
  const getFilteredItems = () => {
    return items.filter(item => {
      const matchesSection = filterSection ? item.section === filterSection.toLowerCase() : true;
      const matchesColor = filterColor ? item.color === filterColor : true;
      const matchesSearchText = filterText ? item.text.toLowerCase().includes(filterText.toLowerCase()) : true;
      return matchesSection && matchesColor && matchesSearchText;
    });
  };

  const getVisibleSections = () => {
    const filteredItems = getFilteredItems();
    const visibleSections = new Set(filteredItems.map(item => item.section));
    return sections.filter(section => 
      visibleSections.has(section.toLowerCase()) || !filterSection
    );
  };

  const getSectionItems = (section) => {
    const filteredItems = getFilteredItems();
    return filteredItems.filter(item => 
      item.section === section.toLowerCase()
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-green-200 m-4 rounded-xl p-4">
      <div className="max-w-7xl mx-auto space-y-8 mt-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-green-800">Nosso Enxoval</h1>
          <button
            onClick={() => setShowPlaylist(!showPlaylist)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <FaMusic className="h-4 w-4 text-green-600" />
            {showPlaylist ? 'Esconder Playlist' : 'Mostrar Playlist'}
          </button>
        </div>

        {/* Playlist */}
        {showPlaylist && (
          <div className="w-full rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://open.spotify.com/embed/playlist/7djtxycZOZbOs1Y68FNZJj?utm_source=generator&theme=0"
              width="100%"
              height="160"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        )}
      
       {/* Form Toggle Button (Mobile-Friendly) */}
       {!isDesktop && (
        <div className="flex justify-end">
          <button
            onClick={toggleFormVisibility}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 transition-all"
          >
            {isFormVisibleMobile ? 'Ocultar Formulário' : 'Adicionar Item'}
          </button>
        </div>
      )}

          {/* Form */}
          {(isDesktop || isFormVisibleMobile) && ( // Always show on desktop (md+)
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-green-800">
                {editItem ? 'Editar Item' : 'Adicionar Novo Item'}
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Nome do item"
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="flex-1 min-w-[200px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <input
                    type="number"
                    placeholder="Preço do item"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                    className="flex-1 min-w-[200px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                    step="0.01"
                    min="0"
                  />
                <select
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full md:w-[180px] px-4 py-2 text-nowrap border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Selecione uma cor</option>
                  {colors.map((color) => (
                    <option key={color.value} value={color.value}>
                      {color.label}
                    </option>
                  ))}
                </select>
                <select
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full md:w-[180px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Selecione uma seção</option>
                  {sections.map((section) => (
                    <option key={section} value={section.toLowerCase()}>
                      {section}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Quantidade"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full md:w-[120px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FaPlus className="h-4 w-4" />
                  {editItem ? 'Atualizar' : 'Adicionar'}
                </button>
              </form>
              <ToastNotification />
            </div>
          )}


        {/* Filters */}
        <div className="flex flex-wrap gap-4">
        <div className="w-full md:w-auto flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-green-500">
          <FaSearch className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar..."
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            className="flex-1 outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
          <select
            value={filterSection}
            onChange={e => setFilterSection(e.target.value)}
            className="w-full md:w-[180px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Todas as seções</option>
            {sections.map(section => (
              <option key={section} value={section.toLowerCase()}>
                {section}
              </option>
            ))}
          </select>
          <select
            value={filterColor}
            onChange={e => setFilterColor(e.target.value)}
            className="w-full md:w-[180px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Todas as cores</option>
            {colors.map(color => (
              <option key={color.value} value={color.value}>
                {color.label}
              </option>
            ))}
          </select>
          {(filterSection || filterColor || filterText) && (
            <button
              onClick={() => {
                setFilterSection('');
                setFilterColor('');
                setFilterText('');
              }}
              className="w-full md:w-auto px-4 py-2 text-sm bg-red-500 text-white hover:text-white hover:bg-red-400 rounded-lg transition-all"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getVisibleSections().map(section => {
            const sectionItems = getSectionItems(section);
            if (sectionItems.length === 0) return null;

            return (
              <div key={section} className="bg-white/80 backdrop-blur rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-green-800">{section}</h3>
                <div className="space-y-2">
                  {sectionItems.map(item => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        item.completed ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleComplete(item)}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className={`flex-1 ${item.completed ? 'line-through text-gray-500' : ''}`}>
                        {item.text}
                      </span>
                      {item.color && (
                        <div
                          className="w-4 h-4 rounded-full border border-gray-200"
                          style={{ backgroundColor: item.color }}
                        />
                      )}
                      {item.quantity && (
                        <span className="text-sm text-gray-500">x{item.quantity}</span>
                      )}                      
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <FaEdit className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <FaTrash className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
  
        {/* Modal Confirmation */}
        {deleteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-[300px] max-w-full">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Confirmar Exclusão</h3>
              <p className="text-gray-600 mb-6">Tem certeza de que deseja excluir este item?</p>
              <div className="flex justify-between">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                >
                  <FaTrash className="inline-block mr-2" />
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    
  );
  
  
}