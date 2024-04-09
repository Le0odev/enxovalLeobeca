import React from 'react'
import "../Header/style.css"
import { FaCheckSquare } from "react-icons/fa";

export const Header = () => {
  return (
    <section class="section-header">
    <div class="logo">
      <FaCheckSquare className='icon' />
      <span>LEOBECA</span>
    </div>
    <div class="checklist">
      ENXOVAL CHECKLIST
    </div>
  </section>
  

  )
}
