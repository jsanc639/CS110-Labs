import { useState } from 'react';

function Square({ value, onSquareClick, isWinner }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={{ background: isWinner ? '#d4edff' : '#fff' }}
    >
      {value}
    </button>
  );
}

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function calculateWinner(squares) {
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [scores, setScores] = useState({ X: 0, O: 0 });

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);

    const result = calculateWinner(nextSquares);
    if (result) {
      setScores(prev => ({ ...prev, [result.winner]: prev[result.winner] + 1 }));
    }
  }

  function handleNewGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  const result = calculateWinner(squares);
  const winLine = result ? result.line : [];
  const isDraw = !result && squares.every(Boolean);

  let status;
  if (result) {
    status = `Winner: ${result.winner}!`;
  } else if (isDraw) {
    status = "It's a draw!";
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
        <div style={{ padding: '8px 20px', border: xIsNext && !result && !isDraw ? '2px solid #378add' : '1px solid #999', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#888' }}>Player X</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{scores.X}</div>
        </div>
        <div style={{ padding: '8px 20px', border: !xIsNext && !result && !isDraw ? '2px solid #378add' : '1px solid #999', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: '#888' }}>Player O</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{scores.O}</div>
        </div>
      </div>

      <div className="status">{status}</div>

      <div className="board-row">
        {[0, 1, 2].map(i => (
          <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} isWinner={winLine.includes(i)} />
        ))}
      </div>
      <div className="board-row">
        {[3, 4, 5].map(i => (
          <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} isWinner={winLine.includes(i)} />
        ))}
      </div>
      <div className="board-row">
        {[6, 7, 8].map(i => (
          <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} isWinner={winLine.includes(i)} />
        ))}
      </div>

      <button onClick={handleNewGame} style={{ marginTop: '16px', padding: '8px 20px', fontSize: '15px', cursor: 'pointer', borderRadius: '6px', border: '1px solid #999' }}>
        New Game
      </button>
    </>
  );
}