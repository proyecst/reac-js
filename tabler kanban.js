import React, { useState } from 'react';
// Importación de la librería de Drag and Drop
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; 

// Datos iniciales de ejemplo (Estado complejo)
const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Configurar el servidor' },
    'task-2': { id: 'task-2', content: 'Diseñar la base de datos' },
    'task-3': { id: 'task-3', content: 'Implementar el login' },
    'task-4': { id: 'task-4', content: 'Crear el primer componente' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'Por Hacer',
      taskIds: ['task-1', 'task-2'],
    },
    'column-2': {
      id: 'column-2',
      title: 'En Progreso',
      taskIds: ['task-3'],
    },
    'column-3': {
      id: 'column-3',
      title: 'Terminado',
      taskIds: ['task-4'],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

// Componente individual de la Tarea (Draggable)
const Task = ({ task, index }) => (
  <Draggable draggableId={task.id} index={index}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={{
          padding: '8px', margin: '0 0 8px 0', 
          backgroundColor: 'white', border: '1px solid lightgrey', 
          borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          ...provided.draggableProps.style // Para el estilo de arrastre
        }}
      >
        {task.content}
      </div>
    )}
  </Draggable>
);

// Componente de Columna (Droppable)
const Column = ({ column, tasks }) => (
  <div style={{ margin: '8px', border: '1px solid lightgrey', borderRadius: '4px', width: '250px', display: 'flex', flexDirection: 'column' }}>
    <h3 style={{ padding: '8px' }}>{column.title}</h3>
    <Droppable droppableId={column.id}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{ padding: '8px', flexGrow: 1, minHeight: '100px', backgroundColor: provided.isDraggingOver ? 'skyblue' : 'lightgrey' }}
        >
          {tasks.map((task, index) => (
            <Task key={task.id} task={task} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </div>
);

// Componente Principal del Tablero Kanban
function KanbanBoard() {
  const [board, setBoard] = useState(initialData);

  // LÓGICA CENTRAL: Mueve el estado después de que el arrastre termina
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // 1. Si se suelta fuera de cualquier zona o en el mismo lugar, no hacer nada
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }
    
    const startColumn = board.columns[source.droppableId];
    const finishColumn = board.columns[destination.droppableId];

    // --- ESCENARIO 1: Movimiento dentro de la misma columna ---
    if (startColumn === finishColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1); // Quitar de la posición original
      newTaskIds.splice(destination.index, 0, draggableId); // Insertar en la nueva posición

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      };

      const newBoard = {
        ...board,
        columns: {
          ...board.columns,
          [newColumn.id]: newColumn,
        },
      };

      setBoard(newBoard);
      return;
    }

    // --- ESCENARIO 2: Movimiento a una columna diferente ---
    
    // 1. Remover de la columna inicial
    const startTaskIds = Array.from(startColumn.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStartColumn = {
      ...startColumn,
      taskIds: startTaskIds,
    };

    // 2. Insertar en la columna final
    const finishTaskIds = Array.from(finishColumn.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinishColumn = {
      ...finishColumn,
      taskIds: finishTaskIds,
    };

    // 3. Actualizar el estado del tablero
    const newBoard = {
      ...board,
      columns: {
        ...board.columns,
        [newStartColumn.id]: newStartColumn,
        [newFinishColumn.id]: newFinishColumn,
      },
    };

    setBoard(newBoard);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex' }}>
        {board.columnOrder.map(columnId => {
          const column = board.columns[columnId];
          const tasks = column.taskIds.map(taskId => board.tasks[taskId]);

          return <Column key={column.id} column={column} tasks={tasks} />;
        })}
      </div>
    </DragDropContext>
  );
}

export default KanbanBoard;