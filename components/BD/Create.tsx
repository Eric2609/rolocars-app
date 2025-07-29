'use client'
import React from 'react'
import {Producto} from '@prisma/client'
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import axios from 'axios';
import './Create.css'
import Link from 'next/link'

function Create() {

    const [productos, setProductos] = useState<Producto[]>([]);
    const [producto, setProducto] = useState<Producto>({
      Id_Producto: 0,
      Producto: '',
      Descripcion: '',
      Precio_Compra: 0,
      Precio_Venta: 0,
      Stock: 0,
    });
    const GetProductos = async () => {
      const res = await axios.get('/api/productos')
        .catch((error) => {
          console.log('catch: ', error.message);
        });
      if (res && res.data) {
        setProductos(res.data);
        console.log('GetProductos->res.data: ', res.data);
      }
    };
    useEffect(() => {
      GetProductos();
    }, []);
    const addProducto = async (e: SyntheticEvent) => {
      e.preventDefault();
      const resp = await axios.post('/api/productos/', {
        Producto: producto.Producto,
        Descripcion: producto.Descripcion,
        Precio_Compra: parseInt(producto.Precio_Compra.toString()),
        Precio_Venta: parseInt(producto.Precio_Venta.toString()),
        Stock: parseInt(producto.Stock.toString()),
      });
      if (resp && resp.data) {
        console.log('AddProducto->resp.data: ', resp.data);
        GetProductos();
      }
      ResetProducto()
    };
  
    const UpdateProducto = async (e: SyntheticEvent) => {
      e.preventDefault();
      const resp = await axios.put(`/api/productos/`, {
        Id_Producto:producto.Id_Producto,
        Producto: producto.Producto,
        Descripcion: producto.Descripcion,
        Precio_Compra:parseInt(producto.Precio_Compra.toString()),
        Precio_Venta: parseInt(producto.Precio_Venta.toString()),
        Stock: parseInt(producto.Stock.toString()),
      });
      if (resp && resp.data) {
        console.log('UpdateProducto->resp.data: ', resp.data);
        GetProductos();
      }
      ResetProducto()
    };
    const ResetProducto = () => {
      setProducto(prevState => ({ ...prevState, Id_Producto: 0, Producto: '', Descripcion: '', Precio_Compra: 0, Precio_Venta: 0, Stock: 0 }));
    }
    const EditProducto = async (productId: number) => {
      const productFound = productos.find(producto => producto.Id_Producto === productId);
      console.log('capatamos tus datos')
      if (productFound) {
        setProducto(productFound);
      }
    }
    const DeleteProducto = async (productId: number) => {
      const resp = await axios.delete(`/api/productos/`, {
        params:{Id:productId}
      }).catch((error) => {
        console.log("catch: ", error.message);
      });
      if (resp && resp.data) {
        console.log('DeleteProducto->resp.data: ', resp.data);
        GetProductos();
      }
    };
    // Update specific input field
    const HandleChange = (e: ChangeEvent<HTMLInputElement>) =>
      setProducto(prevState => ({ ...prevState, [e.target.name]: e.target.value }))
    return (
          <div className='contenedor_Crud'>
              <div className='nave'>
                <Link href='/inicio'>inicio</Link>
              </div>
              <div className='contenedor_Form'>
                <h1 className='Title_Form' > <strong >Formulario</strong> </h1>
                <form >
                  <label className='label' htmlFor="">Producto</label>
                  <input className='input_Form' onChange={HandleChange} value={producto.Producto as string} type="text" name="Producto" placeholder="Producto" />
                  <br />
                  <label className='label' htmlFor="">Descripcion</label>
                  <input className='input_Form' onChange={HandleChange} value={producto.Descripcion as string} type="text" name="Descripcion" placeholder="Descripcion" />
                  <br />
                  <label className='label' htmlFor="">Precio compra</label>
                  <input className='input_Form' onChange={HandleChange} value={producto.Precio_Compra} type="number" name="Precio_Compra" placeholder="Precio_compra" />
                  <br />
                  <label className='label' htmlFor="">Precio Venta</label>
                  <input className='input_Form' onChange={HandleChange} value={producto.Precio_Venta} type="number" name="Precio_Venta" placeholder="Precio_Venta" />
                  <br />               
                  <label className='label' htmlFor="">Stock</label>
                  <input className='input_Form' onChange={HandleChange} value={producto.Stock} type="number" name="Stock" placeholder="Stock" />
                  <br />
                  <div style={{ marginTop: "5px" }}>
                    <button className='button_New' onClick={addProducto}>Nuevo Producto</button>
                    <button className='button_New' onClick={UpdateProducto}>Editar Producto</button>
                  </div>
                </form>
              </div>

              <div className='Table_BD'>
              <table className='table' style={{ border: 'solid 2px', padding: '5px', marginTop: '12px' }}>
                <thead>
                  <tr className='tr'>
                    <th className='th'>ID_Producto</th>
                    <th>Producto</th>
                    <th>Descripcion</th>
                    <th>Precio Compra</th>
                    <th>Preio Venta</th>
                    <th>Stock</th>
                    <th>Acciones</th>                
                  </tr>
                </thead>
                <tbody className='tr'>
                  {productos.map((producto: Producto) => (
                    <tr className='tr' key={producto.Id_Producto}>
                      <td>{producto.Id_Producto}</td>
                      <td>{producto.Producto}</td>
                      <td>{producto.Descripcion}</td>
                      <td>{producto.Precio_Compra}</td>
                      <td>{producto.Precio_Venta}</td>
                      <td>{producto.Stock}</td>
                      <td>
                        <button onClick={() => EditProducto(producto.Id_Producto)} className='button_Delete' >Editar</button>
                        <button onClick={() => DeleteProducto(producto.Id_Producto)} className='button_Eliminar' >Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
          </div>
    )
}

export default Create