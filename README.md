# 🍻 Jasmin & Namit's Pub Crawl – Leicester Edition

A modern, single-page web app for tracking a pub crawl through Leicester. Built with vanilla JavaScript, Tailwind CSS, and Leaflet.js – no backend required!

## 🎯 Features

- **Interactive Map**: Beautiful dark-themed map with all pub locations and routes
- **Pub Route Cards**: Complete information for each stop with rules, drinks, and forfeits
- **Live Scoreboard**: Track player scores in real-time with automatic calculations
- **Smart Scoring System**: 
  - Finishing position points (1st=10, 2nd=6, 3rd=2, Last=0)
  - Drink bonuses (Pint=+1, Single=+2, Double/Shot=+4)
  - Penalties and bonuses for rule breaks, spills, tasks, and legendary forfeits
- **Live Leaderboard**: See who's winning and who's getting the Womp Womps award
- **Data Management**: Export/Import JSON backups, all stored locally in browser
- **Fully Offline**: Works without internet after initial load
- **Mobile Friendly**: Responsive design that works great on phones during the crawl

## 🗺️ The Route

1. 🐕 **Loaded Dog** – No names rule
2. 🚂 **Grand Union** – Buddy up
3. 🍺 **Wetherspoons** – Find a prop
4. 🎭 **Odd Bar** – Can't say "drink"
5. 🔥 **Firebug** – Prop selfie
6. 🍀 **Katie O'Briens** (Optional) – After-crawl fun & awards

## 🏆 End-of-Night Awards

- 👑 **Pub Crawl Champion** – Highest score
- 💀 **Womp Womps** – Lowest score (final forfeit)
- 🎤 **Caddy of the Crawl** – Funniest commentator
- 🦆 **Steady Sipper** – Most consistent

## 🚀 Quick Start

### Option 1: Open Locally

1. Clone this repository
2. Open `index.html` in your browser
3. That's it! No build process needed.

```bash
git clone https://github.com/namitzz/pubcrawl.git
cd pubcrawl
# Just open index.html in your browser
```

### Option 2: Deploy to GitHub Pages

1. Fork or clone this repository
2. Go to your repository on GitHub
3. Navigate to **Settings** > **Pages**
4. Under "Source", select **Deploy from a branch**
5. Select branch: **main** and folder: **/ (root)**
6. Click **Save**
7. Your site will be live at: `https://<your-username>.github.io/pubcrawl/`

## 💾 Data Storage

- All player data and scores are stored in your browser's `localStorage`
- Data persists between sessions
- Use **Export** to download a JSON backup
- Use **Import** to restore from a backup
- Each browser/device maintains its own data independently

## 🎨 Tech Stack

- **HTML5** – Structure
- **Tailwind CSS** (via CDN) – Styling with glass-card aesthetic
- **Vanilla JavaScript** – All functionality, no frameworks
- **Leaflet.js** – Interactive maps (no API key needed)
- **localStorage** – Client-side data persistence

## 📱 Mobile Usage

The app is fully responsive and designed to be used during the actual pub crawl:

- Large touch targets for easy tapping
- Quick scoring modal for entering results on the go
- Live leaderboard to see standings at a glance
- Map integration to navigate between pubs

## 🔧 Customization

Want to adapt this for your own pub crawl? Edit the `PUBS` array in `script.js`:

```javascript
const PUBS = [
    {
        id: 1,
        name: "Your Pub Name",
        emoji: "🍺",
        rule: "Your Rule",
        drink: "Your Drink",
        forfeit: "Your Forfeit",
        lat: 52.6369,  // Latitude
        lng: -1.1398,  // Longitude
        color: "#ef4444"
    },
    // Add more pubs...
];
```

## 📄 License

MIT License - Feel free to use and modify for your own pub crawls!

## 🙏 Credits

Made with 💜 for Jasmin & Namit's Leicester Pub Crawl

---

**Enjoy responsibly! 🍻**