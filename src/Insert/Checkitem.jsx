import React, { useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import '../Insert/style.css';

const Checklist = () => {
  const sections = ['Seções', 'cozinha', 'quarto', 'banheiro', 'escritorio', 'area-de-servico', 'sala', 'viagens/planos', 'pets', "mesa/banho"];

  const [text, setText] = useState('');
  const [color, setColor] = useState('');
  const [section, setSection] = useState('');
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('checklistItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  const [editItem, setEditItem] = useState(null);
  const [showPlaylist, setShowPlaylist] = useState(false);

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
    if (editItem) {
      const updatedItems = items.map(item => {
        if (item === editItem) {
          return { ...item, text, color, section };
        }
        return item;
      });
      setItems(updatedItems);
      setEditItem(null);
    } else {
      const newItem = { text, color, section, completed: false };
      setItems([...items, newItem]);
    }
    setText('');
    setColor('');
    setSection('');
  };

  const handleCheckboxChange = (itemToToggle) => {
    const updatedItems = items.map(item => {
      if (item === itemToToggle) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const handleDeleteItem = (itemToDelete) => {
    const updatedItems = items.filter(item => item !== itemToDelete);
    setItems(updatedItems);
  };

  const handleEditItem = (itemToEdit) => {
    setEditItem(itemToEdit);
    setText(itemToEdit.text);
    setColor(itemToEdit.color);
    setSection(itemToEdit.section);
  };

  return (
    <div className='checklist-container'>
      <div className="header">
        <h1>NOSSO ENXOVAL</h1>
        <button className='playlist-button' onClick={() => setShowPlaylist(!showPlaylist)}>Mostrar/Esconder Playlist</button>
      </div>

      {showPlaylist && (
        <div className="playlist-container">
          <iframe className='playlistt'
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

      <div className='form-container'>
        <form onSubmit={handleSubmit}>
          <label>
            <input type="text" placeholder='Insira um item' value={text} onChange={handleTextChange} />
          </label>
          <label>
            <select value={color} onChange={handleColorChange}>
              <option value="">Selecione uma cor</option>
              <option value="#111111">Preto</option>
              <option value="#b81414">Vermelho</option>
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
          <button className='add-button' type="submit">{editItem ? 'Atualizar' : 'Adicionar Item'}</button>
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
