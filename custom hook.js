// useTareas.js (Lógica de Tareas con manejo de Estado avanzado)
import { useReducer, useCallback } from 'react';

// 1. Definición del Reducer (Lógica Central de Estado)
const tareasReducer = (state, action) => {
  switch (action.type) {
    case 'AGREGAR_TAREA':
      return [
        ...state,
        { id: Date.now(), texto: action.payload, completada: false }
      ];
    case 'TOGGLE_TAREA':
      return state.map(tarea =>
        tarea.id === action.payload ? { ...tarea, completada: !tarea.completada } : tarea
      );
    // ... más casos (ELIMINAR, FILTRAR, etc.)
    default:
      return state;
  }
};

// 2. El Custom Hook
export const useTareas = (initialState = []) => {
  const [tareas, dispatch] = useReducer(tareasReducer, initialState);

  // Optimizando la función con useCallback para evitar re-renderizados innecesarios
  const agregarTarea = useCallback((texto) => {
    dispatch({ type: 'AGREGAR_TAREA', payload: texto });
  }, []);

  const toggleTarea = useCallback((id) => {
    dispatch({ type: 'TOGGLE_TAREA', payload: id });
  }, []);

  return {
    tareas,
    agregarTarea,
    toggleTarea,
  };
};