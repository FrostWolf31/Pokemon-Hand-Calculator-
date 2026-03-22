# Pokémon Hand Probability Calculator

## Features

- 📊 **Probability Calculation**: Calculate the exact percentage chance of drawing a specific card in your opening hand
- 📋 **Deck Import**: Import your deck list in multiple formats
- 🎚️ **Adjustable Hand Size**: Modify the hand size from 1-20 cards to see how probabilities change
- 📈 **Flexible Query**: Check for at least 1, 2, 3, or 4 copies of a card
- 🎨 **Interactive UI**: Click on any card in your deck to see its probability statistics
- 📋 **Stats Display**: View expected copies and missing chances
- 🔍 **Auto-Find Search Cards**: Click "Auto-Find" to automatically detect which cards in your deck can search for the selected Pokémon using the PokéTCG API
- 🤖 **Smart Search Detection**: Parses card abilities and effects to identify search mechanics

## How It Works

The calculator uses the hypergeometric distribution to calculate exact probabilities of drawing specific cards from your deck. This is the mathematically correct method for calculating card draw probabilities without replacement.

## Usage

1. **Paste your deck list** into the text area using one of the supported formats
2. **Click "Import Deck"** or **"Paste from Clipboard"**
3. **Click on any card** in the deck list to view its opening hand probability
4. **Adjust the hand size** and **desired copy count** using the sliders to see different scenarios

## Deployment

Hosted on GitHub Pages via GitHub Actions.



