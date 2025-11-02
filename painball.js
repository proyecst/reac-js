import React, { useReducer, useCallback } from 'react';

// =================================================================
// 1. LÓGICA DEL JUEGO (useReducer)
// =================================================================

const ACCIONES = {
  DISPARAR: 'DISPARAR',
  RECARGAR: 'RECARGAR',
  INICIAR: 'INICIAR',
  REINICIAR: 'REINICIAR',
  TERMINAR: 'TERMINAR',
};

// Configuración inicial de los jugadores
const CONFIG_INICIAL_JUGADOR = {
  salud: 100,
  municion: 5,
  score: 0,
};

// Estado inicial del juego
const ESTADO_INICIAL_JUEGO = {
  jugador1: { id: 'J1', nombre: 'Ranger', ...CONFIG_INICIAL_JUGADOR },
  jugador2: { id: 'J2', nombre: 'Delta', ...CONFIG_INICIAL_JUGADOR },
  turno: 'J1', // J1 o J2
  faseJuego: 'INICIO', // INICIO, JUGANDO, TERMINADO
  mensaje: 'Presiona INICIAR para comenzar la partida.',
  ganador: null,
};

// ------------------- REDUCER -------------------
const paintballReducer = (state, action) => {
  if (state.faseJuego !== 'JUGANDO' && action.type !== ACCIONES.INICIAR && action.type !== ACCIONES.REINICIAR) {
    return state; // Ignorar acciones si el juego no está activo
  }

  const { jugador1, jugador2, turno } = state;
  const jugadorActivo = turno === 'J1' ? jugador1 : jugador2;
  const jugadorOponente = turno === 'J1' ? jugador2 : jugador1;
  const ID_OPONENTE = jugadorOponente.id;
  
  // Función para cambiar de turno de forma inmutable
  const nextState = {
    ...state,
    turno: turno === 'J1' ? 'J2' : 'J1',
  };

  switch (action.type) {
    case ACCIONES.INICIAR:
      return {
        ...state,
        faseJuego: 'JUGANDO',
        mensaje: `¡Partida iniciada! Es el turno de ${jugador1.nombre}.`,
      };

    case ACCIONES.RECARGAR:
      const nuevaMunicion = jugadorActivo.municion + 3;
      return {
        ...nextState,
        [turno === 'J1' ? 'jugador1' : 'jugador2']: {
          ...jugadorActivo,
          municion: Math.min(nuevaMunicion, 10), // Máximo 10 de munición
        },
        mensaje: `${jugadorActivo.nombre} recargó.`,
      };

    case ACCIONES.DISPARAR:
      if (jugadorActivo.municion <= 0) {
        return { ...state, mensaje: `${jugadorActivo.nombre} no tiene munición. ¡Recarga!` };
      }

      // 1. Simulación de disparo y probabilidad de acierto (60%)
      const acierto = Math.random() < 0.6; 
      const danio = 25;

      const estadoDisparo = {
        ...nextState,
        [turno === 'J1' ? 'jugador1' : 'jugador2']: {
          ...jugadorActivo,
          municion: jugadorActivo.municion - 1, // Restar munición
        },
      };

      if (acierto) {
        // 2. Acertó: Restar vida al oponente
        const nuevaSaludOponente = jugadorOponente.salud - danio;

        if (nuevaSaludOponente <= 0) {
          // 3. Condición de Victoria
          return {
            ...state,
            faseJuego: 'TERMINADO',
            ganador: jugadorActivo.nombre,
            mensaje: `¡${jugadorActivo.nombre} ha ELIMINADO a ${jugadorOponente.nombre}!`,
            [turno === 'J1' ? 'jugador1' : 'jugador2']: { 
              ...jugadorActivo, 
              score: jugadorActivo.score + 1 
            },
            [ID_OPONENTE === 'J1' ? 'jugador1' : 'jugador2']: { 
              ...jugadorOponente, 
              salud: 0 
            },
          };
        }

        // 4. Acertó pero el oponente sigue vivo
        return {
          ...estadoDisparo,
          [ID_OPONENTE === 'J1' ? 'jugador1' : 'jugador2']: {
            ...jugadorOponente,
            salud: nuevaSaludOponente,
          },
          mensaje: `${jugadorActivo.nombre} acertó! ${jugadorOponente.nombre} pierde ${danio} de vida.`,
        };
      } else {
        // 5. Falló
        return {
          ...estadoDisparo,
          mensaje: `${jugadorActivo.nombre} falló el disparo.`,
        };
      }
      
    case ACCIONES.REINICIAR:
        const resetScoreJ1 = jugador1.score;
        const resetScoreJ2 = jugador2.score;
        return {
            ...ESTADO_INICIAL_JUEGO,
            faseJuego: 'JUGANDO',
            jugador1: { ...ESTADO_INICIAL_JUEGO.jugador1, score: resetScoreJ1 },
            jugador2: { ...ESTADO_INICIAL_JUEGO.jugador2, score: resetScoreJ2 },
            mensaje: '¡Nueva ronda! El juego ha sido reiniciado.',
        };
    
    default:
      return state;
  }
};

// =================================================================
// 2. COMPONENTES DE VISTA
// =================================================================

// --- Componente: Panel de Estadísticas y Acciones del Jugador ---
const PanelJugador = ({ jugador, esTurno, onAction }) => {
  const saludBar = `${(jugador.salud / 100) * 100}%`;
  
  return (
    <div className={`panel-jugador ${esTurno ? 'activo' : ''}`}>
      <h3>{jugador.nombre} {esTurno ? '🎯' : ''}</h3>
      <div className="salud-bar-bg">
        <div className="salud-bar" style={{ width: saludBar, backgroundColor: jugador.salud > 25 ? '#4CAF50' : '#F44336' }}></div>
      </div>
      <p>Vida: {jugador.salud} / 100</p>
      <p>Munición: {jugador.municion} / 10</p>
      <p>Rondas Ganadas: {jugador.score}</p>
      
      {esTurno && (
        <div className="acciones">
          <button onClick={() => onAction(ACCIONES.DISPARAR)} disabled={jugador.municion === 0}>
            🔫 Disparar
          </button>
          <button onClick={() => onAction(ACCIONES.RECARGAR)} disabled={jugador.municion === 10}>
            🔄 Recargar
          </button>
        </div>
      )}
    </div>
  );
};

// --- Componente: Puntuación y Mensajes del Juego ---
const Scoreboard = ({ state, onAction }) => {
  const { faseJuego, mensaje, ganador } = state;

  return (
    <div className="scoreboard">
      {faseJuego === 'INICIO' && (
        <button className="boton-inicio" onClick={() => onAction(ACCIONES.INICIAR)}>
          INICIAR PARTIDA
        </button>
      )}

      {faseJuego === 'JUGANDO' && (
        <h2 className="mensaje-juego">
          {mensaje}
        </h2>
      )}

      {faseJuego === 'TERMINADO' && (
        <div className="resultado-final">
          <h2>🎉 ¡GANADOR: {ganador}! 🎉</h2>
          <button className="boton-reiniciar" onClick={() => onAction(ACCIONES.REINICIAR)}>
            Jugar Otra Ronda
          </button>
        </div>
      )}
    </div>
  );
};


// =================================================================
// 3. COMPONENTE PRINCIPAL
// =================================================================

const JuegoPaintball = () => {
  const [gameState, dispatch] = useReducer(paintballReducer, ESTADO_INICIAL_JUEGO);

  // Envolvemos la función de dispatch para pasarla a los hijos (optimizada)
  const handleAction = useCallback((type) => {
    dispatch({ type });
  }, []);

  return (
    <div className="paintball-app">
      <h1>Paintball Arena 🔫</h1>
      
      <Scoreboard state={gameState} onAction={handleAction} />
      
      <div className="arena-layout">
        <PanelJugador
          jugador={gameState.jugador1}
          esTurno={gameState.turno === 'J1' && gameState.faseJuego === 'JUGANDO'}
          onAction={handleAction}
        />
        <PanelJugador
          jugador={gameState.jugador2}
          esTurno={gameState.turno === 'J2' && gameState.faseJuego === 'JUGANDO'}
          onAction={handleAction}
        />
      </div>

      <p className="reglas">
        **Reglas:** Turnos alternos. El disparo tiene 60% de probabilidad de acertar y quita 25 de vida. Máx. 10 de munición.
      </p>

      {/* Estilos */}
      <style jsx global>{`
        .paintball-app {
          font-family: 'Arial', sans-serif;
          text-align: center;
          padding: 20px;
          background-color: #f0f4f8;
          min-height: 100vh;
        }
        h1 { color: #00796b; }
        .arena-layout {
          display: flex;
          justify-content: space-around;
          margin-top: 30px;
          gap: 20px;
        }
        .panel-jugador {
          background: white;
          border: 2px solid #ccc;
          padding: 20px;
          border-radius: 10px;
          width: 45%;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: border-color 0.3s;
        }
        .panel-jugador.activo {
          border-color: #ff9800;
          box-shadow: 0 0 15px rgba(255, 152, 0, 0.5);
        }
        .salud-bar-bg {
          background: #e0e0e0;
          height: 20px;
          border-radius: 10px;
          margin: 10px 0;
          overflow: hidden;
        }
        .salud-bar {
          height: 100%;
          transition: width 0.5s ease-in-out, background-color 0.3s;
        }
        .acciones button {
          padding: 10px 20px;
          margin: 5px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.2s;
        }
        .acciones button:first-child { background-color: #4CAF50; color: white; }
        .acciones button:last-child { background-color: #2196F3; color: white; }
        .acciones button:disabled { background-color: #b0bec5; cursor: not-allowed; }
        .scoreboard { margin: 20px 0; min-height: 50px; }
        .mensaje-juego { color: #d32f2f; }
        .boton-inicio, .boton-reiniciar {
          padding: 15px 30px;
          font-size: 1.2em;
          background-color: #00796b;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
        .reglas { margin-top: 30px; font-size: 0.9em; color: #555; }
      `}</style>
    </div>
  );
};

export default JuegoPaintball;