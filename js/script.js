// ============================================
// Data Management
// ============================================

let items = [];
let itemIdCounter = 1000;

// Initialize with sample data
function initializeSampleData() {
    const sampleItems = [
        {
            id: itemIdCounter++,
            itemName: "Blue Backpack",
            category: "personal",
            description: "Navy blue backpack with laptop compartment, lost near the library entrance",
            location: "Library",
            date: "2026-02-08",
            status: "lost",
            image: "📷",
            contact: "john@university.edu"
        },
        {
            id: itemIdCounter++,
            itemName: "Red Wallet",
            category: "personal",
            description: "Red leather wallet with student ID inside, found in the cafeteria",
            location: "Cafeteria",
            date: "2026-02-09",
            status: "found",
            image: "📷",
            contact: "admin@university.edu"
        },
        {
            id: itemIdCounter++,
            itemName: "Apple MacBook Air",
            category: "electronics",
            description: "Silver MacBook Air 13-inch, lost in CS building room 205",
            location: "Building A",
            date: "2026-02-07",
            status: "lost",
            image: "📷",
            contact: "jane@university.edu"
        },
        {
            id: itemIdCounter++,
            itemName: "Physics Textbook",
            category: "books",
            description: "Physics textbook with highlighted notes, found at the main entrance",
            location: "Main Entrance",
            date: "2026-02-09",
            status: "found",
            image: "📷",
            contact: "librarian@university.edu"
        },
        {
            id: itemIdCounter++,
            itemName: "Black AirPods",
            category: "electronics",
            description: "Black Apple AirPods Pro with case, lost during basketball game",
            location: "Sports Complex",
            date: "2026-02-06",
            status: "lost",
            image: "📷",
            contact: "sports@university.edu"
        },
        {
            id: itemIdCounter++,
            itemName: "Gray Jacket",
            category: "clothing",
            description: "Gray winter jacket with red stripes, found in the gym locker room",
            location: "Gym",
            date: "2026-02-09",
            status: "found",
            image: "📷",
            contact: "facilities@university.edu"
        }
    ];

    items = sampleItems;
    updateAllViews();
}

// ============================================
// Page Navigation
// ============================================

function switchPage(pageName) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    // Show selected page
    const selectedPage = document.getElementById(pageName);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.dataset.page === pageName) {
            link.style.borderBottom = '3px solid #ffffff';
        } else {
            link.style.borderBottom = 'none';
        }
    });

    // Close mobile menu
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.remove('active');

    // Populate page content when switching
    if (pageName === 'home') {
        displayRecentlyAdded();
    } else if (pageName === 'search') {
        displayAllItems();
    } else if (pageName === 'admin') {
        updateAdminDashboard();
    }
}

// ============================================
// Mobile Menu Toggle
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Close menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const pageName = this.dataset.page;
            switchPage(pageName);
        });
    });

    // Initialize sample data
    initializeSampleData();
});

// ============================================
// Notification System
// ============================================

function showNotification(message) {
    const banner = document.getElementById('notificationBanner');
    const text = document.getElementById('notificationText');
    text.textContent = message;
    banner.classList.add('show');

    // Auto-hide after 5 seconds
    setTimeout(() => {
        banner.classList.remove('show');
    }, 5000);
}

function closeNotification() {
    const banner = document.getElementById('notificationBanner');
    banner.classList.remove('show');
}

// ============================================
// Form Handling & Validation
// ============================================

// Validate form
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            input.style.borderColor = '#e2e8f0';
        }
    });

    return isValid;
}

// Image preview
document.getElementById('lostImage')?.addEventListener('change', function(e) {
    handleImagePreview(e, 'lostImagePreview');
});

document.getElementById('foundImage')?.addEventListener('change', function(e) {
    handleImagePreview(e, 'foundImagePreview');
});

function handleImagePreview(event, previewContainerId) {
    const files = event.target.files;
    const container = document.getElementById(previewContainerId);
    container.innerHTML = '';

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            container.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}

// Lost Item Form Submission
document.getElementById('lostItemForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    if (!validateForm(this)) {
        alert('Please fill all required fields');
        return;
    }

    const formData = {
        id: itemIdCounter++,
        itemName: document.getElementById('lostItemName').value,
        category: document.getElementById('lostCategory').value,
        description: document.getElementById('lostDescription').value,
        location: document.getElementById('lostLocation').value,
        date: document.getElementById('lostDate').value,
        status: 'lost',
        image: '📷',
        contact: document.getElementById('lostContact').value,
        dateAdded: new Date().toISOString()
    };

    items.push(formData);

    // Show matches
    const matches = findMatches(formData);
    if (matches.length > 0) {
        displayMatches(matches, 'lostMatches', 'lostMatchesGrid');
    }

    showNotification('✓ Lost item reported successfully! We will help you find it.');
    this.reset();
    document.getElementById('lostImagePreview').innerHTML = '';

    updateAllViews();

    // Scroll to matches
    if (matches.length > 0) {
        setTimeout(() => {
            document.getElementById('lostMatches').scrollIntoView({ behavior: 'smooth' });
        }, 300);
    }
});

// Found Item Form Submission
document.getElementById('foundItemForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    if (!validateForm(this)) {
        alert('Please fill all required fields');
        return;
    }

    const formData = {
        id: itemIdCounter++,
        itemName: document.getElementById('foundItemName').value,
        category: document.getElementById('foundCategory').value,
        description: document.getElementById('foundDescription').value,
        location: document.getElementById('foundLocation').value,
        date: document.getElementById('foundDate').value,
        status: 'found',
        image: '📷',
        contact: document.getElementById('foundContact').value,
        dateAdded: new Date().toISOString()
    };

    items.push(formData);

    // Show matches
    const matches = findMatches(formData);
    if (matches.length > 0) {
        displayMatches(matches, 'foundMatches', 'foundMatchesGrid');
    }

    showNotification('✓ Found item reported successfully! Thank you for helping.');
    this.reset();
    document.getElementById('foundImagePreview').innerHTML = '';

    updateAllViews();

    // Scroll to matches
    if (matches.length > 0) {
        setTimeout(() => {
            document.getElementById('foundMatches').scrollIntoView({ behavior: 'smooth' });
        }, 300);
    }
});

// ============================================
// Matching System
// ============================================

function findMatches(newItem) {
    const oppositeStatus = newItem.status === 'lost' ? 'found' : 'lost';
    const matches = [];

    items.forEach(item => {
        if (item.status !== oppositeStatus || item.id === newItem.id) return;

        const categoryMatch = item.category === newItem.category;
        const locationProximity = item.location.toLowerCase().includes(newItem.location.toLowerCase()) ||
                                 newItem.location.toLowerCase().includes(item.location.toLowerCase());
        const keywordMatch = newItem.description.toLowerCase().split(' ').some(word =>
            word.length > 3 && item.description.toLowerCase().includes(word)
        );

        // Calculate match score
        let score = 0;
        if (categoryMatch) score += 40;
        if (locationProximity) score += 35;
        if (keywordMatch) score += 25;

        if (score >= 40) {
            matches.push({ ...item, matchScore: score });
        }
    });

    // Sort by match score
    matches.sort((a, b) => b.matchScore - a.matchScore);
    return matches.slice(0, 3); // Return top 3 matches
}

function displayMatches(matches, sectionId, gridId) {
    const section = document.getElementById(sectionId);
    const grid = document.getElementById(gridId);

    if (matches.length === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';
    grid.innerHTML = '';

    matches.forEach(item => {
        const card = createItemCard(item, true);
        grid.appendChild(card);
    });
}

// ============================================
// Display Functions
// ============================================

function displayRecentlyAdded() {
    const recentItems = [...items]
        .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
        .slice(0, 6);

    const grid = document.getElementById('recentlyAddedGrid');
    grid.innerHTML = '';

    if (recentItems.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b;">No items yet</p>';
        return;
    }

    recentItems.forEach(item => {
        const card = createItemCard(item);
        grid.appendChild(card);
    });
}

function createItemCard(item, isMatch = false) {
    const card = document.createElement('div');
    card.className = 'item-card';

    const categoryEmoji = getCategoryEmoji(item.category);
    const dateObj = new Date(item.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    card.innerHTML = `
        <div class="item-image" style="display: flex; align-items: center; justify-content: center; font-size: 4rem;">
            ${getCategoryIcon(item.category)}
        </div>
        <div class="item-content">
            <div class="item-header">
                <h3 class="item-name">${item.itemName}</h3>
                <span class="item-badge ${item.status === 'lost' ? 'badge-lost' : 'badge-found'}">
                    ${item.status}
                </span>
            </div>
            ${isMatch ? `<span class="item-badge badge-matched">Suggested Match</span>` : ''}
            <span class="item-category">${item.category}</span>
            <p class="item-description">${item.description}</p>
            <div class="item-meta">
                <div class="item-location">📍 <strong>${item.location}</strong></div>
                <div class="item-date">📅 ${formattedDate}</div>
                <div class="item-date">📧 ${item.contact}</div>
            </div>
            <div class="item-actions">
                <button class="btn btn-primary" onclick="alert('Contacting: ${item.contact}')">Contact Owner</button>
                <button class="btn btn-secondary" onclick="shareItem(${item.id})">Share</button>
            </div>
        </div>
    `;

    return card;
}

function displayAllItems() {
    const grid = document.getElementById('searchResultsGrid');
    grid.innerHTML = '';

    if (items.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b;">No items found</p>';
        return;
    }

    items.forEach(item => {
        const card = createItemCard(item);
        grid.appendChild(card);
    });

    updateResultsTitle();
}

function updateResultsTitle() {
    const title = document.getElementById('resultsTitle');
    const count = items.length;
    title.textContent = `All Items (${count})`;
}

// ============================================
// Search & Filter
// ============================================

function performSearch() {
    applyFilters();
}

function applyFilters() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('filterStatus').value;
    const categoryFilter = document.getElementById('filterCategory').value;
    const locationFilter = document.getElementById('filterLocation').value.toLowerCase();
    const dateRange = parseInt(document.getElementById('filterDateRange').value) || null;

    const today = new Date();
    const filteredItems = items.filter(item => {
        // Search term filter
        const matchesSearch = !searchInput ||
            item.itemName.toLowerCase().includes(searchInput) ||
            item.description.toLowerCase().includes(searchInput);

        // Status filter
        const matchesStatus = !statusFilter || item.status === statusFilter;

        // Category filter
        const matchesCategory = !categoryFilter || item.category === categoryFilter;

        // Location filter
        const matchesLocation = !locationFilter || item.location.toLowerCase().includes(locationFilter);

        // Date range filter
        let matchesDate = true;
        if (dateRange) {
            const itemDate = new Date(item.date);
            const daysDiff = Math.floor((today - itemDate) / (1000 * 60 * 60 * 24));
            matchesDate = daysDiff <= dateRange;
        }

        return matchesSearch && matchesStatus && matchesCategory && matchesLocation && matchesDate;
    });

    displayFilteredResults(filteredItems);
}

function displayFilteredResults(filteredItems) {
    const grid = document.getElementById('searchResultsGrid');
    grid.innerHTML = '';

    if (filteredItems.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b;">No items found matching your criteria</p>';
        return;
    }

    filteredItems.forEach(item => {
        const card = createItemCard(item);
        grid.appendChild(card);
    });

    const title = document.getElementById('resultsTitle');
    title.textContent = `Results (${filteredItems.length})`;
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterStatus').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterLocation').value = '';
    document.getElementById('filterDateRange').value = '';
    displayAllItems();
}

// ============================================
// Admin Dashboard
// ============================================

function updateAdminDashboard() {
    updateStats();
    updateAdminTable();
}

function updateStats() {
    const total = items.length;
    const lost = items.filter(item => item.status === 'lost').length;
    const found = items.filter(item => item.status === 'found').length;
    const resolved = items.filter(item => item.status === 'resolved').length;

    document.getElementById('totalItemsCount').textContent = total;
    document.getElementById('lostItemsCount').textContent = lost;
    document.getElementById('foundItemsCount').textContent = found;
    document.getElementById('resolvedItemsCount').textContent = resolved;
}

function updateAdminTable() {
    const tbody = document.getElementById('adminTableBody');
    tbody.innerHTML = '';

    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${item.id}</td>
            <td>${item.itemName}</td>
            <td>${item.category}</td>
            <td>
                <span class="item-badge ${item.status === 'lost' ? 'badge-lost' : item.status === 'found' ? 'badge-found' : 'badge-resolved'}">
                    ${item.status}
                </span>
            </td>
            <td>${item.location}</td>
            <td>${new Date(item.date).toLocaleDateString()}</td>
            <td>
                <div class="admin-table-actions">
                    <button class="btn btn-primary" onclick="openEditModal(${item.id})">Edit</button>
                    <button class="btn btn-secondary" onclick="markAsResolved(${item.id})">Resolve</button>
                    <button class="btn btn-danger" onclick="deleteItem(${item.id})">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function openEditModal(itemId) {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    document.getElementById('editItemId').value = itemId;
    document.getElementById('editItemName').value = item.itemName;
    document.getElementById('editDescription').value = item.description;
    document.getElementById('editStatus').value = item.status;

    const modal = document.getElementById('editModal');
    modal.classList.add('show');
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.classList.remove('show');
}

document.getElementById('editForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const itemId = parseInt(document.getElementById('editItemId').value);
    const item = items.find(i => i.id === itemId);

    if (item) {
        item.itemName = document.getElementById('editItemName').value;
        item.description = document.getElementById('editDescription').value;
        item.status = document.getElementById('editStatus').value;

        showNotification('✓ Item updated successfully');
        updateAdminDashboard();
        closeEditModal();
    }
});

function markAsResolved(itemId) {
    const item = items.find(i => i.id === itemId);
    if (item) {
        item.status = 'resolved';
        showNotification('✓ Item marked as resolved');
        updateAdminDashboard();
    }
}

function deleteItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        items = items.filter(i => i.id !== itemId);
        showNotification('✓ Item deleted successfully');
        updateAdminDashboard();
        updateAllViews();
    }
}

function downloadReport() {
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            totalItems: items.length,
            lostItems: items.filter(i => i.status === 'lost').length,
            foundItems: items.filter(i => i.status === 'found').length,
            resolvedItems: items.filter(i => i.status === 'resolved').length
        },
        items: items
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lost-found-report-${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showNotification('✓ Report downloaded successfully');
}

// ============================================
// Utility Functions
// ============================================

function getCategoryEmoji(category) {
    const emojis = {
        'electronics': '📱',
        'books': '📚',
        'clothing': '👕',
        'personal': '👜',
        'sports': '⚽',
        'other': '📦'
    };
    return emojis[category] || '📦';
}

function getCategoryIcon(category) {
    return getCategoryEmoji(category);
}

function shareItem(itemId) {
    const item = items.find(i => i.id === itemId);
    if (item) {
        const text = `${item.itemName} - ${item.status.toUpperCase()}\n${item.description}\nLocation: ${item.location}\nDate: ${item.date}`;
        if (navigator.share) {
            navigator.share({
                title: `University Lost & Found - ${item.itemName}`,
                text: text
            });
        } else {
            // Fallback
            const shareUrl = `Check this out: "${item.itemName}" posted on University Lost & Found - ${item.description}`;
            alert('Share this: ' + shareUrl);
        }
    }
}

function updateAllViews() {
    displayRecentlyAdded();
    displayAllItems();
    updateStats();
}

// ============================================
// Close Modal when clicking outside
// ============================================

window.addEventListener('click', function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeEditModal();
    }
});
