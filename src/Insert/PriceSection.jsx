import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

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
  'cozinha',
  'quarto',
  'banheiro',
  'escritorio',
  'area-de-servico',
  'sala',
  'viagens/planos',
  'pets'
];

const PriceSection = () => {
  const [items, setItems] = useState([]);
  const [filterSection, setFilterSection] = useState('');
  const [searchText, setSearchText] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
  
        // Filtrar e calcular total
        const filteredItems = itemsArray.filter((item) => {
          const matchesSection = !filterSection || item.section === filterSection;
          const matchesSearch = searchText
            ? item.text.toLowerCase().includes(searchText.toLowerCase())
            : true;
          return matchesSection && matchesSearch;
        });
  
        const total = filteredItems.reduce((sum, item) => {
          return sum + (parseFloat(item.preco) || 0);
        }, 0);
  
        setTotalPrice(total);
      } else {
        setItems([]);
        setTotalPrice(0);
      }
    });
  
    return () => itemsRef.off();
  }, [filterSection, searchText]);

  const filteredItems = items.filter((item) => {
  const matchesSection = !filterSection || item.section === filterSection;
  const matchesSearch = searchText
    ? item.text.toLowerCase().includes(searchText.toLowerCase())
    : true;
  return matchesSection && matchesSearch;
});
  return (
    <div className="min-h-screen bg-emerald-100 m-4 rounded-lg">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold mb-8 text-center text-emerald-900">
          Produtos e Preços
        </h2>
        
        {/* Filtros e Busca */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-emerald-500" />
            </div>
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-emerald-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-emerald-50"
            />
          </div>
          
          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-emerald-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-emerald-50"
          >
            <option value="">Todas as Seções</option>
            {sections.map((section) => (
              <option key={section} value={section}>
                {capitalizeFirstLetter(section)}
              </option>
            ))}
          </select>
        </div>

        {/* Total Card */}
        <div className="mb-8 bg-emerald-50 rounded-xl shadow-lg p-6 border border-emerald-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-emerald-800">
              Total {filterSection ? `da seção ${capitalizeFirstLetter(filterSection)}` : 'de todas as seções'}
              {searchText && ' (filtrado)'}:
            </h3>
            <span className="text-3xl font-bold text-emerald-700">
              R$ {totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Grid de Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-emerald-50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-emerald-200"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-emerald-200 text-emerald-800 rounded-full text-sm font-medium">
                    {capitalizeFirstLetter(item.section)}
                  </span>
                  {item.quantity && (
                    <span className="px-3 py-1 bg-emerald-200 text-emerald-800 rounded-full text-sm">
                      Qtd: {item.quantity}
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-emerald-900">{item.text}</h3>
                
                <div className="flex justify-between items-end">
                  <div className="text-2xl font-bold text-emerald-700">
                    R$ {parseFloat(item.preco || 0).toFixed(2)}
                  </div>
                  {item.color && (
                    <div 
                      className="h-6 w-6 rounded-full border-2 border-emerald-300"
                      style={{ backgroundColor: item.color }}
                      title={`Cor: ${item.color}`}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-emerald-600 text-xl">
              {searchText 
                ? 'Nenhum item encontrado para esta busca'
                : filterSection 
                  ? `Nenhum item encontrado na seção ${capitalizeFirstLetter(filterSection)}`
                  : 'Nenhum item cadastrado'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceSection;