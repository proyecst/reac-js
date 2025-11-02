import React, { useState } from 'react';

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true); // Alterna entre Login y Registro
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validate = () => {
    if (!email.includes('@')) {
      setError('Por favor, ingresa un email válido.');
      return false;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    if (isLogin) {
      // Lógica de Login:
      console.log(`Intentando iniciar sesión con: ${email}`);
      // Aquí se enviaría la solicitud a Firebase/Supabase/API
      alert('Login exitoso (simulado).');
    } else {
      // Lógica de Registro:
      console.log(`Intentando registrar nuevo usuario: ${email}`);
      // Aquí se enviaría la solicitud de registro
      alert('Registro exitoso (simulado).');
    }
    
    // Resetear campos
    setEmail('');
    setPassword('');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <button type="submit" style={{ padding: '10px 15px', background: 'green', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {isLogin ? 'Entrar' : 'Crear Cuenta'}
        </button>
      </form>

      <p style={{ marginTop: '15px' }}>
        {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes una cuenta?'}
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer', marginLeft: '5px' }}>
          {isLogin ? 'Regístrate aquí' : 'Inicia Sesión'}
        </button>
      </p>
    </div>
  );
}

export default AuthForm;