// TareasContext.js (Manejo de Estado Global)
import React, { createContext } from 'react';
import { useTareas } from './useTareas';

export const TareasContext = createContext();

export const TareasProvider = ({ children }) => {
  // Usamos el hook de lógica aquí
  const tareasState = useTareas([
    { id: 1, texto: 'Configurar Next.js', completada: false },
    { id: 2, texto: 'Implementar Redux/Zustand', completada: true },
  ]);

  return (
    // Proveemos todo el estado y las funciones a la aplicación
    <TareasContext.Provider value={tareasState}>
      {children}
    </TareasContext.Provider>
  );
};