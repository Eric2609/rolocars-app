'use client'
import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '@prisma/client';
import '../../src/app/globals.css'
function Register() {
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

  const register = async (e: SyntheticEvent) => {
    e.preventDefault();
    if ( !activation) {
      console.log('Usuario admin no encontrado o no tiene permisos');
      return;
      window.location.href = '/';
    }
    try {
      const resp = await axios.post('/api/users', {
        id_User: user.User, // Usar el id del usuario seleccionado
        User: user.User,
        Password: user.Password,
        Rol:user.Rol,
      });
      if (resp && resp.data) {
        console.log('register->resp.data: ', resp.data);
        getUsers();
        window.location.href = '/';
      }
      ResetUsers();
    } catch (error) {
      console.error('Error al agregar la compra:', error);
    }
  };

  const ResetUsers = () => {
    setUser(prevState => ({ ...prevState, id_User: 0,User:'',Password:'',Rol:''}));
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let value: string | number = '';
    console.log("Name:", e.target.name);
    console.log("Value:", value);
  
    
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
        
        setShowWarning(false); 
      }
    };

const cancel = (e?: SyntheticEvent) => {
  e?.preventDefault(); // Detiene el envío del formulario si proviene de un botón dentro del form
  setShowWarning(false);
  window.location.href = '/';
};


  const Roles=['Admin','Empleado']
  return (
    <div className='contenedor'>
        <div className='login'>
          <form>
            <br/>
            <p><strong>ROLO - Autorepuestos</strong></p>
            <label htmlFor=''> <strong>New User</strong> </label>
            <input type='text' name='User' onChange={handleChange}  value={user.User} className='input_login' placeholder='Usuario'/><br />
            <label htmlFor=''> <strong>Pass</strong> </label>
            <input type='text' name='Password' onChange={handleChange} value={user.Password} className='input_login1' placeholder='Contraseña' /><br />
            <label htmlFor=''> <strong>Rol</strong> </label>
            <select name="Rol"  onChange={handleChange} value={user.Rol} className='input_login2'>                                                            
                <option value="">selecione un Rol</option>
                {Roles.map((Rol,index)=>(
                  <option value={Rol} key={index}>{Rol}</option>
                ))}
            </select>
            <div style={{ marginTop: '30px' }}>
              <button className='login_inicio' onClick={register}>Registrar</button>
              <button className='login_inicio' onClick={cancel}>Cancelar</button>
            </div>
          </form>
        </div>
        {showWarning && (
        <div className="warning-modal">
          <p>¿ingrese su usuario Admin para registrar un usuario?</p>
          <input type="text" id='User' name='User' placeholder='User' onChange={handleEditConfirmation}/>
          <button onClick={cancel}> <strong>X</strong> </button>
        </div>
      )}
    </div>
  );
}

export default Register;

