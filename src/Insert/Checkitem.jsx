import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
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

  useEffect(() => {
    localStorage.setItem('checklistItems', JSON.stringify(items));
  }, [items]);

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
    const newItem = { text, color, section, completed: false };
    setItems([...items, newItem]);
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

  return (
    <div className='checklist-container'>
      <h1>NOSSO ENXOVAL</h1>
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
            <select placeholder='insira uma cor' value={section} onChange={handleSectionChange}>
              {sections.map((sec, index) => (
                <option key={index} value={sec}>{sec.charAt(0).toUpperCase() + sec.slice(1)}</option>
              ))}
            </select>
          </label>
          <button className='add-button' type="submit">Adicionar Item</button>
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
