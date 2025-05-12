const API_URL = 'https://emoji-hub-6odk.onrender.com/api';
const favoritesGrid = document.getElementById('favoritesGrid');

function unicodeArrayToEmoji(unicodeArr) {
    try {
        return String.fromCodePoint(...unicodeArr.map(u => 
            parseInt(u.replace('U+', ''), 16)
        ));
    } catch (error) {
        console.error('Error converting unicode:', error);
        return '❌';
    }
}

async function loadFavorites() {
    try {
        const response = await fetch(`${API_URL}/favorites`, {
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const favorites = await response.json();
        renderFavorites(favorites);
        
    } catch (error) {
        console.error('Error:', error);
        favoritesGrid.innerHTML = `
            <div class="empty-state">
                <p>Error: ${error.message}</p>
                <a href="catalog.html" class="cta-button">Try Again</a>
            </div>
        `;
    }
}

function renderFavorites(favorites) {
    favoritesGrid.innerHTML = '';
    
    if (!favorites?.length) {
        favoritesGrid.innerHTML = `
            <div class="empty-state">
                <p>No favorites yet. 😢</p>
                <a href="catalog.html" class="cta-button">Browse Emojis</a>
            </div>
        `;
        return;
    }

    favorites.forEach(emoji => {
        const card = document.createElement('div');
        card.className = 'emoji-card';
        card.innerHTML = `
            <div class="emoji-char">
                ${unicodeArrayToEmoji(emoji.unicode)}
            </div>
            <h3 class="emoji-name">${emoji.name}</h3>
            <span class="emoji-category">${emoji.category}</span>
            <button class="favorite-button active" data-id="${emoji.id}">
                ♥
            </button>
        `;
        
        card.querySelector('button').addEventListener('click', () => {
            removeFavorite(emoji.id);
        });
        
        favoritesGrid.appendChild(card);
    });
}

async function removeFavorite(id) {
    try {
        const response = await fetch(`${API_URL}/favorites/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        loadFavorites(); // Refresh list
        
    } catch (error) {
        console.error('Error:', error);
        alert(`Failed to remove: ${error.message}`);
    }
}

document.addEventListener('DOMContentLoaded', loadFavorites);