# Red
This application facilitates a multiplayer card game called Red using socket.io.

## Table of Contents
  - [Description of Game](#description-of-game)
  - [Usage](#usage)

## Description of Game
<a name='desc'></a>
The objective of each game is to have the lowest hand-value out of all players, like golf. 
| Card | Value |
| --- | ----------- |
| 1-10 | Number on Card |
| Joker | 0 |
| Ace | 1 |
| Jack | 11 |
| Queen | 12 |
| Black King (King of Clubs, Spades) | 13 |
| Red King (King of Diamonds, Hearts) | -2 |

> Note: This means negative values are possible.

The game can be played by 2-6 players, but 4 is optimal. The game starts with each player being dealt 4 cards (typically arranged in a rectangle), and the rest of the deck placed faced down in the middle of the table. Players may look at the two cards closest to them. Players may only look at the bottom two cards closest to them at the beginning of the game. The top two cards remain unknown as players start the game. House rules govern who starts the game by pulling the first card from the top of the face-down deck.

On each turn, players may decide whether to substitute a card they already own with the card they pulled from the top of the deck, or from the discard pile, if it exists. If a player decides to keep the card they pulled from the top of the deck or discard pile, they will replace the card in their hand with the pulled card, and put the other card onto the discard pile. The next player may go now. 

Any time during play, players may "slap" their card by placing a card they have onto the discard pile, as long as the number is the same (case or suit do not matter).

Some cards when picked from the deck (not the discard pile or from players' hands) have special properties as follows:
| Card | Special Case |
| --- | ----------- |
| 7 | Allows player to look at one of their cards |
| 8 | Allows player to look at one of another player's cards |
| 9 | Allows player to swap their card with another player's cards |
| 10 | Allows player to look at one of another player's cards and swap their card with another player's cards |

The game ends when a player calls "Red" and then all other players go for their last move. The player with the lowest hand-value wins.

## Usage
<a name='usage'></a>
To initalize in a local environment, clone this repository onto your machine, and run the following commands:

```
npm start
```

This project uses concurrently, so this will start the socket server on port 3001 and the client on port 3000. 

To play, visit the following address on any browser:
```
localhost:3000/
```