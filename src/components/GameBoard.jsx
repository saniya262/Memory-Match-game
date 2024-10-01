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

const MAX_TURNS = 15; // Set the maximum number of turns allowed

const GameBoard = () => {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false); // New state to track game loss

  // Shuffle cards and start a new game
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
    setGameWon(false);
    setGameLost(false); // Reset game lost state
  };

  // Handle a card choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  // Compare two selected cards
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

  // Check if all cards are matched or if maximum turns reached
  useEffect(() => {
    if (cards.length && cards.every((card) => card.matched)) {
      setGameWon(true);
    }

    // Check if the maximum turns have been reached
    if (turns >= MAX_TURNS) {
      setGameLost(true); // Set game lost state to true
    }
  }, [cards, turns]);

  // Reset choices and increase turn
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  // Start a new game on first render
  useEffect(() => {
    shuffleCards();
  }, []);

  return (
    <div className="game-board">
      <div className="info-container">
        <p style={{ animation: "zoomOut 2s infinite" }}>
          Turns: {turns}/{MAX_TURNS}
        </p>
        <div className="icon-container" onClick={shuffleCards} style={{ cursor: 'pointer', marginLeft: '10px' }}>
          <i className="fa-solid fa-rotate-right" style={{ color: '#ed7864', fontSize: '24px' }}></i>
        </div>
      </div>

      {gameWon && (
        <div className="winning-splash">
          <h2>Congratulations! You Won!</h2>
          <img src="https://i.pinimg.com/originals/a1/fd/87/a1fd87876500fd25a9423b7a7abb15a9.gif" alt="" />
          <button className='form-control btn btn-outline-success' onClick={shuffleCards}>Play Again</button>
        </div>
      )}

      {gameLost && (
        <div className="losing-splash">
          <h2>Game Over! You've reached the maximum number of turns.</h2>
          <img src="https://i.pinimg.com/originals/f3/78/4d/f3784dc54de78b85eac662dc55ba64aa.gif" alt="" />
          <button className='form-control btn btn-outline-danger' onClick={shuffleCards}>Play Again</button>
        </div>
      )}

      {!gameWon && !gameLost && (
        <>
          <h1 style={{ marginBottom: "50px", marginTop: "30px", color: "brown" }}>Memory Match</h1>
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
        </>
      )}
    </div>
  );
};

export default GameBoard;
