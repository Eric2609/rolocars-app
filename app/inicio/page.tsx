'use client'

import '../../src/app/globals.css'
import React, { useEffect, useState, ChangeEvent } from 'react'
import { Navigator, Header } from '../../components'
import { Producto } from '@prisma/client'
import axios from 'axios'

function Inventario() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [productosEncontrados, setProductosEncontrados] = useState<Producto[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  useEffect(() => {
    fetchData()
  }, []) // ✅ solo una vez

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/productos')
      if (res.data) setProductos(res.data)
    } catch (error) {
      console.error('Error al cargar productos:', error)
    }
  }

  useEffect(() => {
    const checkStock = () => {
      const lowStock = productos.filter(p => p.Stock < 22)
      if (lowStock.length > 0) {
        const details = lowStock
          .map(p => `Producto: ${p.Producto}, Descripción: ${p.Descripcion}`)
          .join('<br/>')
        setAlertMessage(`¡Atención! El stock de los siguientes productos es menor a 20:<br/>${details}`)
        setShowAlert(true)
      } else {
        setShowAlert(false)
      }
    }

    if (productos.length > 0) checkStock()

    const intervalId = setInterval(() => {
      if (productos.length > 0) checkStock()
    }, 30000)

    return () => clearInterval(intervalId)
  }, [productos])

  const buscar = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const palabrasBusqueda = busqueda.trim().toLowerCase().split(' ').slice(0, 3)
    const encontrados = productos.filter(p => {
      if (!p.Producto) return false
      const palabrasProducto = p.Producto.trim().toLowerCase().split(' ')
      return palabrasBusqueda.every(palabra => palabrasProducto.includes(palabra))
    })
    setProductosEncontrados(encontrados)
  }

  const cancelar = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setBusqueda('')
    setProductosEncontrados([])
  }

  const handleBusquedaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value)
  }

  const venderProducto = (producto: Producto) => {
    window.location.href = `/inicio/informacion/ventas?productoId=${producto.Id_Producto}`
  }

  const closeAlert = () => setShowAlert(false)

  const productosParaMostrar = productosEncontrados.length > 0 ? productosEncontrados : productos

  return (
    <div>
      <Header />
      <Navigator />

      <div className='container_search'>
        <form onSubmit={e => e.preventDefault()}>
          <input
            type='search'
            placeholder='Buscar'
            className='search'
            value={busqueda}
            onChange={handleBusquedaChange}
          />
          <button onClick={buscar} className='Buscar'>Buscar</button>
          <button onClick={cancelar} className='Buscar'>Cancelar</button>
        </form>
      </div>

      <div className='contenedor'>
        <div className='contenedor_BBDD'>
          <table className='contenedor_table'>
            <thead>
              <tr>
                <th>ID_Pro</th>
                <th>Producto</th>
                <th>Descripción</th>
                <th>Precio Compra</th>
                <th>Precio Venta</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosParaMostrar.map(producto => (
                <tr key={producto.Id_Producto}>
                  <td>{producto.Id_Producto}</td>
                  <td>{producto.Producto}</td>
                  <td>{producto.Descripcion}</td>
                  <td>{producto.Precio_Compra}</td>
                  <td>{producto.Precio_Venta}</td>
                  <td>{producto.Stock}</td>
                  <td>
                    <button className='vender' onClick={() => venderProducto(producto)}>Vender</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showAlert && (
          <div className='alert'>
            <p dangerouslySetInnerHTML={{ __html: alertMessage }} />
            <button onClick={closeAlert}>X</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Inventario
