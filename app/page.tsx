'use client'
import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '@prisma/client';
import '../src/app/globals.css'
import Link from 'next/link'


function App() {

  const [showWarning, setShowWarning] = useState(false);
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
  const login = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      
      const existingUser = users.find(u => u.User === user.User && u.Password === user.Password);
      if (existingUser) {
        window.location.href = '/inicio';
      } else {
        
        window.location.reload();
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUser(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  return (
    <div className='contenedor'>
        <div className='login'>
          <form>
            <br/>
            <p> <strong>ROLO - Autorepuestos</strong> </p>
            <br/>
            <label htmlFor='user' className='form_text'> <strong>User</strong> </label>
            <input type='text' name='User' onChange={handleChange} className='input_login' placeholder='Usuario'/><br />
            <label htmlFor='password'  className='form_text'> <strong>Pass</strong> </label>
            <input type='password' name='Password' onChange={handleChange} className='input_login' placeholder='Contraseña' /><br />
            <div style={{ marginTop: '30px' }}>
              <button className='login_inicio' onClick={login}>Iniciar sesión</button>
              <Link href='/register' className='login_inicio'>Registrar</Link>
            </div>
          </form>
        </div>
    </div>
  );
}

export default App;






  











