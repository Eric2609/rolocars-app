
'use client'
import React from 'react'
import { Router } from '../../models'
import Link from 'next/link'
import './Navbar.css'
import { usePathname } from 'next/navigation'

function Navigator() {
  const pathname = usePathname()
  const pat1 = '/registro/crud/Eliminar'
  const pat2 = '/registro/crud/actualzar'

  return (
    <div className='Navbar'>
      {Router.map((Route) => (
        <div className='Contenedor' key={Route.href}>
          <Link href={Route.href} className='Link'>
            {Route.name}
          </Link>
        </div>
      ))}

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