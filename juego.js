import React, { useState, useCallback } from 'react';

// =================================================================
// 1. DATA DEL JUEGO
// =================================================================

const PREGUNTAS_TRIVIA = [
  {
    pregunta: "¿Cuál hook de React se usa para efectos secundarios (side effects)?",
    opciones: [
      { textoRespuesta: "useState", esCorrecta: false },
      { textoRespuesta: "useEffect", esCorrecta: true },
      { textoRespuesta: "useContext", esCorrecta: false },
      { textoRespuesta: "useReducer", esCorrecta: false },
    ],
  },
  {
    pregunta: "¿Qué significa el acrónimo JSX en React?",
    opciones: [
      { textoRespuesta: "JavaScript XML", esCorrecta: true },
      { textoRespuesta: "JavaScript Extended", esCorrecta: false },
      { textoRespuesta: "JSON Xchange", esCorrecta: false },
      { textoRespuesta: "Just Simple XML", esCorrecta: false },
    ],
  },
  {
    pregunta: "¿Qué librería de gestión de estado es a menudo utilizada junto a React en proyectos grandes?",
    opciones: [
      { textoRespuesta: "jQuery", esCorrecta: false },
      { textoRespuesta: "Redux", esCorrecta: true },
      { textoRespuesta: "Bootstrap", esCorrecta: false },
      { textoRespuesta: "Sass", esCorrecta: false },
    ],
  },
];

// =================================================================
// 2. COMPONENTE PRINCIPAL DEL JUEGO
// =================================================================

const JuegoTrivia = () => {
  // --- Estados del Juego ---
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [puntuacion, setPuntuacion] = useState(0);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null); // Para el feedback visual

  // --- Lógica de Manejo de Respuesta (Optimizada con useCallback) ---
  const handleRespuestaClick = useCallback((esCorrecta, index) => {
    // 1. Bloquear selección y dar feedback visual
    if (respuestaSeleccionada !== null) return;
    setRespuestaSeleccionada(index);

    if (esCorrecta) {
      setPuntuacion(prevPuntuacion => prevPuntuacion + 1);
    }

    // 2. Mover a la siguiente pregunta después de un breve retraso
    setTimeout(() => {
      const siguientePregunta = preguntaActual + 1;
      
      if (siguientePregunta < PREGUNTAS_TRIVIA.length) {
        setPreguntaActual(siguientePregunta);
        setRespuestaSeleccionada(null);
      } else {
        setJuegoTerminado(true); // Termina el juego
      }
    }, 1500); // 1.5 segundos de retraso para el feedback
  }, [preguntaActual, respuestaSeleccionada]);


  // --- Lógica de Reinicio ---
  const handleReiniciarJuego = useCallback(() => {
    setPreguntaActual(0);
    setPuntuacion(0);
    setJuegoTerminado(false);
    setRespuestaSeleccionada(null);
  }, []);


  // --- Renderizado Condicional de Pantallas ---

  if (juegoTerminado) {
    return (
      <PantallaResultado
        puntuacion={puntuacion}
        totalPreguntas={PREGUNTAS_TRIVIA.length}
        onRestart={handleReiniciarJuego}
      />
    );
  }

  // Si el juego no ha terminado, mostramos la pregunta actual
  return (
    <PantallaPregunta
      preguntaData={PREGUNTAS_TRIVIA[preguntaActual]}
      preguntaNumero={preguntaActual + 1}
      totalPreguntas={PREGUNTAS_TRIVIA.length}
      onAnswerClick={handleRespuestaClick}
      respuestaSeleccionada={respuestaSeleccionada}
    />
  );
};


// =================================================================
// 3. SUBCOMPONENTES DE VISTA
// =================================================================

// --- Componente: Muestra la pregunta y las opciones ---
const PantallaPregunta = ({
  preguntaData,
  preguntaNumero,
  totalPreguntas,
  onAnswerClick,
  respuestaSeleccionada
}) => {
  return (
    <div className="trivia-container">
      <div className="seccion-pregunta">
        <div className="contador-pregunta">
          Pregunta {preguntaNumero} / {totalPreguntas}
        </div>
        <div className="texto-pregunta">{preguntaData.pregunta}</div>
      </div>
      <div className="seccion-opciones">
        {preguntaData.opciones.map((opcion, index) => {
          let claseBoton = 'boton-opcion';

          // Lógica avanzada para el feedback visual después de la selección
          if (respuestaSeleccionada !== null) {
            if (index === respuestaSeleccionada) {
              // El botón que el usuario seleccionó
              claseBoton = opcion.esCorrecta ? 'boton-correcto' : 'boton-incorrecto';
            } else if (opcion.esCorrecta) {
              // Muestra el botón correcto si el usuario ya respondió (aunque haya fallado)
              claseBoton = 'boton-correcto-despues'; 
            }
          }

          return (
            <button
              key={index}
              onClick={() => onAnswerClick(opcion.esCorrecta, index)}
              className={claseBoton}
              disabled={respuestaSeleccionada !== null} // Bloquea los botones después de la selección
            >
              {opcion.textoRespuesta}
            </button>
          );
        })}
      </div>
      <p className="instruccion-feedback">
        {respuestaSeleccionada !== null ? 'Procesando respuesta...' : 'Selecciona una opción.'}
      </p>
    </div>
  );
};

// --- Componente: Muestra la puntuación final ---
const PantallaResultado = ({ puntuacion, totalPreguntas, onRestart }) => {
    const porcentaje = Math.round((puntuacion / totalPreguntas) * 100);
    const mensaje = porcentaje >= 70 ? "¡Felicidades, eres un experto en React!" : "Buen intento, sigue practicando.";

    return (
        <div className="resultado-container">
            <h2>Juego Terminado</h2>
            <p className="puntuacion-final">
                Tu puntuación es de **{puntuacion}** de {totalPreguntas}
            </p>
            <p className="porcentaje-final">
                {mensaje} ({porcentaje}%)
            </p>
            <button onClick={onRestart} className="boton-reiniciar">
                Volver a Jugar
            </button>
        </div>
    );
};


// =================================================================
// 4. ESTILOS (Usando un bloque de estilo simple para JSX)
// =================================================================
const Estilos = () => (
    <style jsx global>{`
      .trivia-container, .resultado-container {
        max-width: 600px;
        margin: 50px auto;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        background-color: #ffffff;
        font-family: Arial, sans-serif;
      }
      .seccion-pregunta {
        margin-bottom: 25px;
        padding: 15px;
        background: #e1f5fe;
        border-radius: 8px;
      }
      .contador-pregunta {
        font-size: 0.9em;
        color: #0277bd;
        margin-bottom: 10px;
        font-weight: bold;
      }
      .texto-pregunta {
        font-size: 1.5em;
        font-weight: 600;
        color: #333;
      }
      .seccion-opciones {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      .boton-opcion, .boton-reiniciar {
        padding: 15px;
        font-size: 1.1em;
        border: 2px solid #bdbdbd;
        border-radius: 8px;
        background-color: #f0f0f0;
        cursor: pointer;
        transition: all 0.3s;
        text-align: left;
      }
      .boton-opcion:hover:not(:disabled) {
        background-color: #e0e0e0;
        border-color: #9e9e9e;
      }
      .boton-correcto {
        background-color: #4caf50;
        color: white;
        border-color: #388e3c;
      }
      .boton-incorrecto {
        background-color: #f44336;
        color: white;
        border-color: #d32f2f;
      }
      .boton-correcto-despues {
        background-color: #a5d6a7; 
        border-color: #388e3c;
        color: #333;
      }
      .boton-opcion:disabled {
        cursor: not-allowed;
      }
      .resultado-container {
        text-align: center;
        background-color: #e8f5e9;
      }
      .puntuacion-final {
        font-size: 1.3em;
        margin: 15px 0;
      }
      .porcentaje-final {
        font-size: 1.1em;
        color: #004d40;
      }
      .boton-reiniciar {
        margin-top: 25px;
        background-color: #009688;
        color: white;
      }
      .instruccion-feedback {
          text-align: center;
          margin-top: 20px;
          color: #757575;
          font-style: italic;
      }
    `}</style>
);


// Componente que junta el juego y los estilos (para entornos como CodeSandbox)
const AppJuegoTrivia = () => (
    <>
        <JuegoTrivia />
        <Estilos />
    </>
);

export default AppJuegoTrivia;