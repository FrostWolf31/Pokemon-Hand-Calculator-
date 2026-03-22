import { useState } from 'react';
import { DeckImporter } from './components/DeckImporter';
import { DeckViewer } from './components/DeckViewer';
import { DeckList } from './utils';
import './App.css';

function App() {
  const [deck, setDeck] = useState<DeckList | null>(null);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎴 Pokémon Hand Probability Calculator</h1>
        <p>Calculate your opening hand draw rates</p>
      </header>

      <main className="app-main">
        {!deck ? (
          <DeckImporter
            onDeckImported={(newDeck) => {
              setDeck(newDeck);
            }}
          />
        ) : (
          <>
            <button
              onClick={() => setDeck(null)}
              className="btn btn-reset"
            >
              ← Import New Deck
            </button>
            <DeckViewer cards={deck.cards} totalCards={deck.totalCards} />
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>Pokémon Hand Probability Calculator v1.0</p>
        <p>Built By: Steven "Frost" Champagne</p>
      </footer>
    </div>
  );
}

export default App;
