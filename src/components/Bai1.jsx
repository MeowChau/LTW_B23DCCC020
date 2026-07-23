import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';

const Bai1 = () => {
  const [target, setTarget] = useState(0);
  const [guess, setGuess] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(10);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [bestRecord, setBestRecord] = useState(() => {
    const saved = localStorage.getItem('guessGameBestRecord');
    return saved ? parseInt(saved, 10) : null;
  });

  const initGame = () => {
    setTarget(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setAttemptsLeft(10);
    setMessage('');
    setHistory([]);
    setGameOver(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleGuess = (e) => {
    e.preventDefault();
    if (gameOver || attemptsLeft <= 0) return;

    const numGuess = parseInt(guess, 10);
    if (isNaN(numGuess) || numGuess < 1 || numGuess > 100) {
      setMessage('Vui lòng nhập một số từ 1 đến 100.');
      return;
    }

    let currentMessage = '';
    let isGameOver = false;

    if (numGuess === target) {
      currentMessage = 'Chúc mừng! Bạn đã đoán đúng!';
      isGameOver = true;
      const attemptsUsed = 10 - attemptsLeft + 1;
      if (bestRecord === null || attemptsUsed < bestRecord) {
        setBestRecord(attemptsUsed);
        localStorage.setItem('guessGameBestRecord', attemptsUsed);
      }
    } else if (numGuess < target) {
      currentMessage = 'Bạn đoán quá thấp!';
    } else {
      currentMessage = 'Bạn đoán quá cao!';
    }

    const newAttempts = attemptsLeft - 1;

    if (newAttempts === 0 && numGuess !== target) {
      currentMessage = `Bạn đã hết lượt! Số đúng là ${target}.`;
      isGameOver = true;
    }

    setMessage(currentMessage);
    setAttemptsLeft(newAttempts);
    setHistory([{ guess: numGuess, feedback: currentMessage }, ...history]);
    setGameOver(isGameOver);
    setGuess('');
  };

  return (
    <div>
      <Link to="/" className="btn btn-outline back-btn">
        <ArrowLeft size={16} /> Quay lại menu chọn bài
      </Link>

      <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 className="text-center mb-2">Trò chơi Đoán Số</h2>
        
        {bestRecord !== null && (
          <div className="text-center mb-4" style={{ color: 'var(--warning)', fontWeight: 'bold' }}>
            🏆 Kỷ lục tốt nhất của bạn: {bestRecord} lượt
          </div>
        )}

        <p className="text-center mb-4" style={{ color: 'var(--text-muted)' }}>
          Hệ thống đã sinh ra một số từ 1 đến 100. Bạn có {attemptsLeft} lượt dự đoán.
        </p>

        <form onSubmit={handleGuess} className="form-row mb-4">
          <input
            type="number"
            className="input-field"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            disabled={gameOver}
            placeholder="Nhập số từ 1-100"
            autoFocus
          />
          <button type="submit" className="btn btn-primary" disabled={gameOver}>
            Đoán
          </button>
        </form>

        {message && (
          <div className={`glass-card mb-4 text-center ${gameOver && target === parseInt(history[0]?.guess, 10) ? 'btn-success' : 'btn-danger'}`} style={{ padding: '1rem' }}>
            <strong>{message}</strong>
          </div>
        )}

        {gameOver && (
          <div className="text-center mb-4">
            <button onClick={initGame} className="btn btn-primary">
              <RotateCcw size={16} /> Chơi lại
            </button>
          </div>
        )}

        {history.length > 0 && (
          <div>
            <h3>Lịch sử đoán:</h3>
            <div className="grid gap-4 mt-2">
              {history.map((h, i) => (
                <div key={i} className="list-item">
                  <span>Lần {history.length - i}: <strong>{h.guess}</strong></span>
                  <span style={{ color: h.guess === target ? 'var(--success)' : 'var(--warning)' }}>
                    {h.feedback}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bai1;
