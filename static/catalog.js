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
        const isFavorite = favorites.has(id);
        const method = isFavorite ? 'DELETE' : 'POST';
        const response = await fetch(`${API_URL}/favorites/${id}`, {
            method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('Failed to update favorite');
        
        if (isFavorite) {
            favorites.delete(id);
        } else {
            favorites.add(id);
        }
        
        renderEmojis();
    } catch (error) {
        console.error('Error updating favorite:', error);
    }
}

// ... rest of the code remains the same ... 