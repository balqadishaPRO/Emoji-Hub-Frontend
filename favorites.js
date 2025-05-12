// API endpoint
const API_URL = 'https://emoji-hub-6odk.onrender.com/api';

const favoritesGrid = document.getElementById('favoritesGrid');

function unicodeArrayToEmoji(unicodeArr) {
    console.log('Flag unicode array:', unicodeArr);
    return String.fromCodePoint(...unicodeArr.map(u => parseInt(u.replace('U+', ''), 16)));
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
        const favorites = await response.json();
        renderFavorites(favorites);
    } catch (error) {
        console.error('Error loading favorites:', error);
        favoritesGrid.innerHTML = `
            <div class="empty-state">
                <p>You haven't added any emojis to your favorites yet.</p>
                <a href="catalog.html" class="cta-button">Browse Emojis</a>
            </div>
        `;
    }
}

async function removeFavorite(id) {
    try {
        const response = await fetch(`${API_URL}/favorites/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to remove favorite');
        loadFavorites();
    } catch (error) {
        console.error('Error removing favorite:', error);
    }
}

// ... rest of the code remains the same ... 