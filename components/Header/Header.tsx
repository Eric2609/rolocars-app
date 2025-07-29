import React from 'react'
import './Header.css'
import Image from 'next/image'
import Link from 'next/link';


function Header() {
  return (
    <div className='Encabezado' >
      <strong>ROLO</strong> - Autorepuestos

      <div >
        <Link href="/inicio/user" className='cerrar'>
          <img className='icono'
            src="/avatar.png"
            alt="Picture "/>
        </Link>
      </div>

      <div className='icono2' >
        <Link href="/" className='cerrar'>
          <img
            src="/cerrar-sesion.png"
            alt="Grapefruit slice atop a pile of other slices" />
        </Link>
      </div>
    </div>
  )
}

export default Header