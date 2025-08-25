'use client'
import React from 'react'
import {Navigator,Header} from '../../../../components'
import '../info.css'
import {User,Venta1,Producto} from '@prisma/client'
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation'; // Importa useSearchParams

function Compras() {
  const searchParams = useSearchParams(); // Obtén los parámetros de la URL
  const productoId = searchParams?.get('productoId') ?? null; // Protegido contra null

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

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
    },[]);
    useEffect(() => {
      if (productoId && productos.length > 0) {
        const selectedProduct = productos.find(p => p.Id_Producto === parseInt(productoId, 10));
        if (selectedProduct) {
          setProducto(selectedProduct);
          setVenta(prevState => ({
            ...prevState,
            id_Producto: selectedProduct.Id_Producto,
            precio_Costo: selectedProduct.Precio_Compra.toString(),
            precio_Venta: selectedProduct.Precio_Venta.toString(),
          }));
        }
      }
    }, [productoId, productos]);

  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User>({
    id_User:0,
    User:'',
    Password:'',
    Rol:'',
  });
  const GetUser=async()=>{
    const res =await axios.get('/api/users')
    .catch((error)=>{console.log('catch',error.message);
  });
  if(res && res.data){
    setUsers(res.data);
    }
  }
  useEffect(() => {
    GetUser();
  }, []);

  const [ventas, setVentas] = useState<Venta1[]>([]);
  const [venta, setVenta] = useState<Omit<Venta1, 'fecha'> & { fecha: string }>({
  id_Venta:      0,
  id_Producto:   0,
  id_Usuario:    0,
  precio_Costo:  '',
  precio_Venta:  '',
  cantidad:      0,
  fecha:         '', // <-- string vacío en vez de new Date()
  total:         0,
});


const GetVentas = async () => {
  const res = await axios.get('/api/ventas')
    .catch((error) => {
      console.log('catch: ', error.message);
    });

  if (res && res.data) {
    const ventasData: Venta1[] = res.data;
    const sortedVentas = ventasData.sort((a, b) => b.id_Venta - a.id_Venta);
    setVentas(sortedVentas);
    console.log('GetVentas->res.data: ', ventasData);
  }
};






  useEffect(() => {
    GetVentas();
    },[]);   

  const addVentas = async (e: SyntheticEvent) => {
  e.preventDefault();

  const resp = await axios.post('/api/ventas', {
    id_Producto: producto.Id_Producto,
    id_Usuario: user.id_User,
    precio_Costo: venta.precio_Costo.toString(),
    precio_Venta: venta.precio_Venta.toString(),
    cantidad: venta.cantidad,
    fecha: new Date(`${venta.fecha}T12:00:00`).toISOString(),
    total: venta.total,
  });

  if (resp && resp.data) {
    console.log('AddVentas->resp.data: ', resp.data);
    GetVentas();

    // Actualizar el stock 
    const nuevoStock = producto.Stock - venta.cantidad;

    await UpdateProducto(
      nuevoStock,
      producto.Id_Producto,
      producto.Producto ?? '',
      producto.Descripcion ?? '',
      producto.Precio_Compra,
      producto.Precio_Venta
    );

    ResetVentas();
  }
};

const UpdateProducto = async (
  Stock: number,
  id_Producto: number,
  producto: string,
  descripcion: string,
  compra: number,
  venta: number
) => {
  const resp = await axios.put(`/api/productos/`, {
    Id_Producto: id_Producto,
    Producto: producto,
    Descripcion: descripcion,
    Precio_Compra: compra,
    Precio_Venta: venta,
    Stock: Stock,
  });
  if (resp && resp.data) {
    console.log('UpdateProducto->resp.data: ', resp.data);
    GetProductos();
  }
  ResetProducto();
};
  const ResetProducto = () => {
    setProducto(prevState => ({ ...prevState, Id_Producto: 0, Producto: '', Descripcion: '', Precio_Compra: 0, Precio_Venta: 0, Stock: 0 }));
  }


const UpdateVentas = async (e: SyntheticEvent) => {
  e.preventDefault();
  console.log(venta.cantidad);

  const ventaOriginal = ventas.find((v) => v.id_Venta === venta.id_Venta);
  if (!ventaOriginal) {
    console.error('No se encontró la venta original.');
    return;
  }
  console.log(ventaOriginal);

  const diferenciaCantidad = venta.cantidad - ventaOriginal.cantidad;

  const resp = await axios.put(`/api/ventas`, {
    id_Venta: venta.id_Venta,
    id_Producto: venta.id_Producto,
    id_Usuario: venta.id_Usuario,
    precio_Costo: venta.precio_Costo.toString(),
    precio_Venta: venta.precio_Venta.toString(),
    cantidad: venta.cantidad,
    fecha: new Date(`${venta.fecha}T12:00:00`).toISOString(),
    total: venta.total,
  });

  if (resp && resp.data) {
    console.log('UpdateVentas->resp.data: ', resp.data);
    // Obtener el producto correspondiente
    const productoVendido = productos.find((p) => p.Id_Producto === venta.id_Producto);
    if (productoVendido) {
      const stockActualizado = productoVendido.Stock + ventaOriginal.cantidad - venta.cantidad;
      await UpdateProducto(
        stockActualizado,
        venta.id_Producto,
        productoVendido.Producto ?? '',      // <-- aquí se corrige
        productoVendido.Descripcion ?? '',   // <-- aquí se corrige
        productoVendido.Precio_Compra,
        productoVendido.Precio_Venta
      );
    }
    GetVentas();
  }
  ResetVentas();
};



const ResetVentas = () => {
  setVenta({
    id_Venta: 0,
    id_Producto: 0,
    id_Usuario: 0,
    precio_Costo: '',
    precio_Venta: '',
    cantidad: 0,
    fecha: '', // String vacío para el campo tipo date
    total: 0,
  });

  setUser({
    id_User: 0,
    User: '',
    Password: '',
    Rol: '',
  });
  
};



const EditVentas = async (VentaId: number) => {
  const ventFound = ventas.find(venta => venta.id_Venta === VentaId);
  console.log('capatamos tus datos');
  if (ventFound) {
    setVenta({
      ...ventFound,
      fecha: new Date(ventFound.fecha).toISOString().split('T')[0], // convierte Date a 'YYYY-MM-DD'
    });
  }
};





const DeleteVentas = async (compraId: number) => {
  const resp = await axios.delete(`/api/ventas/`, {
    params: { Id: compraId }
  }).catch((error) => {
    console.log("catch: ", error.message);
  });

  if (resp && resp.data) {
    console.log('DeleteVentas->resp.data: ', resp.data);

    const ventaEliminada = ventas.find((venta) => venta.id_Venta === compraId);
    if (ventaEliminada) {
      const { cantidad, id_Producto } = ventaEliminada;

      const producto = productos.find((p) => p.Id_Producto === id_Producto);
      if (producto) {
        const nuevoStock = producto.Stock + cantidad;

        await UpdateProducto(
          nuevoStock,
          id_Producto,
          producto.Producto ?? '',       // <-- Coalescencia nula
          producto.Descripcion ?? '',    // <-- Coalescencia nula
          producto.Precio_Compra,
          producto.Precio_Venta
        );
      }
    }
    GetVentas();
  }
};






  const HandleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value: string | number = '';
    if (typeof e.target.value === 'string') {
      value = e.target.value;
    } else if (typeof e.target.value === 'number') {
      value = e.target.value;
    } 
    if (e.target.name === 'id_Producto') {
      const selectedProductId = parseInt(value, 10); 
      const selectProduct=productos.find(producto=> producto.Id_Producto===selectedProductId);
      if (selectProduct) {
        setProducto(selectProduct)
        setVenta(prevState=>({...prevState,
        id_Producto:selectedProductId,
        precio_Costo:selectProduct.Precio_Compra.toString(),
        precio_Venta:selectProduct.Precio_Venta.toString(),
      }));
      } else {
        console.error('El producto seleccionado no se encontró en la lista de productos.');
      }
    } 


else if (e.target.name === 'id_Usuario') {
  const selectedUserId = parseInt(value.toString(), 10);
  const selectedUser = users.find(user => user.id_User === selectedUserId);

  if (selectedUser) {
    setUser(selectedUser);
    setVenta(prev => ({
      ...prev,
      id_Usuario: selectedUserId // <- esto hace que el select se "pinte"
    }));
  } else {
    console.error('El usuario seleccionado no se encontró en la lista de usuarios.');
  }
}


  else if (e.target.name === 'usuarioInput') {
    const typedValue = value.toString();
    const selectedUser = users.find(u => u.User.toLowerCase() === typedValue.toLowerCase());

    if (selectedUser) {
      setUser(selectedUser);
      setVenta(prev => ({
        ...prev,
        id_Usuario: selectedUser.id_User
      }));
    } else {
      setUser(prev => ({
        ...prev,
        User: typedValue
      }));
    }
  }



    else if (e.target.name === 'mes') {
      setVenta(prevState => ({ ...prevState, [e.target.name]: String(value) }));}
     else {
      // Actualizar el estado de la compra can 
      console.log("Setting compra field:", e.target.name);
      if (e.target.name==='cantidad'){
        value=parseInt(value.toString(),10);
      }
      setVenta(prevState => ({ ...prevState, [e.target.name]: value }));
      // Calcular el Total 
      if (e.target.name === 'cantidad' || e.target.name === 'precio_Venta') {
        const parsedValue = parseInt(value.toString(), 10);
        const Cantidad = e.target.name==='cantidad'?parsedValue:venta.cantidad;
        const precioVenta = e.target.name === 'precio_Venta' ? parsedValue :parseInt(venta.precio_Venta); // Convertir a entero
        const total = Cantidad * precioVenta;
        console.log(total)
        setVenta(prevState => ({ ...prevState, total: total }));
      }
     }
  };

  const [busqueda, setBusqueda]=useState<String>('');
  const [busquedaUser,setBusquedaUSer]=useState<String>('');
  const buscar = (e: SyntheticEvent) => {
    e.preventDefault();
    const inputElement = e.target as HTMLInputElement;
    const inputValue = parseInt(inputElement.value);
    const ventaEncontrada = ventas.find(venta =>venta.id_Venta ===inputValue);
    if (ventaEncontrada) {
    // Encontrar el producto correspondiente 
      const productoEncontrado = productos.find(producto => producto.Id_Producto === ventaEncontrada.id_Producto);
    // Encontrar el usuario correspondiente 
      const usuarioEncontrado = users.find(usuario => usuario.id_User === ventaEncontrada.id_Usuario);
    if (productoEncontrado && usuarioEncontrado) {
      console.log('Producto:', productoEncontrado);
      console.log('Usuario:', usuarioEncontrado);
      setBusqueda(productoEncontrado.Producto || '')
      setBusquedaUSer(usuarioEncontrado.User || '')
    } else {
      console.log('No se encontró el producto o el usuario asociados a la venta.');
    }
  } else {
    console.log('No se encontró una venta con el ID de producto ingresado.');
  }
};

const [searchTerm, setSearchTerm] = useState('');
const [filteredProducts, setFilteredProducts] = useState<Producto[]>(productos);

useEffect(() => {
  setFilteredProducts(
    productos.filter(producto =>
      (producto.Producto ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
}, [searchTerm, productos]);



const lastRowStyle = {
  backgroundColor: '#BBD0D5', // Color de fondo diferente para la última fila
  fontWeight: 'bold', // Estilo de fuente diferente para destacar
};


  return (
    <div>

    {!hasMounted ? (
      <div className="loader">Cargando...</div>
    ) : (
      <>



        <Header/>
        <Navigator/>
        <div className='contenedor_bus'>
          <img className='img'
            src="/transaccion.png"
            alt="Picture "/>
          <div className='form1'>
            <form action="">
              <div className='contenedor_res0'>
                <label htmlFor="productId" className='label_busqueda'> <strong>Ingrese ID Venta</strong> </label>
                <input className='buscar' type="number" id='productId'name="productId"  onChange={buscar}  placeholder='ingrese ID Venta'/>
              </div>
              <div className='contenedor_res'>
               <label htmlFor=""><strong className='label_busqueda'>Prod Vendido : </strong></label>
               <label htmlFor="">{busqueda}</label>
              </div>
              <div className='contenedor_res1'>
                <label htmlFor=""><strong className='label_busqueda'>Usuario :  </strong></label>
                <label htmlFor="">{busquedaUser}</label>
              </div>
            </form>               
          </div>            
        </div>

        <div className='contend'>
          <div className='contenedor_Form'>
            <form >
            <label className='label' htmlFor="id_Producto">Producto</label>
            <input
              type="text"
              className="input_Form"
              placeholder="Buscar producto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select className='input_Form' name="id_Producto" onChange={HandleChange} value={venta.id_Producto}>
            <option value="">Selecciona un Producto</option>
              {filteredProducts.map((producto: Producto) => (
              <option key={producto.Id_Producto} value={producto.Id_Producto}>{producto.Producto}</option>
              ))}
            </select>
            <label htmlFor="id_Usuario" className='label'>Usuario</label>
              
              {/* <select className='input_Form' name="id_Usuario" onChange={HandleChange} value={venta.id_Usuario}>
              <option value="">Selecciona un usuario</option>
                {users.map((user: User) => (
                <option key={user.id_User} value={user.id_User}>{user.User}</option>
                ))}
            </select>*/}

              <input
                className='input_Form'
                type="text"
                name="usuarioInput"
                placeholder="Escriba el usuario"
                value={user.User}
                onChange={HandleChange}
              />

              
            <label className='label' htmlFor="precio_Costo">Precio compra</label><br/>
            <input className='input_Form' onChange={HandleChange} value={venta.precio_Costo} type="number" name="precio_Costo" placeholder="Precio_Compra" /> 
            <label className='label' htmlFor="">Precio venta</label>
            <input className='input_Form' onChange={HandleChange} value={venta.precio_Venta} type="number" name="precio_Venta" placeholder="Precio_Venta" />
            <label className='label' htmlFor="">Stock</label>
            <input  className='input_Form' onChange={HandleChange} value={venta.cantidad} type="number" placeholder='cantidda'name='cantidad'/>
              



<label className='label' htmlFor="fecha">Fecha</label>
<input
  className='input_Form'
  type="date"
  name="fecha"
  value={typeof venta.fecha === 'string' ? venta.fecha : ''}
onChange={(e) =>
  setVenta(prev => ({
    ...prev,
    fecha: e.target.value // guarda como string 'YYYY-MM-DD'
  }))
}
/>


            <label className='label' htmlFor="">total</label>
            <input className='input_Form' onChange={HandleChange} readOnly value={venta.total} type="number" name="total" placeholder="Total" />
            <br />
            <div style={{ marginTop: "5px" }}>
              <button className='button_crear' onClick={addVentas}>Nuevo vta</button>
              <button className='button_crear' onClick={UpdateVentas}>Editar vta</button>
            </div>
          </form>
          </div>
            <div className='Table_BD'>
              <table className='contend_table' style={{ border: 'solid 1px gray', padding: '5px' }}>
                <thead>
                  <tr className='tr'>
                    <th>Id Vta</th>
                    <th>Producto</th>
                    <th>Precio_Costo</th>
                    <th>Precio venta</th>
                    <th>Cantidad</th>
                    <th>Fecha</th>    
                    <th>Total</th>      
                    <th>Acciones</th>       
                  </tr>
                </thead>
                <tbody >
                  {ventas.map((venta: Venta1 , index: number) => (   
                    <tr key={venta.id_Venta} className='tr' style={index === 0 ? lastRowStyle : {}}>
                      <td>{venta.id_Venta}</td>
                      <td>
                      {
                        productos.find(p => p.Id_Producto === venta.id_Producto)?.Producto || 'Producto no encontrado'
                      }
                      </td>
                      <td>{venta.precio_Costo}</td>
                      <td>{venta.precio_Venta}</td>
                      <td>{venta.cantidad}</td>
                      <td>{new Date(venta.fecha).toLocaleDateString()}</td>
                      <td>{venta.total}</td>
                      <td>
                        <button onClick={() => EditVentas(venta.id_Venta)} className='button_Edit' >Editar</button>
                        <button onClick={() => DeleteVentas(venta.id_Venta)} className='button_Eliminar' >Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
          </div>

          </>
    )}
    </div>
  )
}
export default Compras






