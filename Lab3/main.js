document.addEventListener("DOMContentLoaded", () => {
  // Game State
  let turno = 'X';
  let jugadasX = []; // Plays from player X
  let jugadasO = []; // Plays from player O
  let juegoActivo = true; // Control if the game is active or not
  let puntosX = 0;
  let puntosO = 0;
  let modoIA = true;
  // HTML Elements
  const casillas = document.querySelectorAll('.one, .two, .three, .four, .five, .six, .seven, .eight, .nine');
  const displayTurno = document.querySelector('.display_player');
  const reset = document.querySelector('.reset');
  const btnNewGame = document.querySelector('.new_game');
  const PointsX = document.querySelector('#val_puntosX');
  const PointsO = document.querySelector('#val_puntosO');
  const btnAmigo = document.querySelector('.btn_amigo');
  const btnIA = document.querySelector('.btn_ia');
  // Initialize display
  displayTurno.textContent = turno;

  function actualizarMarcador() {
    PointsX.textContent = puntosX;
    PointsO.textContent = puntosO;
  }

  // 8 winning combinations
  const combinacionesGanadoras = [
    ['one', 'two', 'three'], // Horizontals
    ['four', 'five', 'six'], 
    ['seven', 'eight', 'nine'], 
    ['one', 'four', 'seven'], // Verticals
    ['two', 'five', 'eight'], 
    ['three', 'six', 'nine'], 
    ['one', 'five', 'nine'], // Diagonals
    ['three', 'five', 'seven'] 
  ];

  // Check if someone wins
  function comprobarVictoria(jugadasDelJugador) {
    for (let i = 0; i < combinacionesGanadoras.length; i++) {
      const combinacion = combinacionesGanadoras[i];
      
      const haGanado = combinacion.every(casilla => jugadasDelJugador.includes(casilla));
      
      if (haGanado) {
        return true;
      }
    }
    return false;
  }

  function turnoIA() {
        if (!juegoActivo) return;

        // AI reads the board
        let tableroVirtual = [];
        casillas.forEach(c => {
            let textoCasilla = c.querySelector('.xo').textContent;
            tableroVirtual.push(textoCasilla);
        });

        // Points on the board
        function evaluar(tablero) {
            const lineas = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontals
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticals
                [0, 4, 8], [2, 4, 6]             // Diagonals
            ];
            for (let i = 0; i < lineas.length; i++) {
                const a = lineas[i][0];
                const b = lineas[i][1];
                const c = lineas[i][2];
                
                if (tablero[a] !== '' && tablero[a] === tablero[b] && tablero[a] === tablero[c]) {
                    if (tablero[a] === 'O') return 10;
                    if (tablero[a] === 'X') return -10;
                }
            }
            return 0; // If no one has won
        }

        // Minimax
        function minimax(tablero, profundidad, esTurnoIA) {
            let score = evaluar(tablero);

            if (score === 10) return score - profundidad;
            if (score === -10) return score + profundidad;
            if (!tablero.includes("")) return 0; // Empate

            if (esTurnoIA) {
                let mejor = -Infinity;
                for (let i = 0; i < 9; i++) {
                    if (tablero[i] === "") {
                        tablero[i] = 'O';
                        let puntuacion = minimax(tablero, profundidad + 1, false);
                        mejor = Math.max(mejor, puntuacion);
                        tablero[i] = "";
                    }
                }
                return mejor;
            } else {
                let mejor = Infinity;
                for (let i = 0; i < 9; i++) {
                    if (tablero[i] === "") {
                        tablero[i] = 'X';
                        let puntuacion = minimax(tablero, profundidad + 1, true);
                        mejor = Math.min(mejor, puntuacion);
                        tablero[i] = "";
                    }
                }
                return mejor;
            }
        }

        // AI chooses the best move
        let mejorPuntuacion = -Infinity;
        let movimientoElegido = -1;

        for (let i = 0; i < 9; i++) {
            if (tableroVirtual[i] === "") {
                tableroVirtual[i] = 'O';
                
                let puntuacion = minimax(tableroVirtual, 0, false); 
                
                tableroVirtual[i] = "";

                if (puntuacion > mejorPuntuacion) {
                    mejorPuntuacion = puntuacion;
                    movimientoElegido = i;
                }
            }
        }

        // AI moves
        if (movimientoElegido !== -1) {
            casillas[movimientoElegido].click();
        }
  }

  btnAmigo.addEventListener('click', function() {
    modoIA = false;
    limpiarTablero();
    alert("Mode: Player vs Friend");
  });

  btnIA.addEventListener('click', function() {
    modoIA = true;
    limpiarTablero();
    alert("Mode: Player vs Artificial Intelligence");
  });

  reset.addEventListener('click', function() {
    turno = 'X';
    jugadasX = [];
    jugadasO = [];
    juegoActivo = true;
    puntosO = 0;
    puntosX = 0;
    actualizarMarcador();

    displayTurno.textContent = turno;

    casillas.forEach(casilla => {
      const span = casilla.querySelector('.xo');
      span.textContent = "";
    });
  });

  casillas.forEach(casilla => {
    casilla.addEventListener('click', function() {
      const span = casilla.querySelector('.xo');
      if (juegoActivo === true && span.textContent === '') {
        
        const nombreCasilla = casilla.classList[0];
        
        span.textContent = turno;

        if (turno === 'X') {
          jugadasX.push(nombreCasilla);
          if (comprobarVictoria(jugadasX)) {
            puntosX++;
            actualizarMarcador();
            juegoActivo = false;
            setTimeout(() => alert("¡X has won!"), 50);
          }
        } else {
          jugadasO.push(nombreCasilla);
          if (comprobarVictoria(jugadasO)) {
            puntosO++;
            actualizarMarcador();
            juegoActivo = false;
            setTimeout(() => alert("¡O has won!"), 50);
          }
        }
        
        if (jugadasX.length + jugadasO.length === 9 && juegoActivo) {
          alert("¡Es un empate!");
          juegoActivo = false;
        }
        if (juegoActivo === true) {
          if (turno === 'X') {
            turno = 'O';
          } else {
            turno = 'X';
          }
          displayTurno.textContent = turno;
          
          if (juegoActivo && turno === 'O' && modoIA === true) {
            temporizadorIA = setTimeout(turnoIA, 500); 
          }
        }
        
      }
    });
  });

  function limpiarTablero() {
      turno = 'X';
      jugadasX = [];
      jugadasO = [];
      juegoActivo = true;
      displayTurno.textContent = turno;
      casillas.forEach(casilla => {
          const span = casilla.querySelector('.xo');
          span.textContent = "";
      });
  }
  btnNewGame.addEventListener('click', limpiarTablero);
});
