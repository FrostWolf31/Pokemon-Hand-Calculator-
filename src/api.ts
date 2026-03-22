/**
 * Search card detection for Pokémon TCG
 * Uses a predefined list of known search cards
 */

// Predefined list of cards that can search for Pokémon
const SEARCH_CARD_KEYWORDS = [
  'nest ball',
  'ultra ball',
  'level ball',
  'timer ball',
  'quick ball',
  'great ball',
  'poke ball',
  'premier ball',
  'heavy ball',
  'lure ball',
  'net ball',
  'dusk ball',
  'repeat ball',
  'heal ball',
  'friend ball',
  'love ball',
  'moon ball',
  'fast ball',
  'dive ball',
  'luxury ball',
  'cherish ball',
  'beast ball',
  'sport ball',
  'safari ball',
  'masterball',
  'pokéball',
  'carmine',
  'ciphermaniac',
  'pokemon center lady',
  'mysterious treasure',
  'evolution incense',
  'switched',
  'dual ball',
];

/**
 * Check if a card name indicates it can search for Pokémon
 */
function isSearchCard(cardName: string): boolean {
  const lowercaseName = cardName.toLowerCase();
  return SEARCH_CARD_KEYWORDS.some((keyword) =>
    lowercaseName.includes(keyword)
  );
}

/**
 * Find all cards in the deck that can search for Pokémon
 * Only checks cards that exist in the provided deck
 */
export async function findSearchCards(
  pokemonName: string,
  deckCards: Array<{ name: string; count: number }>
): Promise<Array<{ name: string; count: number }>> {
  const searchCards: Array<{ name: string; count: number }> = [];

  // Only check cards that are in the user's deck
  for (const deckCard of deckCards) {
    // Skip the Pokémon itself
    if (
      deckCard.name.toLowerCase() === pokemonName.toLowerCase()
    ) {
      continue;
    }

    // Check if this card can search based on its name
    if (isSearchCard(deckCard.name)) {
      searchCards.push({
        name: deckCard.name,
        count: deckCard.count,
      });
    }
  }

  return searchCards;
}
