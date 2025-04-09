

document.addEventListener('DOMContentLoaded', function () {
    const tabLinks = document.querySelectorAll('.nav-link');
    const bookContainer = document.getElementById('bookList');
    const addBookModalElement = document.getElementById('bookModal');
    const addBookModal = new bootstrap.Modal(addBookModalElement);
    const addBookForm = document.getElementById('bookForm');
    const searchInput = document.getElementById('searchInput');
    const statusSelect = document.getElementById('status');
    const bookIdInput = document.getElementById('bookId');
    const modalTitle = addBookModalElement.querySelector('.modal-title');
    const imageInput = document.getElementById('image');
    const imagePreview = document.getElementById('imagePreview');
    const logoutDashboardButton = document.getElementById('logoutBtn');

    // Retrieve books from localStorage
    const getBooks = () => {
        const books = JSON.parse(localStorage.getItem('books'));
        return books ? books : [];
    };

    // Save books to localStorage
    const saveBooks = (books) => {
        localStorage.setItem('books', JSON.stringify(books));
        console.log('Books saved to localStorage:', books);
    };

    // Generate a unique ID
    const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

    // Convert image file to base64
    const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });

    // Open Add Book Modal
    window.openAddBookModal = () => {
        bookForm.reset();
        bookIdInput.value = ''; // Clear book ID for adding new book
        modalTitle.textContent = 'Add Book';
        imagePreview.src = '';
        imagePreview.style.display = 'none';
        addBookModal.show();
    };

    // Open Edit Book Modal
    window.openEditBookModal = (id) => {
        const books = getBooks();
        const bookToEdit = books.find(book => book.id === id);
        if (bookToEdit) {
            bookIdInput.value = bookToEdit.id;
            document.getElementById('title').value = bookToEdit.title;
            document.getElementById('author').value = bookToEdit.author;
            document.getElementById('genre').value = bookToEdit.genre;
            document.getElementById('status').value = bookToEdit.status;
            modalTitle.textContent = 'Edit Book';
            imagePreview.src = bookToEdit.image;
            imagePreview.style.display = 'block';
            addBookModal.show();
        }
    };

    // Render books based on tab or search
    const renderBooks = (filter = 'all', searchTerm = '') => {
        const books = getBooks();
        bookContainer.innerHTML = '';

        const filteredBooks = books.filter(book => {
            const matchesTab = filter === 'all' ||
                               (filter === 'favorites' && book.favorite) ||
                               (filter === 'read' && book.status === 'Read') ||
                               (filter === 'unread' && book.status === 'Unread');

            const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  book.genre.toLowerCase().includes(searchTerm.toLowerCase()); // Include genre in search

            return matchesTab && matchesSearch;
        });

        if (filteredBooks.length === 0) {
            bookContainer.innerHTML = '<p class="text-center mt-3">No books found in this category.</p>';
            return;
        }

        filteredBooks.forEach(book => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4';
            card.innerHTML = `
                <div class="card h-100 shadow-sm" style="min-height: 400px;">
                    <div style="min-height: 200px; display: flex; align-items: center; justify-content: center;">
                        <img src="${book.image}" class="card-img-top" alt="${book.title}" style="width: 100%; height: auto; object-fit: contain; max-height: 250px;">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title" style="color: #007bff;">${book.title}</h5>
                        <p class="card-text"><strong>Author:</strong> ${book.author}</p>
                        <p class="card-text"><strong>Genre:</strong> ${book.genre}</p>
                        <p class="card-text"><strong>Status:</strong> ${book.status}</p>
                        <div class="d-flex gap-2 mb-2">
                            <button class="btn btn-sm btn-primary" onclick="openEditBookModal('${book.id}')">
                                Edit
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deleteBook('${book.id}')">Delete</button>
                            <button class="btn btn-sm btn-warning" onclick="toggleFavorite('${book.id}')">
                                ${book.favorite ? '★' : '☆'} Favorite
                            </button>
                        </div>
                    </div>
                </div>
            `;
            bookContainer.appendChild(card);
        });
    };

    // Toggle favorite status
    window.toggleFavorite = (id) => {
        const books = getBooks();
        const index = books.findIndex(book => book.id === id);
        if (index !== -1) {
            books[index].favorite = !books[index].favorite;
            saveBooks(books);
            renderBooks(getCurrentTab(), searchInput.value);
        }
    };

    // Toggle Read/Unread status
    window.toggleStatus = (id, status) => {
        const books = getBooks();
        const index = books.findIndex(book => book.id === id);
        if (index !== -1) {
            books[index].status = status;
            saveBooks(books);
            renderBooks(getCurrentTab(), searchInput.value);
        }
    };

    // Delete a book
    window.deleteBook = (id) => {
        if (confirm('Are you sure you want to delete this book?')) {
            const books = getBooks().filter(book => book.id !== id);
            saveBooks(books);
            renderBooks(getCurrentTab(), searchInput.value);
        }
    };

    // Get current tab name
    const getCurrentTab = () => {
        const activeTab = document.querySelector('.nav-link.active');
        return activeTab ? activeTab.getAttribute('data-tab') : 'all';
    };

    // Tab switching
    tabLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            tabLinks.forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');
            renderBooks(this.getAttribute('data-tab'), searchInput.value);
        });
    });

    // Handle book form submission (for both add and edit)
    addBookForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const title = document.getElementById('title').value.trim();
        const author = document.getElementById('author').value.trim();
        const genreValue = document.getElementById('genre').value.trim(); // Get genre from dropdown
        const status = statusSelect.value;
        const bookId = bookIdInput.value;
        const imageInput = document.getElementById('image');
        let imageBase64 = imagePreview.src; // Keep existing image if no new one is selected

        if (!title || !author || !genreValue || !status) {
            alert('Please fill in all fields.');
            return;
        }

        if (imageInput.files && imageInput.files[0]) {
            imageBase64 = await toBase64(imageInput.files[0]);
        } else if (!bookId && !imageBase64) {
            alert('Please upload a book cover.');
            return;
        }

        const books = getBooks();
        if (bookId) {
            // Editing existing book
            const index = books.findIndex(book => book.id === bookId);
            if (index !== -1) {
                books[index] = { id: bookId, title, author, genre: genreValue, status, favorite: books[index].favorite, image: imageBase64 };
            }
        } else {
            // Adding new book
            const newBook = { id: generateId(), title, author, genre: genreValue, status, favorite: false, image: imageBase64 };
            books.push(newBook);
        }

        saveBooks(books);
        addBookModal.hide();
        addBookForm.reset();
        renderBooks(getCurrentTab(), searchInput.value);
    });

    // Display image preview when a new image is selected
    imageInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            }
            reader.readAsDataURL(this.files[0]);
        } else if (!bookIdInput.value) {
            imagePreview.src = '';
            imagePreview.style.display = 'none';
        }
    });

    // Initial render
    renderBooks();

    // Search functionality
    searchInput.addEventListener('input', function () {
        renderBooks(getCurrentTab(), this.value);
    });

    // Logout functionality
    logoutDashboardButton.addEventListener('click', function () {
        localStorage.removeItem('isLoggedIn'); // Clear the login status
        window.location.href = '../index.html'; // Redirect to the landing page
    });
});