import React from 'react';
import { HiOutlineMenu } from "react-icons/hi"; // Ícone do menu hamburguer
import { IoCloseOutline } from "react-icons/io5"; // Ícone de fechar menu
import { FaListCheck } from "react-icons/fa6";
import { TbCurrencyReal } from 'react-icons/tb';
import { FaCheckSquare } from 'react-icons/fa';

export const Header = ({ view, onToggleView }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false); // Controle do menu hamburguer

  // Alterna o estado do menu hamburguer
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Fecha a sidebar ao clicar fora dela
  const closeMenu = (e) => {
    if (e.target.id === 'sidebar' || e.target.id === 'overlay') {
      setIsMenuOpen(false);
    }
  };

  return (
    <section className="section-header m-4 p-4 bg-green-600 rounded-lg shadow-lg flex justify-between items-center">
      <div className="logo flex items-center gap-3">
        <FaCheckSquare className='text-3xl text-white' />
        <span className="text-xl font-bold text-white">LEOBECA</span>
      </div>

      {/* Menu Hamburguer para dispositivos móveis */}
      <div className="sm:hidden">
        <button onClick={toggleMenu} className="text-3xl text-white">
          {isMenuOpen ? <IoCloseOutline /> : <HiOutlineMenu />}
        </button>
      </div>

      {/* Overlay que aparece fora da sidebar para fechar o menu */}
      {isMenuOpen && <div id="overlay" className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-40" onClick={closeMenu}></div>}

      {/* Sidebar (Menu lateral) no Mobile */}
      <div 
        id="sidebar"
        className={`fixed top-0 left-0 z-50 w-64 h-full bg-white shadow-lg transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out sm:hidden`}
        onClick={closeMenu}
      >
        <div className="flex flex-col items-start pt-5 px-6 space-y-4">
          {/* Botão de Lista */}
          <button
            className={`flex items-center gap-3 w-full text-lg ${view === 'list' ? 'bg-green-500 text-white' : 'bg-transparent text-gray-800'} py-3 px-4 rounded-lg hover:bg-green-300 transition-all duration-200`}
            onClick={() => onToggleView('list')}
          >
            <FaListCheck className="text-xl" />
            Lista
          </button>
          
          {/* Botão de Preço */}
          <button
            className={`flex items-center gap-3 w-full text-lg ${view === 'price' ? 'bg-green-500 text-white' : 'bg-transparent text-gray-800'} py-3 px-4 rounded-lg hover:bg-green-300 transition-all duration-200`}
            onClick={() => onToggleView('price')}
          >
            <TbCurrencyReal className="text-xl" />
            Preço
          </button>
        </div>
      </div>

      {/* Links de navegação para telas grandes */}
      <div className="hidden sm:flex sm:gap-5 sm:items-center sm:w-auto">
        <button
          className={`btn ${view === 'list' ? 'bg-green-500 text-white' : 'bg-transparent text-gray-800'} px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-300 transition-colors duration-200`}
          onClick={() => onToggleView('list')}
        >
          Lista
        </button>
        <button
          className={`btn ${view === 'price' ? 'bg-green-500 text-white' : 'bg-transparent text-gray-800'} px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-300 transition-colors duration-200`}
          onClick={() => onToggleView('price')}
        >
          Preço
        </button>
      </div>
    </section>
  );
};
