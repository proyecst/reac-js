// TareaFormulario.jsx (Componente de Interfaz/Vista)
import React, { useState, useContext } from 'react';
import { TareasContext } from './TareasContext'; // Importando el Contexto

const TareaFormulario = () => {
  const [input, setInput] = useState('');
  // 3. Accediendo a la lógica desde el Contexto global
  const { agregarTarea } = useContext(TareasContext); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      agregarTarea(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nueva tarea..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        // Manejo de focus avanzado con useRef/useEffect...
      />
      <button type="submit" disabled={!input.trim()}>
        Agregar
      </button>
    </form>
  );
};

export default TareaFormulario;