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
        });
        
        if (!response.ok) throw new Error('Failed to load favorites');
        
        const favorites = await response.json();
        
        if (favorites.length === 0) { // Add this check
            favoritesGrid.innerHTML = `
                <div class="empty-state">
                    <p>You haven't added any emojis to your favorites yet.</p>
                    <a href="catalog.html" class="cta-button">Browse Emojis</a>
                </div>
            `;
            return;
        }
        
        renderFavorites(favorites);
    } catch (error) {
        console.error('Error loading favorites:', error);
        favoritesGrid.innerHTML = `
            <div class="empty-state">
                <p>Error loading favorites. ${error.message}</p>
                <a href="catalog.html" class="cta-button">Try Again</a>
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

function renderFavorites(favorites) {
    const grid = document.getElementById('favoritesGrid');
    grid.innerHTML = '';

    if (!favorites || favorites.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <p>No favorites yet. Start adding them from the catalog!</p>
                <a href="catalog.html" class="cta-button">Browse Emojis</a>
            </div>
        `;
        return;
    }

    favorites.forEach(emoji => {
        const card = document.createElement('div');
        card.className = 'emoji-card';
        card.innerHTML = `
            <div class="emoji-char">${unicodeArrayToEmoji(emoji.unicode)}</div>
            <h3 class="emoji-name">${emoji.name}</h3>
            <span class="emoji-category">${emoji.category}</span>
            <button class="favorite-button active" onclick="removeFavorite('${emoji.id}')">♥</button>
        `;
        grid.appendChild(card);
    });
}

loadFavorites(); 