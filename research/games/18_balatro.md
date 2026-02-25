# Balatro (2024) — LocalThunk

> **Genre:** Poker Roguelike Deckbuilder | **Perspective:** 2D Card | **Players:** Solo | **Steam Rating:** 97% Positive

## 🎮 Core Concept

Build poker hands to defeat Blinds. Modify your standard 52-card deck with Jokers, Tarot cards, Planet cards, and Spectral cards to create insane scoring combos. Poker meets Slay the Spire.

## 🃏 Core Systems

### The Scoring Formula

```
(Base Chips + Card Face Values) × (Base Mult + Joker Mult) = Score
```

- Each poker hand has a base Chips + Mult value
- Planet cards upgrade hand base values permanently (within run)
- Jokers add Chips, Mult, or xMult (multiplicative)
- Goal: Beat the Blind's target chip score within limited hands

### Ante Structure

```
Ante 1: Small Blind → Big Blind → Boss Blind
Ante 2: Small Blind → Big Blind → Boss Blind
...
Ante 8: Small Blind → Big Blind → Boss Blind → WIN
→ Endless Mode (optional)
```

- Can skip Small/Big Blinds for bonus tags (money, packs, etc.)
- Boss Blinds have unique debuffs (disable suits, hand types, etc.)

## 🃏 Jokers — 150+ (The "Items" of Balatro)

### Joker Categories

| Category       | Examples                                  | Effect Type                         |
| -------------- | ----------------------------------------- | ----------------------------------- |
| **Flat Chips** | Banner, Scary Face                        | +Chips to score                     |
| **Flat Mult**  | Greedy Joker (+3 Mult per ♦ played)       | +Mult to score                      |
| **xMult**      | Blackboard (x3 if all ♠/♣), The Duo       | Multiplicative (most powerful)      |
| **Scaling**    | Ice Cream (-5 mult per hand), Green Joker | Grow/shrink over time               |
| **Money**      | Delayed Gratification, Business Card      | Generate gold                       |
| **Retrigger**  | Sock and Buskin, Dusk                     | Trigger cards/Jokers multiple times |
| **Suit/Rank**  | Fibonacci (Ace,2,3,5,8 = +8 Mult)         | Reward specific cards               |
| **Legendary**  | Perkeo, Triboulet, Canio                  | Ultra-rare, run-defining            |

### Joker Rarities

| Rarity        | Color  | Availability                  |
| ------------- | ------ | ----------------------------- |
| **Common**    | Blue   | Shop purchase                 |
| **Uncommon**  | Green  | Shop purchase (less frequent) |
| **Rare**      | Red    | Shop purchase (rare)          |
| **Legendary** | Purple | Soul Spectral card ONLY       |

### Joker Editions (Visual + bonus)

| Edition         | Bonus         |
| --------------- | ------------- |
| **Foil**        | +50 Chips     |
| **Holographic** | +10 Mult      |
| **Polychrome**  | x1.5 Mult     |
| **Negative**    | +1 Joker slot |

## 📦 Other Card Types

### Tarot Cards (Consumable)

Modify playing cards in your deck:

- **The Fool** — Create copy of last Tarot/Planet card used
- **Strength** — Increase rank of up to 2 cards by 1
- **The Hermit** — Double money (up to $20)
- **Death** — Transform left card into right card
- **The Tower** — Enhance up to 2 cards with Stone enhancement

### Planet Cards (Hand Upgrades)

Permanently upgrade base Chips + Mult for a poker hand type:

- **Mercury** = Upgrade Pair
- **Venus** = Upgrade Three of a Kind
- **Jupiter** = Upgrade Flush
- **Neptune** = Upgrade Straight Flush

### Spectral Cards (Powerful/Risky)

- **Aura** — Add random edition to 1 card
- **Wraith** — Create a Rare Joker, set money to $0
- **Soul** — Create a Legendary Joker
- **Ankh** — Destroy all Jokers, duplicate a random one

### Vouchers (Permanent Run Buffs)

- **Overstock** — +1 card slot in shop
- **Clearance Sale** — 25% off shop items
- **Hone** — Foil, Holo, Polychrome appear in shop
- **Planet Merchant** — Planet cards appear in every shop

## 🎴 Deck Manipulation

- Card **Enhancements** — Bonus, Mult, Wild, Glass, Steel, Stone, Gold, Lucky
- Card **Seals** — Red (retrigger), Blue (creates Planet card), Gold ($3 if in hand at end), Purple (creates Tarot)
- Card **Editions** — Foil, Holographic, Polychrome (same as Joker editions)
- Card **Removal** — $2-$5 to remove unwanted cards from deck (shrink deck = better hands)

## 📈 Meta-Progression

### Unlockable Decks (15)

| Deck               | Starting Modification                      |
| ------------------ | ------------------------------------------ |
| **Red Deck**       | +1 discard per round                       |
| **Blue Deck**      | +1 hand per round                          |
| **Yellow Deck**    | +$10 starting money                        |
| **Green Deck**     | No interest; $2 per remaining hand/discard |
| **Black Deck**     | +1 Joker slot, -1 hand per round           |
| **Plasma Deck**    | Balances chips and mult; $1 ante entry fee |
| **Erratic Deck**   | All ranks and suits are random             |
| **Abandoned Deck** | No face cards                              |
| + 7 more           | Various tradeoffs                          |

### Stake Difficulties (8 per deck)

| Stake  | Modifier                             |
| ------ | ------------------------------------ |
| White  | Default                              |
| Red    | Small Blind gives no reward          |
| Green  | Required score scales faster         |
| Black  | Shop has fewer items + higher prices |
| Blue   | Boss Blinds are harder               |
| Purple | Required score scales even faster    |
| Orange | Booster packs cost more              |
| Gold   | Max stake — all modifiers active     |

## 🏆 Achievement & Collection

- **Joker collection** — Track all discovered Jokers (150+)
- **Deck completion** — Beat all 8 stakes with all 15 decks
- **Discovery log** — Track all cards, Jokers, vouchers found
- **Endless mode** — Push score as high as possible post-Ante 8

## 🌟 Key Innovations

1. **Poker + Roguelike Fusion** — Completely novel genre mashup
2. **xMult Stacking** — Multiple Jokers with xMult = exponential scoring (e2, e3, e100+)
3. **Boss Blind Debuffs** — Force adaptive strategy
4. **Deck Manipulation** — Remove, enhance, seal, and modify individual cards
5. **Psychological Hook** — Simple rules, massive emergent depth
6. **Solo Dev Success** — Made by one person (LocalThunk)

## 📊 Key Stats

- **Jokers:** 150+
- **Decks:** 15
- **Stakes:** 8 per deck
- **Tarot cards:** 22
- **Planet cards:** 12
- **Spectral cards:** 18
- **Average run:** 30–45 minutes
- **GOTY nominations:** Multiple 2024 awards
- **Copies sold:** 5 million+ in first month
