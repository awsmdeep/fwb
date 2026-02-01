// ===================================================
// MOODBOOKS - Mood-Based Book Recommendations with Dark Theme
// ===================================================

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';
let currentBooks = [];
let currentSelectedMood = null;

// ===================================================
// INITIALIZATION
// ===================================================
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

// ===================================================
// EVENT LISTENERS
// ===================================================
function setupEventListeners() {
    // Mood card clicks
    const moodCards = document.querySelectorAll('.mood-card');
    moodCards.forEach(card => {
        card.addEventListener('click', async () => {
            const mood = card.dataset.mood;
            const keywords = card.dataset.keywords;
            currentSelectedMood = mood;
            await fetchBooksByMood(keywords);
        });
    });

    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }

    // Modal close
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    // Back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', performBack);
    }

    // Book card clicks
    document.addEventListener('click', (e) => {
        if (e.target.closest('.book-card')) {
            const bookIndex = Array.from(document.querySelectorAll('.book-card')).indexOf(e.target.closest('.book-card'));
            if (currentBooks[bookIndex]) {
                openModal(currentBooks[bookIndex]);
                // keep back button visible when modal opens
                showBackBtn();
            }
        }
    });
}

// ===================================================
// SEARCH FUNCTIONALITY
// ===================================================
async function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (!query) {
        alert('Please enter a book name to search');
        return;
    }

    const moodSelector = document.querySelector('.mood-selector');
    const loadingState = document.getElementById('loadingState');
    const booksSection = document.getElementById('booksSection');
    const noResults = document.getElementById('noResults');

    // Show loading
    moodSelector.style.display = 'none';
    booksSection.style.display = 'none';
    noResults.style.display = 'none';
    loadingState.style.display = 'flex';

    try {
        const response = await fetch(
            `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=12&printType=books&orderBy=relevance`
        );

        if (!response.ok) throw new Error('Failed to fetch books');

        const data = await response.json();

        if (data.items && data.items.length > 0) {
            currentBooks = data.items;
            currentSelectedMood = 'search';
            displaySearchResults(data.items, query);
            
            // Show books section
            loadingState.style.display = 'none';
            booksSection.style.display = 'block';
            showBackBtn();
        } else {
            showNoResults();
        }
    } catch (error) {
        console.error('Error searching books:', error);
        showNoResults();
    }
}

function displaySearchResults(books, query) {
    const sectionTitle = document.getElementById('sectionTitle');
    if (sectionTitle) {
        sectionTitle.textContent = `Search Results for "${query}"`;
    }
    displayBooks(books);
}

// ===================================================
// FETCH BOOKS BY MOOD
// ===================================================
async function fetchBooksByMood(keywords) {
    const moodSelector = document.querySelector('.mood-selector');
    const loadingState = document.getElementById('loadingState');
    const booksSection = document.getElementById('booksSection');
    const noResults = document.getElementById('noResults');

    // Show loading
    moodSelector.style.display = 'none';
    booksSection.style.display = 'none';
    noResults.style.display = 'none';
    loadingState.style.display = 'flex';

    try {
        const response = await fetch(
            `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(keywords)}&maxResults=12&printType=books&orderBy=relevance`
        );

        if (!response.ok) throw new Error('Failed to fetch books');

        const data = await response.json();

        if (data.items && data.items.length > 0) {
            currentBooks = data.items;
            displayBooks(data.items);
            
            // Show books section
            loadingState.style.display = 'none';
            booksSection.style.display = 'block';
            showBackBtn();
        } else {
            showNoResults();
        }
    } catch (error) {
        console.error('Error fetching books:', error);
        showNoResults();
    }
}

// ===================================================
// DISPLAY BOOKS
// ===================================================
function displayBooks(books) {
    const booksGrid = document.getElementById('booksGrid');
    const moodLabels = {
        happy: 'Happy',
        sad: 'Sad',
        romantic: 'Romantic',
        thriller: 'Thriller',
        adventure: 'Adventure',
        thoughtful: 'Thoughtful',
        funny: 'Funny',
        inspirational: 'Inspirational'
    };

    const sectionTitle = document.getElementById('sectionTitle');
    if (sectionTitle && currentSelectedMood && currentSelectedMood !== 'search') {
        sectionTitle.textContent = `Books for Your ${moodLabels[currentSelectedMood] || 'Mood'}`;
    }

    booksGrid.innerHTML = '';

    books.forEach((book) => {
        const card = createBookCard(book);
        booksGrid.appendChild(card);
    });
    // ensure back button is visible when books are shown
    showBackBtn();
}

function createBookCard(book) {
    const volumeInfo = book.volumeInfo;
    const card = document.createElement('div');
    card.className = 'book-card';

    const imageUrl = volumeInfo.imageLinks?.thumbnail || 
        'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22128%22 height=%22196%22%3E%3Crect fill=%22%238b5cf6%22 width=%22128%22 height=%22196%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23fff%22 font-size=%2214%22%3ENo Cover%3C/text%3E%3C/svg%3E';
    const title = volumeInfo.title || 'Unknown Title';
    const author = volumeInfo.authors ? volumeInfo.authors[0] : 'Unknown Author';
    const rating = volumeInfo.averageRating || 0;

    card.innerHTML = `
        <img src="${imageUrl}" alt="${title}" class="book-card-image">
        <div class="book-card-content">
            <h3 class="book-card-title">${title}</h3>
            <p class="book-card-author">${author}</p>
            ${rating > 0 ? `<p class="book-card-rating">⭐ ${rating.toFixed(1)}/5</p>` : ''}
        </div>
    `;

    return card;
}

// ===================================================
// MODAL FUNCTIONALITY
// ===================================================
function openModal(book) {
    const modal = document.getElementById('bookModal');
    const volumeInfo = book.volumeInfo;
    const saleInfo = book.saleInfo || {};
    const accessInfo = book.accessInfo || {};

    // Extract description and create summary
    const description = volumeInfo.description || 'No description available.';
    const summary = generateSummary(description);

    const imageUrl = volumeInfo.imageLinks?.thumbnail || '';
    const title = volumeInfo.title || 'Unknown Title';
    const author = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author';
    const publisher = volumeInfo.publisher || 'N/A';
    const year = volumeInfo.publishedDate ? volumeInfo.publishedDate.split('-')[0] : 'N/A';
    const pages = volumeInfo.pageCount || 'N/A';
    const language = volumeInfo.language || 'N/A';
    const rating = volumeInfo.averageRating || 'Not Rated';
    const ratingsCount = volumeInfo.ratingsCount || 0;
    const isbn = volumeInfo.industryIdentifiers ? volumeInfo.industryIdentifiers[0].identifier : 'N/A';
    const categories = volumeInfo.categories ? volumeInfo.categories[0] : 'General';

    // Populate modal
    document.getElementById('modalImage').src = imageUrl;
    document.getElementById('modalImage').alt = title;
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalAuthor').textContent = `by ${author}`;
    document.getElementById('modalPublisher').textContent = `Publisher: ${publisher}`;
    document.getElementById('modalYear').textContent = `Year: ${year}`;
    document.getElementById('modalRating').textContent = `⭐ ${typeof rating === 'number' ? rating.toFixed(1) : rating}/5`;

    document.getElementById('modalDescription').textContent = description;
    document.getElementById('modalSummary').textContent = summary;

    document.getElementById('modalPages').textContent = pages;
    document.getElementById('modalLanguage').textContent = language;
    document.getElementById('modalCategory').textContent = categories;
    document.getElementById('modalISBN').textContent = isbn;

    // Preview button
    const previewBtn = document.getElementById('previewBtn');
    if (accessInfo.webReaderLink) {
        previewBtn.href = accessInfo.webReaderLink;
        previewBtn.style.display = 'inline-block';
    } else {
        previewBtn.style.display = 'none';
    }

    // Buy button
    const buyBtn = document.getElementById('buyBtn');
    const buyLink = saleInfo.buyLink || `https://www.google.com/search?q=${encodeURIComponent(title + ' ' + author + ' buy book')}`;
    buyBtn.href = buyLink;

    // Show modal
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('bookModal');
    modal.classList.remove('show');
}

// ===================================================
// BACK NAVIGATION
// ===================================================
function performBack() {
    const modal = document.getElementById('bookModal');
    const booksSection = document.getElementById('booksSection');
    const moodSelector = document.querySelector('.mood-selector');
    const noResults = document.getElementById('noResults');

    // If modal open, close it first
    if (modal && modal.classList.contains('show')) {
        closeModal();
        return;
    }

    // If viewing books, go back to mood selector
    if (booksSection && booksSection.style.display !== 'none') {
        booksSection.style.display = 'none';
        noResults.style.display = 'none';
        moodSelector.style.display = 'block';
        currentBooks = [];
        currentSelectedMood = null;
        hideBackBtn();
        return;
    }
}

function showBackBtn() {
    const backBtn = document.getElementById('backBtn');
    if (backBtn) backBtn.style.display = 'inline-flex';
}

function hideBackBtn() {
    const backBtn = document.getElementById('backBtn');
    if (backBtn) backBtn.style.display = 'none';
}

// ===================================================
// SUMMARY GENERATOR
// ===================================================
function generateSummary(description) {
    if (!description) return 'Summary not available for this book.';

    // Remove HTML tags if present
    let clean = description.replace(/<[^>]*>/g, '');

    // Get first 300 characters as summary
    if (clean.length > 300) {
        clean = clean.substring(0, 300).trim() + '...';
    }

    return clean;
}

// ===================================================
// UTILITY FUNCTIONS
// ===================================================
function showNoResults() {
    const loadingState = document.getElementById('loadingState');
    const booksSection = document.getElementById('booksSection');
    const noResults = document.getElementById('noResults');
    const moodSelector = document.querySelector('.mood-selector');

    loadingState.style.display = 'none';
    booksSection.style.display = 'none';
    noResults.style.display = 'block';
    moodSelector.style.display = 'block';
    hideBackBtn();
}

// ===================================================
// CLOSE MODAL ON ESCAPE KEY
// ===================================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});
