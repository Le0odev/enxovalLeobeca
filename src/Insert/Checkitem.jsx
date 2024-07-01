import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import '../Insert/style.css';

// Configurações do Firebase
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

// Inicialize o Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const database = firebase.database(); // Obtém a referência para o Realtime Database

const Checklist = () => {
  const sections = ['Seções', 'cozinha', 'quarto', 'banheiro', 'escritorio', 'area-de-servico', 'sala', 'viagens/planos', 'pets'];

  const [text, setText] = useState('');
  const [color, setColor] = useState('');
  const [section, setSection] = useState('');
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [quantItem, setQuantItem] = useState('');

  useEffect(() => {
    const itemsRef = database.ref('checklistItems');

    itemsRef.on('value', (snapshot) => {
      const itemsData = snapshot.val();
      if (itemsData) {
        const itemsArray = Object.entries(itemsData).map(([key, value]) => ({ id: key, ...value }));
        setItems(itemsArray);
      } else {
        setItems([]);
      }
    });

    return () => {
      itemsRef.off(); // Desinscreva-se dos eventos ao sair do componente
    };
  }, []);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleColorChange = (e) => {
    const selectedValue = e.target.value;
    setColor(selectedValue);
  };

  const handleSectionChange = (e) => {
    setSection(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editItem !== null) {
      database.ref(`checklistItems/${editItem.id}`).update({
        text,
        color,
        section,
        quantity: quantItem,
      });
      setEditItem(null);
    } else {
      database.ref('checklistItems').push({
        text,
        color,
        section,
        quantity: quantItem,
        completed: false,
      });
    }
    setText('');
    setColor('');
    setSection('');
    setQuantItem('');
  };

  const handleCheckboxChange = (itemToToggle) => {
    database.ref(`checklistItems/${itemToToggle.id}`).update({
      completed: !itemToToggle.completed,
    });
  };

  const handleDeleteItem = (itemToDelete) => {
    database.ref(`checklistItems/${itemToDelete.id}`).remove();
  };

  const handleEditItem = (itemToEdit) => {
    setEditItem(itemToEdit);
    setText(itemToEdit.text);
    setColor(itemToEdit.color);
    setSection(itemToEdit.section);
    setQuantItem(itemToEdit.quantity); // Adicionado para carregar a quantidade do item

    
    const editSection = document.getElementById('form-container');
    if (editSection) {
      editSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleQuantItem = (e) => {
    setQuantItem(e.target.value);
  };

  return (
    <div className='checklist-container'>
      <div className="header">
        <h1>NOSSO ENXOVAL</h1>
        <button className='playlist-button' onClick={() => setShowPlaylist(!showPlaylist)}>Mostrar/Esconder Playlist</button>
      </div>

      {showPlaylist && (
        <div className="playlist-container">
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

      <div id="form-container" className='form-container'>
        <form onSubmit={handleSubmit}>
          <label>
            <input type="text" placeholder='Insira um item' value={text} onChange={handleTextChange} />
          </label>
          <label>
            <select value={color} onChange={handleColorChange}>
              <option value="">Selecione uma cor</option>
              <option value="#111111">Preto</option>
              <option value="#ffffff">Branco</option>
              <option value="#808080">Cinza</option>
              <option value="#ece0c9">Vidro</option>
              <option value="#808080">Inox</option>
            </select>
          </label>
          <label>
            <select placeholder='Selecione uma seção' value={section} onChange={handleSectionChange}>
              {sections.map((sec, index) => (
                <option key={index} value={sec}>{sec.charAt(0).toUpperCase() + sec.slice(1)}</option>
              ))}
            </select>
          </label>
          <label>
            <input placeholder='Insira a quantidade' value={quantItem} onChange={handleQuantItem}></input>
          </label>
          <button className='add-button' type="submit">{editItem !== null ? 'Atualizar' : 'Adicionar Item'}</button>
        </form>
      </div>

      <div className='items-container'>
        {sections.map((sec, secIndex) => {
          const filteredItems = items.filter(item => item.section === sec.toLowerCase());
          return (
            <div key={secIndex} className='section'>
              <h2>{sec.charAt(0).toUpperCase() + sec.slice(1)}</h2>
              <div className='item-list'>
                {filteredItems.map((item, itemIndex) => (
                  <div key={itemIndex} className='item'>
                    <input className='check-box'
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleCheckboxChange(item)}
                    />
                    <span>{item.text}</span>
                    {item.color && (
                      <div
                        className='color-indicator'
                        style={{ backgroundColor: item.color }}
                        title='Cor selecionada'
                      ></div>
                    )}
                    <span>ll   {item.quantity}</span>
                    <FaTrash className='delete-icon' onClick={() => handleDeleteItem(item)} />
                    <FaEdit className='edit-icon' onClick={() => handleEditItem(item)} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Checklist;
