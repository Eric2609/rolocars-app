
'use client'
import React from 'react'
import {Navigator,Header} from '../../../../components'
import '../info.css'
import {User,Compra1,Producto} from '@prisma/client'
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import axios from 'axios';
import '../../../../src/app/globals.css'



function Compras() {
  const [showWarning, setShowWarning] = useState(true);
  const [activation,setActivation]=useState(false);
  const [inputUserModal, setInputUserModal] = useState('');


  const [selectUser, setSelectUser] = useState<User | null>(null);
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
    }
  };
  useEffect(() => {
    GetProductos();
  }, []);

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
  const [compras, setCompras] = useState<Compra1[]>([]);
  const [compra, setCompra] = useState<Compra1>({
    id_Compra:0,
    id_Usuario:0,
    Producto:'',
    Descripcion:'',
    Precio_Costo:0,
    Precio_Venta:0,
    Stock:0,
    Fecha: new Date(),
    Total:0,
    Proveedor:'',
    Saldo:0
  });
  const GetCompras = async () => {
    const res = await axios.get('/api/compras')
      .catch((error) => {
        console.log('catch: ', error.message);
      });
    if (res && res.data) {
      setCompras(res.data);
      const sortedCompras = res.data.sort((a: Compra1, b: Compra1) => b.id_Compra - a.id_Compra);
      setCompras(sortedCompras);

      console.log('GetCompras->res.data: ', res.data);
      console.log(user.id_User)
    }
  };
  useEffect(() => {
    GetCompras();
   
  }, []);

   const ror='admin'
  const addCompras = async (e: SyntheticEvent) => {
    e.preventDefault();
    const existingUser = users.find(u => u.User === user.User);
    console.log(user)
    console.log(existingUser)
    if (!existingUser) {
      console.error('El usuario ingresado no existe.');
      return;
    }
    if (existingUser.Rol.toLocaleLowerCase() !== ror) {
      console.log(existingUser.Rol)
      console.error('Solo los usuarios con rol de administrador pueden agregar compras.');
      console.log(existingUser)
      return;
    }
    try {
      console.log(existingUser)
      const resp = await axios.post('/api/compras', {
        id_Usuario: existingUser.id_User, 
        Producto: compra.Producto,
        Descripcion: compra.Descripcion,
        Precio_Costo: parseInt(compra.Precio_Costo.toString()),
        Precio_Venta: parseInt(compra.Precio_Venta.toString()),
        Stock: parseInt(compra.Stock.toString()),
        Fecha: new Date(compra.Fecha),
        Total: compra.Total,
        Proveedor: compra.Proveedor ?? '',  // <--- agregado
        Saldo: compra.Saldo ?? 0  

      });
      if (resp && resp.data) {
        handleProductUpdate(compra)
      
        GetCompras();
        ResetCompras()
      
      }
    } catch (error) {
      console.error('Error al agregar la compra:', error);
    }
  };


  const ResetCompras = () => {
    setCompra(prevState => ({ ...prevState, id_Compra: 0,id_Usuario:0,Producto:'', Descripcion:'',Precio_Costo:0,Precio_Venta:0,Stock:0,Fecha:new Date(),Total:0,Proveedor:'',Saldo:0}));
    setUser(prevState =>({...prevState,id_User:0,User:'',Password:'',Rol:''}))
  }
  const ResetProducto = () => {
    setProducto(prevState => ({ ...prevState, Id_Producto: 0, Producto: '', Descripcion: '', Precio_Compra: 0, Precio_Venta: 0, Stock: 0 }));
  }



const handleProductUpdate = async (compra: Compra1) => {
  const existingProduct = productos.find(p => p.Producto === compra.Producto);

  if (!existingProduct) {
    console.log('el pro no existe');
    try {
      const resp = await axios.post('/api/productos', {
        Producto: compra.Producto,
        Descripcion: compra.Descripcion,
        Precio_Compra: parseInt(compra.Precio_Costo.toString()),
        Precio_Venta: parseInt(compra.Precio_Venta.toString()),
        Stock: parseInt(compra.Stock.toString()),
      });

      if (resp && resp.data) {
        console.log('Producto agregado:', resp.data);
        GetProductos(); 
      }
      ResetProducto(); 
    } catch (error) {
      console.error('Error al agregar el producto:', error);
    }
  } else {
    const productoSeguro = existingProduct.Producto ?? '';
    const descripcionSeguro = existingProduct.Descripcion ?? '';

    const newVenta = (existingProduct.Precio_Venta + parseInt(compra.Precio_Venta.toString())) / 2;
    const newCosto = (existingProduct.Precio_Compra + parseInt(compra.Precio_Costo.toString())) / 2;
    const upStock = existingProduct.Stock + parseInt(compra.Stock.toString());

    await UpdateProducto(
      existingProduct.Id_Producto,
      productoSeguro,
      descripcionSeguro,
      newVenta,
      newCosto,
      upStock
    );
  }
};




  const UpdateProducto = async (exiProduc:number,producto:String,descripcion:String,newVenta:number,newCosto:number,upStock:number) => {
    console.log(exiProduc)
    const resp = await axios.put(`/api/productos/`, {
      Id_Producto:exiProduc,
      Producto: producto,
      Descripcion: descripcion,
      Precio_Compra:newCosto,
      Precio_Venta: newVenta,
      Stock: upStock,
    });
    if (resp && resp.data) {
      console.log('UpdateProducto->resp.data: ', resp.data);
      GetProductos();
    }
    ResetProducto()
  };
  





  const UpdateCompras = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (activation!==true){
      console.error('usted no esta habilitado para editar .');
      return;
    }
    try {
    const resp = await axios.put(`/api/compras/`, {
      id_Compra:compra.id_Compra,
      id_Usuario:selectUser ? selectUser.id_User : undefined,
      Producto:compra.Producto,
      Descripcion:compra.Descripcion,
      Precio_Costo: parseInt(compra.Precio_Costo.toString()),
      Precio_Venta: parseInt(compra.Precio_Venta.toString()),
      Stock: parseInt(compra.Stock.toString()),
      Fecha: compra.Fecha instanceof Date && !isNaN(compra.Fecha.getTime())
    ? compra.Fecha.toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0],

      Total:compra.Total,
      Proveedor: compra.Proveedor ?? '',  
      Saldo: compra.Saldo ?? 0  
    });
    if (resp && resp.data) {
      console.log('UpdateCompras->resp.data: ', resp.data);
      GetCompras();
    }
    ResetCompras()
      setShowWarning(false)

  }catch (error) {
    console.error('Error al agregar la compra:', error);
  }
}

  const EditCompras = async (compraId: number) => {
    const productFound = compras.find(compra => compra.id_Compra === compraId);
    console.log('capatamos tus datos')
    if (productFound) {
      setCompra(productFound);
    }
  }


  const [eliminar,setEliminar]=useState<number>(0);
  const DeleteCompras = async (compraId: number) => {
    setShowWarning(true)
    setEliminar(compraId)
    console.log(eliminar)
    if (activation!==true){
      console.log(' la activavcion es ',activation)
    }
    try{      
      console.log(activation)
      const resp = await axios.delete(`/api/compras/`, {
        params:{Id:eliminar}
      }).catch((error) => {
        console.log("catch: ", error.message);
      });
      if (resp && resp.data) {
        console.log('DeleteCompras->resp.data: ', resp.data);
        GetCompras();
        setShowWarning(false)
        setEliminar(0)
        setActivation(false)
    }
    }catch(error){console.error(error)} }




  const HandleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value: string | number = '';
    if (typeof e.target.value === 'string') {
      value = e.target.value;
    } else if (typeof e.target.value === 'number') {
      value = e.target.value;
    }
    console.log("Name:", e.target.name);
    console.log("Value:", value);
  
    // Actualizar compra
    console.log("Setting compra field:", e.target.name);
    setCompra(prevState => ({ ...prevState, [e.target.name]: value }));
  
    // Calcular  Total 
    if (e.target.name === 'Precio_Costo' || e.target.name === 'Stock') {
      const precioVenta = e.target.name === 'Precio_Costo' ? parseFloat(value.toString()) : compra.Precio_Costo;
      const stock = e.target.name === 'Stock' ? parseInt(value.toString(), 10) : compra.Stock;
      const total = isNaN(precioVenta) || isNaN(stock) ? 0 : precioVenta * stock;
      setCompra(prevState => ({ ...prevState, Total: total }));
    }
  };

  const [busquedaUser,setBusquedaUSer]=useState<String>('');
  const buscar = (e: SyntheticEvent) => {
    e.preventDefault();
    const inputElement = e.target as HTMLInputElement;
    const inputValue = parseInt(inputElement.value);
  // Buscar la venta 
  const ventaEncontrada = compras.find(compra =>compra.id_Compra ===inputValue);
  if (ventaEncontrada) {
    // Encontrar el usuario
    const usuarioEncontrado = users.find(usuario => usuario.id_User === ventaEncontrada.id_Usuario);
    setShowWarning(false)
    if (usuarioEncontrado) {
      console.log('Usuario:', usuarioEncontrado);
      setBusquedaUSer(usuarioEncontrado.User || '')
      setShowWarning(false)
    } else {
      console.log('No se encontró el producto o el usuario asociados a la venta.');
    }
  } else {
    console.log('No se encontró una venta con el ID de producto ingresado.');
  }
};
const handleUserChange = (e: ChangeEvent<HTMLInputElement>) => {
  const { value } = e.target;
  setUser((prevUser) => ({ ...prevUser, User: value }));
};


const handleEditConfirmation = (e: ChangeEvent<HTMLInputElement>) => {
  const inputValu = e.target.value;
  const userValid = users.find(usuario => usuario.User === inputValu);

  if (userValid?.Rol.toLowerCase() === 'admin') {
    setActivation(true); // habilita todas las funciones
    setShowWarning(false); // cierra el modal
    setSelectUser(userValid); // guarda el usuario
  } else {
    alert('Usuario no autorizado');
    setActivation(false);
  }
};



  const cancel=()=>{
    setShowWarning(false)
    setCompra({
    id_Compra: 0,
    id_Usuario: 0,
    Producto: '',
    Descripcion: '',
    Precio_Costo: 0,
    Precio_Venta: 0,
    Stock: 0,
    Fecha: new Date(),
    Total: 0,
    Proveedor:'',
    Saldo:0
  });
      window.location.href = '/inicio';
  }






function formatDateToLocalYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}


  const Style = {
    backgroundColor: '#BBD0D5', 
    fontWeight: 'bold', 
  };

  return (
    <div>
        <Header/>
        <Navigator/>

        <div className='contenedor_busqueda'>
            <img className='img'
              src="/transaccion.png"
              alt="Picture "/>
              <div className='form1'>
                <form >
                  <div className='contenedor_res0'>
                    <label htmlFor="" className='label_busqueda'> <strong>Ingrese ID Compra</strong></label> 
                    <input  className='buscar' type="number" id='productId'name="productId"  onChange={buscar} placeholder='ID Compra' /> <br/>
                  </div>

                  <div className='contenedor_res'>
                    <label htmlFor=""> <strong className='label_busqueda'>Usuario : </strong></label>
                    {busquedaUser}
                  </div>
                </form>
              </div>
          </div>

        <div className='contend'>
              <div className='contenedor_Form'>
                <form >
                  <label htmlFor="user" className='label'>Usuario</label>
                  <input className='input_Form' onChange={handleUserChange} value={user.User} type="text" name="User" id="user" />
                  <label className='label' htmlFor="">Producto</label>
                  <input className='input_Form' onChange={HandleChange} value={compra.Producto} type="text" name="Producto" placeholder="Producto" />
                  <label className='label' htmlFor="">Descripcion</label>
                  <input className='input_Form' onChange={HandleChange} value={compra.Descripcion} type="text" name="Descripcion" placeholder="descripcion" />
                  <label className='label' htmlFor="">Precio costo</label>
                  <input className='input_Form' onChange={HandleChange} value={compra.Precio_Costo} type="number" name='Precio_Costo' placeholder='Precio Costo'/>
                  <label className='label' htmlFor="">Precio Venta</label>
                  <input className='input_Form' onChange={HandleChange} value={compra.Precio_Venta} type="number" name="Precio_Venta" placeholder="Precio_Venta" /> 
                  <label className='label' htmlFor="">Stock</label>
                  <input className='input_Form' onChange={HandleChange} value={compra.Stock} type="number" name="Stock" placeholder="Stock" />
                  <label className='label' htmlFor="fecha">Fecha</label>
                  <input className='input_Form' type="date" name="Fecha"
                    value={
                      compra.Fecha instanceof Date && !isNaN(compra.Fecha.getTime())
                        ? formatDateToLocalYYYYMMDD(compra.Fecha)
                        : ''}
                    onChange={(e) =>
                      setCompra(prev => ({
                      ...prev,
                      Fecha: new Date(`${e.target.value}T12:00:00`)
                      }))
                    }
                 />
                  <label className='label' htmlFor="">total</label>
                  <input className='input_Form' onChange={HandleChange} readOnly value={compra.Total} type="number" name="Total" placeholder="Total" />
                  <label className='label' htmlFor="">Proveedor</label>
                  <input className='input_Form' onChange={HandleChange} value={compra.Proveedor ?? ''} type="text" name="Proveedor" placeholder="Proveedor"/>

                  <label className='label' htmlFor="">Saldo</label>
                  <input className='input_Form' onChange={HandleChange} value={compra.Saldo ?? 0} type="number" name="Saldo" placeholder="Saldo"/>         
                           
                  <div style={{ marginTop: "5px" }}>
                  <button className='button_crear' onClick={addCompras}>Nueva Compra</button>
                  <button className='button_crear' onClick={UpdateCompras}>Actualizar Compra</button>
  
                  </div>

                  {/*   <div style={{ marginTop: "5px" }}>
                    <button className='button_crear' onClick={UpdateCompras}>Actualizar Compra</button>
                  </div>*/}
                </form>
              </div>
              <div className='Table_BD'>
              <table className='contend_table' style={{ border: 'solid gray 1px', padding: '5px' }}>
                <thead>
                  <tr className='tr'>
                    <th>Id Cmp</th>
                    <th>Id Usr</th>
                    <th>Producto</th>
                    <th>Descripcion</th>
                    <th>Precio Costo</th>
                    <th>Precio Venta</th>    
                    <th>Stock</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Proveedor</th>
                    <th>Saldo</th>
                    <th>Acciones</th>           
                  </tr>
                </thead>
                <tbody >
                  {compras.map((compra: Compra1, index:Number) => (
                    <tr className='tr' key={compra.id_Compra} style={index === 0 ? Style : {}}>
                      <td>{compra.id_Compra}</td>
                      <td>{compra.id_Usuario}</td>
                      <td>{compra.Producto}</td>
                      <td>{compra.Descripcion}</td>
                      <td>{compra.Precio_Costo}</td>
                      <td>{compra.Precio_Venta}</td>
                      <td>{compra.Stock}</td>
                      <td>{new Date(compra.Fecha).toLocaleDateString()}</td>
                      <td>{compra.Total}</td>
                      <td>{compra.Proveedor ?? ''}</td>
                      <td>{compra.Saldo ?? 0}</td>
                      <td>
                        <button onClick={() => EditCompras(compra.id_Compra)} className='button_Edit' >Editar</button>
                    {/*   <button onClick={() => DeleteCompras(compra.id_Compra)} className='button_Delete' >Eliminar</button>*/}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
          </div>


{showWarning && (
  <div className="warning-modal">
    <p>Ingrese su usuario para editar esta compra</p>
    <input
      type="text"
      id="User"
      name="User"
      placeholder="Usuario"
      value={inputUserModal}
      onChange={(e) => setInputUserModal(e.target.value)}
    />
    <button onClick={() => {
      const userValid = users.find(u => u.User === inputUserModal);
      if (userValid?.Rol.toLowerCase() === 'admin') {
        setActivation(true);      // habilita edición
        setShowWarning(false);    // cierra modal
        setSelectUser(userValid); // guarda usuario
      } else {
        alert('Usuario no autorizado');
        setActivation(false);
        setInputUserModal('');   // limpia input
      }
    }}>
      Confirmar
    </button>

    <button onClick={cancel}><strong>X</strong></button>
  </div>
)}







    </div>
  )
}
export default Compras
