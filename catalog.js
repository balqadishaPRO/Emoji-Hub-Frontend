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
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to load favorites');
        const favs = await response.json();
        favorites = new Set(favs.map(f => f.id));
        renderEmojis();
    } catch (error) {
        console.error('Error loading favorites:', error);
    }
}

async function toggleFavorite(id) {
    try {
        const response = await fetch(`${API_URL}/favorites/${id}`, {
            method: isFavorite ? 'DELETE' : 'POST',
            credentials: 'include',  // Crucial for sending cookies
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        // Update local state immediately
        if (isFavorite) {
            favorites.delete(id);
        } else {
            favorites.add(id);
        }
        
        // Visual feedback
        renderEmojis();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update favorite. Please try again.');
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

// Helper to convert ["U+1F1E6", "U+1F1EB"] to the actual emoji
function unicodeArrayToEmoji(unicodeArr) {
    // Debug log
    console.log('Flag unicode array:', unicodeArr);
    return String.fromCodePoint(...unicodeArr.map(u => parseInt(u.replace('U+', ''), 16)));
}

// Render emojis
function renderEmojis() {
    console.log('Global emojis:', emojis);
    const filteredEmojis = getFilteredEmojis();
    console.log('Filtered emojis:', filteredEmojis);
    if (filteredEmojis.length === 0) {
        emojiGrid.innerHTML = '<p>No emojis found.</p>';
        return;
    }
    emojiGrid.innerHTML = filteredEmojis.map(emoji => {
        const emojiChar = emoji.category === 'flags'
            ? unicodeArrayToEmoji(emoji.unicode)
            : emoji.htmlCode[0];
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