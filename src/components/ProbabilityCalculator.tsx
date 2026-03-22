import { useState, useMemo } from 'react';
import { Card, calculateProbability } from '../utils';
import { findSearchCards, isItemSearchCard } from '../api';
import './ProbabilityCalculator.css';

interface ProbabilityCalculatorProps {
  card: Card;
  totalDeckSize: number;
  allCards?: Card[];
}

export function ProbabilityCalculator({ card, totalDeckSize, allCards = [] }: ProbabilityCalculatorProps) {
  const [handSize, setHandSize] = useState(7);
  const [desiredCount, setDesiredCount] = useState(1);
  const [searchCards, setSearchCards] = useState<string[]>([]);

  const validSearchCards = useMemo(() => {
    return searchCards.filter((name) => isItemSearchCard(name));
  }, [searchCards]);

  const probability = useMemo(() => {
    return calculateProbability(totalDeckSize, card.count, handSize, desiredCount);
  }, [totalDeckSize, card.count, handSize, desiredCount]);

  const searchCardProbabilities = useMemo(() => {
    return validSearchCards.map((searchCardName) => {
      const searchCard = allCards.find((c) => c.name === searchCardName);
      if (!searchCard) return null;

      const searchProb = calculateProbability(totalDeckSize, searchCard.count, handSize, 1);
      return {
        name: searchCardName,
        count: searchCard.count,
        probability: searchProb,
      };
    }).filter((p) => p !== null);
  }, [validSearchCards, allCards, handSize, totalDeckSize]);

  const combinedSearchProbability = useMemo(() => {
    if (validSearchCards.length === 0) return 0;

    // Calculate total count of all search cards
    const totalSearchCards = validSearchCards.reduce((sum, cardName) => {
      const card = allCards.find((c) => c.name === cardName);
      return sum + (card ? card.count : 0);
    }, 0);

    // Add the base card count to the search cards
    const totalCards = card.count + totalSearchCards;

    // Calculate probability of drawing at least 1 card that gets you the Pokémon
    return calculateProbability(totalDeckSize, totalCards, handSize, 1);
  }, [validSearchCards, allCards, card.count, handSize, totalDeckSize]);

  const handleAddSearchCard = (cardName: string) => {
    if (!isItemSearchCard(cardName)) return;

    if (!searchCards.includes(cardName)) {
      setSearchCards([...searchCards, cardName]);
    }
  };

  const handleRemoveSearchCard = (cardName: string) => {
    setSearchCards(searchCards.filter((c) => c !== cardName));
  };

  const handleAutoFetchSearchCards = async () => {
    try {
      const foundCards = await findSearchCards(card.name, allCards);
      const cardNames = foundCards.map((c) => c.name);
      setSearchCards(cardNames);
    } catch (error) {
      console.error('Error finding search cards:', error);
    }
  };

  const getColorClass = (prob: number) => {
    if (prob >= 90) return 'excellent';
    if (prob >= 70) return 'good';
    if (prob >= 50) return 'fair';
    if (prob >= 30) return 'poor';
    return 'very-poor';
  };

  return (
    <div className="probability-calculator">
      <div className="card-name-header">{card.name}</div>
      <div className="card-details">
        <div className="detail-item">
          <span>Copies in deck:</span>
          <strong>{card.count}</strong>
        </div>
        <div className="detail-item">
          <span>Deck size:</span>
          <strong>{totalDeckSize}</strong>
        </div>
      </div>

      <div className="controls">
        <div className="control-group">
          <label htmlFor="hand-size">Opening Hand Size: {handSize} cards</label>
          <input
            id="hand-size"
            type="range"
            min="1"
            max={Math.min(20, totalDeckSize)}
            value={handSize}
            onChange={(e) => setHandSize(parseInt(e.target.value))}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label htmlFor="desired-count">
            Minimum Copies Wanted: {desiredCount} {desiredCount === 1 ? 'copy' : 'copies'}
          </label>
          <input
            id="desired-count"
            type="range"
            min="1"
            max={Math.min(card.count, 4)}
            value={desiredCount}
            onChange={(e) => setDesiredCount(parseInt(e.target.value))}
            className="slider"
          />
        </div>
      </div>

      <div className={`probability-display ${getColorClass(probability)}`}>
        <div className="probability-value">{probability.toFixed(2)}%</div>
        <div className="probability-label">
          Chance to draw{desiredCount > 1 ? ` at least ${desiredCount} ` : ' at least 1 '}
          {card.name} in opening hand
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat">
          <span className="stat-label">Expected copies:</span>
          <span className="stat-value">{(card.count * (handSize / totalDeckSize)).toFixed(2)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Missing chance:</span>
          <span className="stat-value">{(100 - probability).toFixed(2)}%</span>
        </div>
      </div>

      {allCards.length > 0 && (
        <div className="search-section">
          <div className="search-header">
            <h3>Cards That Search for {card.name}:</h3>
            <button
              onClick={handleAutoFetchSearchCards}
              className="btn btn-auto-fetch"
              title="Automatically find cards in your deck that can search for this Pokémon"
            >
              🔍 Auto-Find
            </button>
          </div>
          <p className="search-help">
            Click cards from your deck that can search for this Pokémon, or use <strong>Auto-Find</strong> to automatically detect them.
            <br />
            <strong>Examples:</strong> Nest Ball (searches for Pokémon), Ultra Ball, Level Ball, etc.
            <br />
            The combined probability will include drawing this card directly OR via search cards.
          </p>

          <div className="search-cards-available">
            <h4>Available Search Cards:</h4>
            <div className="search-card-buttons">
              {allCards
                .filter((c) => c.name !== card.name && !searchCards.includes(c.name) && isItemSearchCard(c.name))
                .map((availableCard) => (
                  <button
                    key={availableCard.name}
                    onClick={() => handleAddSearchCard(availableCard.name)}
                    className="search-card-btn"
                  >
                    <span className="card-name-btn">{availableCard.name}</span>
                    <span className="card-count-btn">{availableCard.count}x</span>
                  </button>
                ))}
            </div>
          </div>

          {validSearchCards.length > 0 && (
            <>
              <div className={`combined-search-prob ${getColorClass(combinedSearchProbability)}`}>
                <div className="combined-label">Combined chance to draw {card.name} or search it:</div>
                <div className="combined-value">{combinedSearchProbability.toFixed(2)}%</div>
                <div className="combined-info">
                  {card.count} {card.name} + {validSearchCards.reduce((sum, cardName) => {
                    const c = allCards.find((c) => c.name === cardName);
                    return sum + (c ? c.count : 0);
                  }, 0)} search cards = {card.count + validSearchCards.reduce((sum, cardName) => {
                    const c = allCards.find((c) => c.name === cardName);
                    return sum + (c ? c.count : 0);
                  }, 0)} total cards
                </div>
              </div>

              <div className="search-cards">
                <h4>Individual Search Cards:</h4>
                {searchCardProbabilities.map((result) => (
                  <div key={result!.name} className={`search-card ${getColorClass(result!.probability)}`}>
                    <div className="search-card-header">
                      <div className="search-card-info">
                        <span className="search-card-name">{result!.name}</span>
                        <span className="search-card-count">({result!.count}x in deck)</span>
                      </div>
                      <button
                        onClick={() => handleRemoveSearchCard(result!.name)}
                        className="btn-remove"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="search-card-prob">
                      <span className="label">Chance to draw in opening hand:</span>
                      <span className={`value ${getColorClass(result!.probability)}`}>{result!.probability.toFixed(2)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
