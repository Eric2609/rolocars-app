
'use client'
import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '@prisma/client';
import './user.css'
import Link from 'next/link';

function Use() {
    const [showWarning, setShowWarning] = useState(true);
    const [activation,setActivation]=useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [user, setUser] = useState<User>({
        id_User: 0,
        User: '',
        Password: '',
        Rol:'',
    });
    useEffect(() => {
        getUsers();
    }, []);
  const getUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };


  const UpdateUsers = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (activation!==true){
      console.error('usted no esta habilitado para editar .');
      return;
    }
    try {
    const resp = await axios.put(`/api/users/`, {
      id_User:user.id_User,
      User:user.User,
      Password:user.Password,
      Rol:user.Rol,
    });
    if (resp && resp.data) {
      console.log('UpdateUsers->resp.data: ', resp.data);
      getUsers();
    }
    ResetUsers()
      setShowWarning(false)
  }catch (error) {
    console.error('Error al agregar la compra:', error);
  }
}

const ResetUsers = () => {
    setUser(prevState => ({ ...prevState, id_User: 0,User:'',Password:'',Rol:''}));
  }

  const EditUsers = async (userId: number) => {
    const userFound = users.find(user => user.id_User === userId);
    console.log('capatamos tus datos')
    if (userFound) {
      setUser(userFound);
    }
  }

  const [eliminar,setEliminar]=useState<number>(0);
  const DeleteUsers = async (compraId: number) => {
    setEliminar(compraId)
    console.log(eliminar)
    if (activation!==true){
      console.log(' la activavcion es ',activation)
    }
    try{      
      console.log(activation)
      const resp = await axios.delete(`/api/users/`, {
        params:{Id:eliminar}
      }).catch((error) => {
        console.log("catch: ", error.message);
      });
      if (resp && resp.data) {
        console.log('DeleteUsers->resp.data: ', resp.data);
        getUsers();
        setShowWarning(false)
        setEliminar(0)
        setActivation(false)
    }
    }catch(error){console.error(error)} }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value: string | number = '';
    console.log("Name:", e.target.name);
    console.log("Value:", value);
  
    // Actualizar el estado de la compra con el nuevo valor del campo
    console.log("Setting compra field:", e.target.name);
    setUser(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  }

  const handleEditConfirmation = async (e:SyntheticEvent) => {
    e.preventDefault()
      const inputUser=e.target as HTMLInputElement;
      const inputValu=inputUser.value
      const userValid=users.find(usuario=>usuario.User===inputValu)
      if (userValid?.Rol==='Admin'){
        setActivation(true);
        // Oculta el mensaje de advertencia después de la confirmación
        setShowWarning(false); 
      }
    };
      
  const cancel=()=>{
    setShowWarning(false)
    setUser({
        id_User: 0,
        User: '',
        Password: '',
        Rol: '',
      });
    window.location.href = '/inicio';

  }

  const Roles=['Admin','Empleado']
  return (
    <div className='contenedor'>
        <div className='cont_form'>
          <form>
            <br/>
            <p><strong>ROLO Autorepuestos</strong></p>
            <label className='label' htmlFor=''> <strong>User</strong> </label><br/>
            <input type='text' name='User' onChange={handleChange}  value={user.User} className='input_login' placeholder='Usuario'/><br />
            <label className='label' htmlFor=''> <strong>Pass</strong> </label><br/>
            <input type='Text' name='Password' onChange={handleChange} value={user.Password} className='input_login' placeholder='Contraseña' /><br />
            <label className='label' htmlFor=''> <strong>Rol</strong> </label><br/>
            <select name="Rol"  onChange={handleChange} value={user.Rol} className='input_login1'><br/>                                                            
                <option value="">selecione un Rol</option>
                {Roles.map((Rol,index)=>(
                  <option value={Rol} key={index}>{Rol}</option>
                ))}
            </select><br/>
            <div style={{ marginTop: "5px" }}>
                <button className='button' onClick={UpdateUsers}>Editar User</button>
                <button className='button'>   
                  <Link href="/inicio">
                    Cancel
                  </Link>        
                </button>
            </div>
          </form>
        </div>


        <div className='Table_Users'>
            <table className='contend_Users' style={{ border: 'solid gray 2px', padding: '5px' }}>
                <thead>
                    <tr className='tr'>
                        <th>Id User</th>
                        <th>User</th>
                        <th>Rol</th>
                        <th>Acciones</th>   
                    </tr>
                </thead>
                <tbody >
                    {users.map((user: User) => (
                    <tr className='tr' key={user.id_User}>
                    <td>{user.id_User}</td>
                    <td>{user.User}</td>
                    <td>{user.Rol}</td>
                    <td>
                        <button onClick={() => EditUsers(user.id_User)} className='button_Edit' >Editar</button>
                        <button onClick={() => DeleteUsers(user.id_User)} className='button_Delete' >Eliminar</button>
                    </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {showWarning && (
        <div className="modal">
          <p className='text' > <strong>¿ ingrese su usuario para editar su Usuario ?</strong></p>
          <input className='confirmation' type="text" id='User' name='User' placeholder='User' onChange={handleEditConfirmation}/>
          <button className='cancel' onClick={cancel}> <strong>X</strong> </button>
        </div>
      )}
    </div>
  );
}


export default Use;
