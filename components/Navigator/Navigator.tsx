'use client'
import React, { useState } from 'react'
import { Router } from '../../models'
import Link from 'next/link'
import './Navbar.css'
import { usePathname } from 'next/navigation'

function Navigator() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className='Navbar'>
      {/* Botón menú hamburguesa */}
      <div className='MenuButton' onClick={() => setMenuOpen(!menuOpen)}>
        <img src="/menu.png" alt="Menú" />
      </div>

      {/* Menú de links */}
      <div className={`MenuLinks ${menuOpen ? 'open' : ''}`}>
        {Router.map((Route) => (
          <div className='Contenedor' key={Route.href}>
            <Link
              href={Route.href}
              className='Link'
              onClick={() => setMenuOpen(false)}
            >
              {Route.name}
            </Link>
          </div>
        ))}
      </div>

      {/* Título y subtítulo */}
      <div className='Title_href'>
        {Router.map((Route) => (
          <strong key={Route.href + '-title'}>
            <p>{Route.href === pathname ? Route.name : ''}</p>
          </strong>
        ))}
        {Router.map((Route) => (
          <p key={Route.href + '-text'} className='Title_href_p'>
            {Route.href === pathname ? Route.text : ''}
          </p>
        ))}
      </div>
    </div>
  )
}

export default Navigator

 