import { useState, useMemo } from 'react';
import { Card } from '../utils';
import { ProbabilityCalculator } from './ProbabilityCalculator';
import './DeckViewer.css';

interface DeckViewerProps {
  cards: Card[];
  totalCards: number;
}

export function DeckViewer({ cards, totalCards }: DeckViewerProps) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(cards.length > 0 ? cards[0] : null);
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState<'count' | 'name'>('count');

  const filteredAndSortedCards = useMemo(() => {
    let filtered = cards.filter((card) =>
      card.name.toLowerCase().includes(filterText.toLowerCase())
    );

    if (sortBy === 'count') {
      filtered.sort((a, b) => b.count - a.count);
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [cards, filterText, sortBy]);

  return (
    <div className="deck-viewer">
      <div className="deck-info">
        <h2>Deck List ({totalCards} cards)</h2>
        
        <div className="deck-filters">
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Search cards..."
            className="filter-input"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'count' | 'name')}
            className="sort-select"
          >
            <option value="count">Sort by: Count</option>
            <option value="name">Sort by: Name</option>
          </select>
        </div>

        <div className="card-list">
          {filteredAndSortedCards.map((card, idx) => (
            <div
              key={idx}
              className={`card-item ${selectedCard?.name === card.name ? 'selected' : ''}`}
              onClick={() => setSelectedCard(card)}
            >
              <div className="card-count">{card.count}</div>
              <div className="card-name">{card.name}</div>
            </div>
          ))}
        </div>
      </div>

      {selectedCard && (
        <ProbabilityCalculator card={selectedCard} totalDeckSize={totalCards} allCards={cards} />
      )}
    </div>
  );
}
