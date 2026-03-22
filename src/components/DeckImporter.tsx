import { useState } from 'react';
import { parseDeckList, DeckList } from '../utils';
import './DeckImporter.css';

interface DeckImporterProps {
  onDeckImported: (deck: DeckList) => void;
}

export function DeckImporter({ onDeckImported }: DeckImporterProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleImport = () => {
    try {
      setError('');
      const deck = parseDeckList(input);

      if (deck.totalCards === 0) {
        setError('No valid cards found. Please check your deck list format.');
        return;
      }

      if (deck.totalCards > 60) {
        setError('Deck size exceeds 60 cards. Please check your list.');
        return;
      }

      onDeckImported(deck);
      setInput('');
    } catch (err) {
      setError('Error parsing deck list: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch (err) {
      setError('Failed to read clipboard');
    }
  };

  return (
    <div className="deck-importer">
      <h2>Import Your Pokémon Deck</h2>
      <p className="help-text">
        Paste your deck list in any of these formats:
        <br />
        • 4x Pikachu
        <br />
        • 4 Charizard
        <br />
        • Blastoise 3
      </p>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your deck list here..."
        rows={10}
        className="deck-textarea"
      />
      <div className="button-group">
        <button onClick={handleImport} className="btn btn-primary">
          Import Deck
        </button>
        <button onClick={handlePaste} className="btn btn-secondary">
          Paste from Clipboard
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
