import React, { useState } from 'react';

// --- Constantes de Simulación ---
const PIN_CORRECTO = '1234';
const SALDO_INICIAL = 1500;

// --- Componente Principal ---
const CajeroAutomatico = () => {
  // 1. Estado Global de la Sesión
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [balance, setBalance] = useState(SALDO_INICIAL);
  const [screen, setScreen] = useState('login'); // 'login', 'menu', 'balance', 'withdrawal', 'deposit', 'error'
  const [message, setMessage] = useState('');

  // --- Lógica del Cajero ---

  const handleLogin = (pin) => {
    if (pin === PIN_CORRECTO) {
      setIsLoggedIn(true);
      setScreen('menu');
      setMessage('Bienvenido!');
    } else {
      setMessage('PIN incorrecto. Intente de nuevo.');
    }
  };

  const handleWithdrawal = (amount) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setMessage('Ingrese un monto válido.');
    } else if (numAmount > balance) {
      setMessage('Saldo insuficiente.');
      setScreen('error');
    } else {
      setBalance(balance - numAmount);
      setMessage(`Retiro exitoso de $${numAmount}.`);
      setScreen('balance'); // Mostrar saldo después del retiro
    }
  };

  const handleDeposit = (amount) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setMessage('Ingrese un monto válido.');
    } else {
      setBalance(balance + numAmount);
      setMessage(`Depósito exitoso de $${numAmount}.`);
      setScreen('balance'); // Mostrar saldo después del depósito
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setScreen('login');
    setMessage('Gracias por usar nuestro cajero.');
  };

  // --- Componentes de Pantalla (Subcomponentes) ---

  const PantallaLogin = () => {
    const [pin, setPin] = useState('');
    const handleSubmit = (e) => {
      e.preventDefault();
      handleLogin(pin);
      setPin('');
    };

    return (
      <form onSubmit={handleSubmit} className="cajero-form">
        <h3>INSERTE SU TARJETA</h3>
        <p>PIN (Simulado: {PIN_CORRECTO})</p>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength="4"
          placeholder="Ingrese su PIN"
          required
        />
        <button type="submit">Aceptar</button>
      </form>
    );
  };

  const PantallaMenu = () => (
    <div className="cajero-menu">
      <h3>Seleccione una operación:</h3>
      <button onClick={() => setScreen('balance')}>1. Consultar Saldo</button>
      <button onClick={() => setScreen('withdrawal')}>2. Retirar Dinero</button>
      <button onClick={() => setScreen('deposit')}>3. Depositar Dinero</button>
      <button onClick={handleLogout}>4. Salir</button>
    </div>
  );

  const PantallaConsultaSaldo = () => (
    <div className="cajero-saldo">
      <h3>Su Saldo Actual:</h3>
      <p className="saldo-monto">${balance.toFixed(2)}</p>
      <button onClick={() => setScreen('menu')}>Volver al Menú</button>
    </div>
  );

  const PantallaTransaccion = ({ type }) => {
    const [amount, setAmount] = useState('');
    const action = type === 'Retiro' ? handleWithdrawal : handleDeposit;

    const handleSubmit = (e) => {
      e.preventDefault();
      action(amount);
      setAmount('');
    };

    return (
      <form onSubmit={handleSubmit} className="cajero-form">
        <h3>{type}</h3>
        <p>Ingrese el monto:</p>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Monto"
          min="1"
          required
        />
        <button type="submit">Confirmar</button>
        <button type="button" onClick={() => setScreen('menu')}>Cancelar</button>
      </form>
    );
  };

  // --- Renderizado Condicional de Pantallas ---

  const renderScreen = () => {
    if (!isLoggedIn) {
      return <PantallaLogin />;
    }

    switch (screen) {
      case 'menu':
        return <PantallaMenu />;
      case 'balance':
        return <PantallaConsultaSaldo />;
      case 'withdrawal':
        return <PantallaTransaccion type="Retiro" />;
      case 'deposit':
        return <PantallaTransaccion type="Depósito" />;
      default:
        // Por si hay un estado de pantalla desconocido
        return <PantallaMenu />;
    }
  };

  return (
    <div className="cajero-container">
      <div className="cajero-display">
        {/* Mensajes del Cajero */}
        <p className={`cajero-message ${message.includes('exitoso') ? 'success' : message.includes('incorrecto') || message.includes('insuficiente') ? 'error' : ''}`}>
          {message || (isLoggedIn ? 'Seleccione una opción' : 'Ingrese su PIN')}
        </p>
        
        {/* Renderiza la pantalla actual */}
        {renderScreen()}
      </div>

      {/* Saldo para depuración (opcional) */}
      <div className="cajero-debug">
        Estado Actual: {screen} | Saldo: ${balance.toFixed(2)}
      </div>

      <style jsx>{`
        .cajero-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 50px;
          font-family: Arial, sans-serif;
        }
        .cajero-display {
          border: 5px solid #004d40;
          border-radius: 10px;
          padding: 20px;
          width: 350px;
          background-color: #e0f2f1;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          text-align: center;
        }
        .cajero-message {
          height: 30px;
          font-weight: bold;
          color: #000;
          margin-bottom: 20px;
        }
        .cajero-menu button, .cajero-form button {
          display: block;
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          background-color: #00796b;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }
        .cajero-menu button:hover, .cajero-form button:hover {
          background-color: #004d40;
        }
        .cajero-form input {
          width: 80%;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 5px;
          text-align: center;
        }
        .saldo-monto {
          font-size: 2em;
          color: #004d40;
          font-weight: bold;
        }
        .success { color: green; }
        .error { color: red; }
        .cajero-debug { margin-top: 20px; font-size: 0.8em; color: #555; }
      `}</style>
    </div>
  );
};

export default CajeroAutomatico;