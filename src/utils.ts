/**
 * Calculate hypergeometric probability
 * P(getting at least 'desired' cards from 'total' deck, drawing 'drawn' cards, where 'successStates' specific cards exist)
 */
export function calculateProbability(
  deckSize: number,
  cardCount: number,
  handSize: number,
  desiredCount: number = 1
): number {
  if (deckSize <= 0 || cardCount < 0 || handSize < 0 || desiredCount < 0) {
    return 0;
  }
  if (cardCount === 0) {
    return 0;
  }
  if (handSize === 0) {
    return 0;
  }
  if (cardCount > deckSize || handSize > deckSize) {
    return 0;
  }

  // Calculate probability of NOT drawing any of the desired cards
  // (C(cardCount, 0) * C(deckSize - cardCount, handSize)) / C(deckSize, handSize)
  let probabilityOfNone = 1;

  for (let i = 0; i < handSize; i++) {
    probabilityOfNone *= (deckSize - cardCount - i) / (deckSize - i);
  }

  // Probability of getting at least 'desiredCount' cards
  if (desiredCount === 1) {
    return (1 - probabilityOfNone) * 100;
  }

  // For desiredCount > 1, use a more complete calculation
  let totalProbability = 0;

  for (let k = desiredCount; k <= Math.min(cardCount, handSize); k++) {
    // Calculate C(cardCount, k) * C(deckSize - cardCount, handSize - k) / C(deckSize, handSize)
    let prob = 1;

    for (let i = 0; i < k; i++) {
      prob *= (cardCount - i) / (i + 1);
    }

    for (let i = 0; i < handSize - k; i++) {
      prob *= (deckSize - cardCount - i) / (handSize - k - i);
    }

    for (let i = 0; i < handSize; i++) {
      prob /= (deckSize - i) / (i + 1);
    }

    totalProbability += prob;
  }

  return Math.max(0, Math.min(100, totalProbability * 100));
}

export interface Card {
  name: string;
  count: number;
}

export interface DeckList {
  cards: Card[];
  totalCards: number;
  name?: string;
}

/**
 * Parse a deck list from various formats
 * Supports:
 * - "4x Card Name" or "4 Card Name"
 * - "Card Name x4" or "Card Name 4"
 * - TCG format: "2 Latias ex SSP 76" (with set codes)
 * - Just count and name separated by space
 */
export function parseDeckList(input: string): DeckList {
  const lines = input
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const cardMap = new Map<string, Card>();
  let totalCards = 0;

  for (const line of lines) {
    // Only process lines that start with a number (1-4 for card counts)
    const match = line.match(/^(\d+)\s+(.+)$/);
    if (!match) {
      continue; // Skip headers and any other non-card lines
    }

    const count = parseInt(match[1], 10);
    let name = match[2].trim();

    // Remove set code from end (e.g., "SSP 76", "MEE 5")
    name = name.replace(/\s+[A-Za-z0-9]+\s+\d+\s*$/, '').trim();

    // Add any card with valid count and name
    if (count > 0 && name.length > 0) {
      const key = name.toLowerCase();
      const existing = cardMap.get(key);

      if (existing) {
        existing.count += count;
      } else {
        cardMap.set(key, { name, count });
      }

      totalCards += count;
    }
  }

  const cards = Array.from(cardMap.values());
  return { cards, totalCards };
}
