// Pub Crawl Data
const PUBS = [
    {
        id: 1,
        name: "Loaded Dog",
        emoji: "🐕",
        rule: "No names",
        drink: "Pint of Carling/Amstel",
        forfeit: "Everyone takes a shot (no points)",
        lat: 52.6369,
        lng: -1.1398,
        color: "#ef4444"
    },
    {
        id: 2,
        name: "Grand Union",
        emoji: "🚂",
        rule: "Buddy up",
        drink: "Pint of Kopparberg/Strongbow",
        forfeit: "Everyone gives a toast",
        lat: 52.6354,
        lng: -1.1337,
        color: "#f59e0b"
    },
    {
        id: 3,
        name: "Wetherspoons",
        emoji: "🍺",
        rule: "Find a prop",
        drink: "Double Vodka Lemonade",
        forfeit: "Group chant",
        lat: 52.6365,
        lng: -1.1392,
        color: "#eab308"
    },
    {
        id: 4,
        name: "Odd Bar",
        emoji: "🎭",
        rule: "Can't say 'drink'",
        drink: "Captain Morgan & Coke",
        forfeit: "Salute bartender",
        lat: 52.6339,
        lng: -1.1314,
        color: "#06b6d4"
    },
    {
        id: 5,
        name: "Firebug",
        emoji: "🔥",
        rule: "Prop selfie",
        drink: "Tequila shot",
        forfeit: "Mix random drinks (one sip each)",
        lat: 52.6344,
        lng: -1.1294,
        color: "#8b5cf6"
    },
    {
        id: 6,
        name: "Katie O'Briens",
        emoji: "🍀",
        rule: "Optional after-crawl fun",
        drink: "Baby Guinness",
        forfeit: "Declare Womp Womps loser & Champion 🏆",
        lat: 52.6349,
        lng: -1.1324,
        color: "#10b981",
        optional: true
    }
];

const STORAGE_KEY = 'jn_pubcrawl_v1';

// State
let state = {
    players: [],
    rounds: {} // playerName -> [round1, round2, round3, round4, round5]
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    initMap();
    renderPubCards();
    renderAll();
    setupEventListeners();
});

// LocalStorage Management
function loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            state = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to load state:', e);
        }
    }
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    renderAll();
}

// Map Initialization
function initMap() {
    const map = L.map('map').setView([52.6369, -1.1337], 15);
    
    // Dark theme tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);
    
    // Add markers and connecting lines
    const coordinates = [];
    PUBS.forEach((pub, index) => {
        if (!pub.optional) {
            coordinates.push([pub.lat, pub.lng]);
        }
        
        // Create custom icon
        const icon = L.divIcon({
            html: `<div style="background-color: ${pub.color}; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">${pub.emoji}</div>`,
            className: 'custom-marker',
            iconSize: [40, 40]
        });
        
        const marker = L.marker([pub.lat, pub.lng], { icon: icon }).addTo(map);
        
        // Popup content
        const popupContent = `
            <div style="color: #1f2937; font-family: sans-serif;">
                <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 8px;">${pub.emoji} ${pub.name}</h3>
                <p style="margin: 4px 0;"><strong>Rule:</strong> ${pub.rule}</p>
                <p style="margin: 4px 0;"><strong>Drink:</strong> ${pub.drink}</p>
                <a href="https://www.google.com/maps/search/?api=1&query=${pub.lat},${pub.lng}" 
                   target="_blank" 
                   style="display: inline-block; margin-top: 8px; padding: 4px 8px; background: #7c3aed; color: white; text-decoration: none; border-radius: 4px; font-size: 12px;">
                   📍 Open in Google Maps
                </a>
            </div>
        `;
        marker.bindPopup(popupContent);
    });
    
    // Draw polyline connecting pubs
    if (coordinates.length > 0) {
        L.polyline(coordinates, {
            color: '#7c3aed',
            weight: 3,
            opacity: 0.7,
            dashArray: '10, 10'
        }).addTo(map);
    }
}

// Render Pub Cards
function renderPubCards() {
    const container = document.getElementById('pubCards');
    container.innerHTML = PUBS.map((pub, index) => `
        <div class="glass-card-light rounded-xl p-5 cursor-pointer card-hover scale-in stagger-${(index % 6) + 1}" style="animation-delay: ${index * 0.1}s;">
            <div class="flex items-start gap-4">
                <div class="text-4xl flex-shrink-0 ${index % 2 === 0 ? 'float' : 'bounce'}" style="animation-delay: ${index * 0.2}s;">${pub.emoji}</div>
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-xl font-bold gradient-text">${pub.name}</span>
                        ${pub.optional ? '<span class="text-xs px-2 py-1 bg-green-500/30 rounded-full pulse">Optional</span>' : ''}
                    </div>
                    <div class="space-y-1 text-sm">
                        <p><strong class="text-violet-400">Rule:</strong> <span class="text-gray-300">${pub.rule}</span></p>
                        <p><strong class="text-cyan-400">Drink:</strong> <span class="text-gray-300">${pub.drink}</span></p>
                        <p><strong class="text-red-400">Forfeit:</strong> <span class="text-gray-300">${pub.forfeit}</span></p>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Render All
function renderAll() {
    renderLeaderboard();
    renderPlayersList();
    renderScoreboard();
}

// Calculate player total score
function calculatePlayerScore(playerName) {
    const rounds = state.rounds[playerName] || [];
    let total = 0;
    
    rounds.forEach(round => {
        // Finishing position points
        const positionPoints = {
            '1st': 10,
            '2nd': 6,
            '3rd': 2,
            'Last': 0
        };
        total += positionPoints[round.position] || 0;
        
        // Drink bonus
        const drinkBonus = {
            'Pint': 1,
            'Single': 2,
            'Double/Shot': 4
        };
        total += drinkBonus[round.drink] || 0;
        
        // Extras
        if (round.brokeRule) total -= 2;
        if (round.spill) total -= 1;
        if (round.completedTask) total += 1;
        if (round.forfeitLegend) total += 1;
    });
    
    return total;
}

// Render Leaderboard
function renderLeaderboard() {
    const container = document.getElementById('leaderboard');
    
    if (state.players.length === 0) {
        container.innerHTML = `
            <div class="text-center text-gray-400 py-8 fade-in">
                <div class="text-4xl mb-2 float">👥</div>
                <p class="text-lg">Add players to see the leaderboard!</p>
            </div>
        `;
        return;
    }
    
    // Calculate scores and sort
    const leaderboard = state.players.map(player => ({
        name: player,
        score: calculatePlayerScore(player)
    })).sort((a, b) => b.score - a.score);
    
    container.innerHTML = leaderboard.map((player, index) => {
        const isChampion = index === 0;
        const isWomp = index === leaderboard.length - 1 && leaderboard.length > 1;
        
        return `
            <div class="glass-card-light rounded-lg p-4 flex items-center justify-between card-hover scale-in stagger-${(index % 6) + 1}" style="animation-delay: ${index * 0.1}s;">
                <div class="flex items-center gap-3">
                    <div class="text-2xl font-bold ${isChampion ? 'text-yellow-400' : isWomp ? 'text-red-400' : 'text-gray-500'} ${isChampion || isWomp ? 'pulse' : ''}">#${index + 1}</div>
                    <div>
                        <div class="font-bold text-lg flex items-center gap-2">
                            <span class="${isChampion ? 'gradient-text' : ''}">${player.name}</span>
                            ${isChampion ? '<span class="champion">👑</span>' : ''}
                            ${isWomp ? '<span class="womp">💀</span>' : ''}
                        </div>
                        ${isChampion ? '<div class="text-xs text-yellow-400 pulse">Pub Crawl Champion</div>' : ''}
                        ${isWomp ? '<div class="text-xs text-red-400 pulse">Womp Womps</div>' : ''}
                    </div>
                </div>
                <div class="text-2xl font-bold text-violet-400 ${isChampion || isWomp ? 'pulse glow' : ''}">${player.score}</div>
            </div>
        `;
    }).join('');
}

// Render Players List
function renderPlayersList() {
    const container = document.getElementById('playersList');
    
    if (state.players.length === 0) {
        container.innerHTML = `
            <div class="text-center text-gray-400 py-4 fade-in">
                <div class="text-3xl mb-2 bounce">🎭</div>
                <p>No players yet. Add some!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = state.players.map((player, index) => `
        <div class="glass-card-light rounded-lg p-3 flex items-center justify-between card-hover fade-in" style="animation-delay: ${index * 0.1}s;">
            <span class="font-semibold gradient-text">${player}</span>
            <button onclick="removePlayer('${player}')" class="px-3 py-1 bg-red-500/20 hover:bg-red-500/40 rounded text-red-400 text-sm transition-all duration-300">
                ✕ Remove
            </button>
        </div>
    `).join('');
}

// Render Scoreboard
function renderScoreboard() {
    const container = document.getElementById('scoreboard');
    
    if (state.players.length === 0) {
        container.innerHTML = `
            <div class="text-center text-gray-400 py-8 fade-in">
                <div class="text-4xl mb-2 pulse">📊</div>
                <p class="text-lg">Add players to start tracking scores!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = state.players.map(player => {
        const rounds = state.rounds[player] || [];
        const totalScore = calculatePlayerScore(player);
        
        return `
            <div class="glass-card-light rounded-xl p-4 mb-4 card-hover fade-in" style="animation-delay: ${state.players.indexOf(player) * 0.1}s;">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold gradient-text">${player}</h3>
                    <div class="text-2xl font-bold text-violet-400 glow">${totalScore} pts</div>
                </div>
                
                <div class="space-y-3">
                    ${PUBS.filter(p => !p.optional).map((pub, pubIndex) => {
                        const round = rounds[pubIndex] || null;
                        return `
                            <div class="bg-white/5 rounded-lg p-3 card-hover transition-all duration-300">
                                <div class="font-semibold mb-2 text-sm flex items-center gap-2">
                                    <span class="${pubIndex % 2 === 0 ? 'float' : 'bounce'}">${pub.emoji}</span>
                                    <span>${pub.name}</span>
                                </div>
                                ${round ? `
                                    <div class="grid grid-cols-2 gap-2 text-xs">
                                        <div><strong>Position:</strong> ${round.position}</div>
                                        <div><strong>Drink:</strong> ${round.drink}</div>
                                        <div class="col-span-2">
                                            ${round.brokeRule ? '<span class="text-red-400">❌ Broke Rule</span> ' : ''}
                                            ${round.spill ? '<span class="text-orange-400">💧 Spill</span> ' : ''}
                                            ${round.completedTask ? '<span class="text-green-400">✅ Task</span> ' : ''}
                                            ${round.forfeitLegend ? '<span class="text-yellow-400">⭐ Legend</span> ' : ''}
                                        </div>
                                    </div>
                                    <button onclick="editRound('${player}', ${pubIndex})" class="mt-2 px-3 py-1 bg-violet-500/30 hover:bg-violet-500/50 rounded text-xs w-full transition-all duration-300 hover:scale-105">
                                        ✏️ Edit
                                    </button>
                                ` : `
                                    <button onclick="addRound('${player}', ${pubIndex})" class="px-3 py-1 bg-green-500/30 hover:bg-green-500/50 rounded text-xs w-full transition-all duration-300 hover:scale-105">
                                        ➕ Add Score
                                    </button>
                                `}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');
}

// Player Management
function addPlayer() {
    const input = document.getElementById('playerNameInput');
    const name = input.value.trim();
    
    if (!name) {
        alert('Please enter a player name!');
        return;
    }
    
    if (state.players.includes(name)) {
        alert('Player already exists!');
        return;
    }
    
    state.players.push(name);
    state.rounds[name] = [];
    input.value = '';
    saveState();
}

function removePlayer(playerName) {
    if (!confirm(`Remove ${playerName} from the crawl?`)) {
        return;
    }
    
    state.players = state.players.filter(p => p !== playerName);
    delete state.rounds[playerName];
    saveState();
}

// Round Management
function addRound(playerName, pubIndex) {
    const pub = PUBS[pubIndex];
    
    // Create modal for input
    const modal = createRoundModal(playerName, pub, null, pubIndex);
    document.body.appendChild(modal);
}

function editRound(playerName, pubIndex) {
    const pub = PUBS[pubIndex];
    const round = state.rounds[playerName][pubIndex];
    
    const modal = createRoundModal(playerName, pub, round, pubIndex);
    document.body.appendChild(modal);
}

function createRoundModal(playerName, pub, existingRound, pubIndex) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 fade-in';
    modal.style.backdropFilter = 'blur(10px)';
    
    const round = existingRound || {
        position: '1st',
        drink: 'Pint',
        brokeRule: false,
        spill: false,
        completedTask: false,
        forfeitLegend: false
    };
    
    modal.innerHTML = `
        <div class="glass-card rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto scale-in glow">
            <h3 class="text-2xl font-bold mb-4 gradient-text flex items-center gap-2">
                <span class="float">${pub.emoji}</span> ${pub.name}
            </h3>
            <p class="text-sm text-gray-300 mb-4">Scoring for <strong class="gradient-text">${playerName}</strong></p>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-semibold mb-2">Finishing Position:</label>
                    <select id="modalPosition" class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500">
                        <option value="1st" ${round.position === '1st' ? 'selected' : ''}>1st (10 pts)</option>
                        <option value="2nd" ${round.position === '2nd' ? 'selected' : ''}>2nd (6 pts)</option>
                        <option value="3rd" ${round.position === '3rd' ? 'selected' : ''}>3rd (2 pts)</option>
                        <option value="Last" ${round.position === 'Last' ? 'selected' : ''}>Last (0 pts)</option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-semibold mb-2">Drink Type:</label>
                    <select id="modalDrink" class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500">
                        <option value="Pint" ${round.drink === 'Pint' ? 'selected' : ''}>Pint (+1 pt)</option>
                        <option value="Single" ${round.drink === 'Single' ? 'selected' : ''}>Single (+2 pts)</option>
                        <option value="Double/Shot" ${round.drink === 'Double/Shot' ? 'selected' : ''}>Double/Shot (+4 pts)</option>
                    </select>
                </div>
                
                <div class="space-y-2">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" id="modalBrokeRule" ${round.brokeRule ? 'checked' : ''} class="w-5 h-5">
                        <span>❌ Broke Rule (-2 pts)</span>
                    </label>
                    
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" id="modalSpill" ${round.spill ? 'checked' : ''} class="w-5 h-5">
                        <span>💧 Spill (-1 pt)</span>
                    </label>
                    
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" id="modalCompletedTask" ${round.completedTask ? 'checked' : ''} class="w-5 h-5">
                        <span>✅ Completed Task (+1 pt)</span>
                    </label>
                    
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" id="modalForfeitLegend" ${round.forfeitLegend ? 'checked' : ''} class="w-5 h-5">
                        <span>⭐ Forfeit Legend (+1 pt)</span>
                    </label>
                </div>
            </div>
            
            <div class="flex gap-2 mt-6">
                <button id="modalSave" class="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    💾 Save
                </button>
                <button id="modalCancel" class="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
                    ✕ Cancel
                </button>
            </div>
        </div>
    `;
    
    // Event listeners
    modal.querySelector('#modalSave').addEventListener('click', () => {
        const newRound = {
            position: modal.querySelector('#modalPosition').value,
            drink: modal.querySelector('#modalDrink').value,
            brokeRule: modal.querySelector('#modalBrokeRule').checked,
            spill: modal.querySelector('#modalSpill').checked,
            completedTask: modal.querySelector('#modalCompletedTask').checked,
            forfeitLegend: modal.querySelector('#modalForfeitLegend').checked
        };
        
        if (!state.rounds[playerName]) {
            state.rounds[playerName] = [];
        }
        state.rounds[playerName][pubIndex] = newRound;
        
        saveState();
        modal.remove();
    });
    
    modal.querySelector('#modalCancel').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    return modal;
}

// Export/Import/Reset
function exportData() {
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `pubcrawl-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function importData() {
    document.getElementById('importFileInput').click();
}

function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (confirm('This will replace all current data. Continue?')) {
                state = imported;
                saveState();
                alert('Data imported successfully!');
            }
        } catch (error) {
            alert('Failed to import: Invalid file format');
        }
    };
    reader.readAsText(file);
}

function resetAll() {
    if (!confirm('⚠️ This will delete ALL players and scores. Are you absolutely sure?')) {
        return;
    }
    
    if (!confirm('Last chance! This cannot be undone. Proceed with reset?')) {
        return;
    }
    
    state = { players: [], rounds: {} };
    saveState();
    alert('All data has been reset!');
}

// Event Listeners Setup
function setupEventListeners() {
    document.getElementById('addPlayerBtn').addEventListener('click', addPlayer);
    document.getElementById('playerNameInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addPlayer();
    });
    
    document.getElementById('exportBtn').addEventListener('click', exportData);
    document.getElementById('importBtn').addEventListener('click', importData);
    document.getElementById('resetBtn').addEventListener('click', resetAll);
    
    document.getElementById('importFileInput').addEventListener('change', handleImportFile);
}

// Make functions globally available
window.addPlayer = addPlayer;
window.removePlayer = removePlayer;
window.addRound = addRound;
window.editRound = editRound;
