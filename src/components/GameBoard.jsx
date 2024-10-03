import React, { useState, useEffect } from 'react';
import Card from './Card';

const cardImages = [
  { src: '/img/cake.jpg', matched: false },
  { src: '/img/kiwi.jpg', matched: false },
  { src: '/img/mango.jpg', matched: false },
  { src: '/img/pappaya.jpg', matched: false },
  { src: '/img/pudding.jpg', matched: false },
  { src: '/img/strewberry.jpg', matched: false },
];

const MAX_TURNS = 15;

const GameBoard = () => {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);

  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
    setGameWon(false);
    setGameLost(false);
  };

  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            }
            return card;
          });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  useEffect(() => {
    if (cards.length && cards.every((card) => card.matched)) {
      setGameWon(true);
    }

    if (turns >= MAX_TURNS) {
      setGameLost(true);
    }
  }, [cards, turns]);

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  useEffect(() => {
    shuffleCards();
  }, []);

  return (
    <div className={`game-board-wrapper ${gameWon || gameLost ? 'modal-active' : ''}`}>
      <div className="game-board">
        <div className="info-container">
          <p style={{ animation: 'zoomOut 2s infinite' }}>
            Turns: {turns}/{MAX_TURNS}
          </p>
          <div
            className="icon-container"
            onClick={shuffleCards}
            style={{ cursor: 'pointer', marginLeft: '10px' }}
          >
            <i
              className="fa-solid fa-rotate-right"
              style={{ color: '#ed7864', fontSize: '24px' }}
            ></i>
          </div>
        </div>

        <h1 style={{ marginBottom: '30px', marginTop: '8px', color: 'brown' }}>Memory Match</h1>

        <div className="card-grid">
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              handleChoice={handleChoice}
              flipped={card === choiceOne || card === choiceTwo || card.matched}
              disabled={disabled}
            />
          ))}
        </div>
      </div>

      {/* Modal for Game Won */}
      {gameWon && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={shuffleCards}>&times;</span>
            <h2>Congratulations! You Won!</h2>
            <img
              src="https://i.pinimg.com/originals/a1/fd/87/a1fd87876500fd25a9423b7a7abb15a9.gif"
              alt="Winning gif"  width={200} 
            />
            <button className="form-control btn btn-outline-success" onClick={shuffleCards}>
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Modal for Game Lost */}
      {gameLost && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={shuffleCards}>&times;</span>
            <h2>Game Over!</h2>
            <img style={{display:"flex",justifyContent:"center"}}
              src="https://i.pinimg.com/originals/f3/78/4d/f3784dc54de78b85eac662dc55ba64aa.gif"
              alt="Losing gif"  width={200} 
            />
            <button className="form-control btn btn-outline-danger" onClick={shuffleCards}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
