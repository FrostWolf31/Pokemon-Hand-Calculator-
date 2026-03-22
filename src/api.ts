/**
 * Search card detection for Pokémon TCG
 * Uses a predefined list of known search cards
 */

// Predefined list of cards that can search for Pokémon
const ITEM_SEARCH_KEYWORDS = [
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
  'mysterious treasure',
  'evolution incense',
  'dual ball',
];

/**
 * Check if a card name indicates it can search for Pokémon
 */
export function isItemSearchCard(cardName: string): boolean {
  const lowercaseName = cardName.toLowerCase();
  return ITEM_SEARCH_KEYWORDS.some((keyword) =>
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
  const searchCardMap = new Map<string, { name: string; count: number }>();

  // Only check cards that are in the user's deck
  for (const deckCard of deckCards) {
    // Skip the Pokémon itself
    if (
      deckCard.name.toLowerCase() === pokemonName.toLowerCase()
    ) {
      continue;
    }

    // Item-only check for cards that can search based on card name
    if (isItemSearchCard(deckCard.name)) {
      const key = deckCard.name.toLowerCase();
      const existing = searchCardMap.get(key);

      if (existing) {
        existing.count += deckCard.count;
      } else {
        searchCardMap.set(key, {
          name: deckCard.name,
          count: deckCard.count,
        });
      }
    }
  }

  return Array.from(searchCardMap.values());
}
