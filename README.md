# 🕹️ Clicker/Idle/Looter Game Maker

Welcome to the **Clicker/Idle/Looter Game Maker** — a browser-based game prototyping tool designed to help you build and test your own idle/clicker RPGs inspired by titles like *Diablo* and *World of Warcraft*.

---

## 📁 Project Structure

| File               | Purpose                                  |
|--------------------|-------------------------------------------|
| `game_maker_ui.html` | Game Editor Interface (config creator)    |
| `game.html`         | Preview Mode (PTR) using iframe messaging |
| `livegame.html`     | Standalone Retail Game with config loader |
| `main.js`           | Interactivity logic for the UI            |
| `styles.css`        | Styling used by UI                        |
| `gameConfig.json`   | Exported config for standalone play       |

---

## 🛠️ Features

- Define **Gold Generation**, **Click Power**, and **Loot Tables**
- Create custom **Enemies**, **Inventory settings**, and **Gear Slots**
- Add **Upgrades** that scale with cost and apply dynamically
- Preview your game live within the editor (PTR)
- Export your configuration as `gameConfig.json`
- Load into `livegame.html` to play standalone

---

## 🚀 Getting Started

To test locally:

1. Clone this repository
2. Open `game_maker_ui.html` in your browser to build your game
3. Use the **Export Config** button to generate `gameConfig.json`
4. Open `livegame.html` to play your game in standalone mode

---

## 🤝 Contributions Welcome

This project is in early prototype stage and open to feedback, pull requests, and ideas. If you’d like to:
- Add new upgrade types
- Improve the UI
- Expand features (prestige, XP, item rarity logic, etc.)
- Build out combat systems or UI themes

…please feel free to fork, suggest, and collaborate!

---

## 📅 Roadmap & Future Updates

- 🎮 Save/load system using localStorage
- 🧰 Advanced item stats, prefixes/affixes
- 🪄 Visual loot effects & gear UI
- 💼 Editor presets & import templates
- 🔥 Prestige systems + offline progress

---

## 🧠 Built With

- HTML5 + CSS3
- Vanilla JavaScript
- OpenAI-assisted prototyping (ChatGPT)

---

## 👋 Made with passion and pixels.
Feel free to ⭐ this repo and join the adventure!

> "Click. Loot. Upgrade. Repeat."