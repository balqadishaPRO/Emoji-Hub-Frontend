// API endpoint
const API_URL = 'https://emoji-hub-6odk.onrender.com/api';

let emojis = [];
let favorites = new Set();

const emojiGrid = document.getElementById('emojiGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');

async function loadEmojis() {
    try {
        const response = await fetch(`${API_URL}/emoji`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to load emojis');
        emojis = await response.json();
        renderEmojis();
    } catch (error) {
        console.error('Error loading emojis:', error);
        emojiGrid.innerHTML = '<p>Error loading emojis. Please try again later.</p>';
    }
}

async function loadFavorites() {
    try {
        const response = await fetch(`${API_URL}/favorites`, {
            credentials: 'include', // ← Must include cookies
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to load favorites');
        }
        
        const favs = await response.json();
        favorites = new Set(favs.map(f => f.id));
        renderEmojis();
        
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    }
}

async function toggleFavorite(id) {
    try {
        const isFavorite = favorites.has(id);
        const method = isFavorite ? 'DELETE' : 'POST';
        
        const response = await fetch(`${API_URL}/favorites/${id}`, {
            method,
            credentials: 'include', // ← Must include cookies
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json(); // Parse error message
            throw new Error(error.error || 'Failed to update favorite');
        }

        // Update UI immediately
        if (isFavorite) {
            favorites.delete(id);
        } else {
            favorites.add(id);
        }
        renderEmojis();
        
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`); // Show actual error
    }
}

function getFilteredEmojis() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const sortBy = sortFilter.value;

    return emojis
        .filter(emoji => {
            const matchesSearch = emoji.name.toLowerCase().includes(searchTerm);
            const matchesCategory = !category || emoji.category === category;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name);
            }
            return a.category.localeCompare(b.category);
        });
}

function unicodeArrayToEmoji(unicodeArr) {
    if (unicodeArr.length === 1 && /^[A-Za-z]{2}$/.test(unicodeArr[0])) {
        const countryCode = unicodeArr[0].toUpperCase();
        return countryCode.split('').map(c => 
            String.fromCodePoint(0x1F1E6 - 65 + c.charCodeAt(0))
        ).join('');
    }
    
    return String.fromCodePoint(...unicodeArr.map(u => 
        parseInt(u.replace('U+', ''), 16)
    ));
}

// Render emojis
function renderEmojis() {
    const filteredEmojis = getFilteredEmojis();
    emojiGrid.innerHTML = filteredEmojis.map(emoji => {
        const emojiChar = unicodeArrayToEmoji(emoji.unicode); // Use this for ALL emojis
        return `
            <div class="emoji-card">
                <div class="emoji-char">${emojiChar}</div>
                <div class="emoji-name">${emoji.name}</div>
                <div class="emoji-category">${emoji.category}</div>
                <button 
                    class="favorite-button ${favorites.has(emoji.id) ? 'active' : ''}"
                    onclick="toggleFavorite('${emoji.id}')"
                >
                    ${favorites.has(emoji.id) ? '❤️' : '🤍'}
                </button>
            </div>
        `;
    }).join('');
}

// Event listeners
searchInput.addEventListener('input', renderEmojis);
categoryFilter.addEventListener('change', renderEmojis);
sortFilter.addEventListener('change', renderEmojis);

// Initial load
loadEmojis();
loadFavorites(); 