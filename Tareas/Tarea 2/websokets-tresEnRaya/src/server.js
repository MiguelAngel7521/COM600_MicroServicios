const WebSocket = require('ws');

const servidor = new WebSocket.Server({ port: 8080 });

let tablero = Array(9).fill('');
let turno = 'X';
let ganador = null;
const jugadores = new Map();

const combinaciones = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function revisarGanador() {
  for (const [a, b, c] of combinaciones) {
    if (tablero[a] &&
        tablero[a] === tablero[b] &&
        tablero[a] === tablero[c]) {
      return tablero[a];
    }
  }

  return tablero.includes('') ? null : 'Empate';
}

function enviarEstado() {
  jugadores.forEach((jugador, cliente) => {
    cliente.send(JSON.stringify({
      jugador,
      tablero,
      turno,
      ganador
    }));
  });
}

servidor.on('connection', (ws) => {
  if (jugadores.size >= 2) {
    ws.send(JSON.stringify({
      error: 'Ya existen dos jugadores.'
    }));
    ws.close();
    return;
  }

  const jugador = jugadores.size === 0 ? 'X' : 'O';
  jugadores.set(ws, jugador);

  enviarEstado();

  ws.on('message', (datos) => {
    const mensaje = JSON.parse(datos);

    if (mensaje.tipo === 'reiniciar') {
      tablero = Array(9).fill('');
      turno = 'X';
      ganador = null;
      enviarEstado();
      return;
    }

    const casilla = mensaje.casilla;

    if (ganador) return;

    //no es el turno del jugador
    if (jugadores.get(ws) !== turno) {
      ws.send(JSON.stringify({
        error: 'No es tu turno.'
      }));
      return;
    }

    //casilla ocupada
    if (tablero[casilla] !== '') {
      ws.send(JSON.stringify({
        error: 'Casilla ocupada.'
      }));
      return;
    }

    tablero[casilla] = turno;
    ganador = revisarGanador();

    if (!ganador) {
      turno = turno === 'X' ? 'O' : 'X';
    }

    enviarEstado();
  });

  ws.on('close', () => {
    jugadores.delete(ws);
  });
});

console.log('Servidor iniciado en el puerto 8080');