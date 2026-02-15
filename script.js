// TechSpec E-commerce JavaScript
// Common functionality for all pages

document.addEventListener('DOMContentLoaded', () => {
    // ========== Dark Mode Toggle ==========
    initDarkMode();
    
    // ========== Search Functionality ==========
    initSearch();
    
    // ========== Shopping Cart Counter ==========
    initCartCounter();
    
    // ========== Favorite/Wishlist Toggle ==========
    initFavorites();
    
    // ========== Smooth Scrolling ==========
    initSmoothScroll();
    
    // ========== Mobile Menu Toggle ==========
    initMobileMenu();
});

// Dark Mode Toggle
function initDarkMode() {
    const darkModeBtn = Array.from(document.querySelectorAll('button')).find(btn => {
        const icon = btn.querySelector('.material-symbols-outlined');
        return (icon && icon.textContent.includes('dark_mode')) ||
               btn.textContent.includes('Toggle Dark Mode') || 
               btn.textContent.includes('Dark Mode');
    });
    
    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            // Save preference to localStorage
            const isDark = document.documentElement.classList.contains('dark');
            localStorage.setItem('darkMode', isDark);
        });
        
        // Load saved preference
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'true') {
            document.documentElement.classList.add('dark');
        }
    }
}

// Search Functionality
function initSearch() {
    const searchInputs = document.querySelectorAll('input[type="text"][placeholder*="Search"], input[placeholder*="search"]');
    
    searchInputs.forEach(input => {
        // Add search icon click handler
        const searchIcon = input.parentElement.querySelector('.material-symbols-outlined');
        if (searchIcon) {
            searchIcon.addEventListener('click', () => {
                performSearch(input.value);
            });
        }
        
        // Add Enter key handler
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(input.value);
            }
        });
    });
}

function performSearch(query) {
    if (query.trim()) {
        console.log('Searching for:', query);
        // You can implement actual search logic here
        alert(`Searching for: ${query}`);
    }
}

// Shopping Cart Counter
function initCartCounter() {
    let cartCount = parseInt(localStorage.getItem('cartCount') || '0');
    updateCartBadge(cartCount);
    
    // Listen for add to cart events
    const allButtons = document.querySelectorAll('button');
    const addToCartButtons = Array.from(allButtons).filter(btn => {
        const icon = btn.querySelector('.material-symbols-outlined');
        return icon && (icon.textContent.includes('add_shopping_cart') || 
                       icon.textContent.includes('shopping_bag') ||
                       btn.textContent.includes('Buy Now') ||
                       btn.textContent.includes('Add to Cart'));
    });
    
    addToCartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Don't prevent default if it's a link
            if (btn.tagName === 'BUTTON') {
                e.preventDefault();
            }
            cartCount++;
            localStorage.setItem('cartCount', cartCount);
            updateCartBadge(cartCount);
            
            // Show notification
            showNotification('Item added to cart!');
        });
    });
}

function updateCartBadge(count) {
    // Find all material icons and check for cart icons
    const allIcons = document.querySelectorAll('.material-symbols-outlined');
    allIcons.forEach(icon => {
        if (icon.textContent.includes('shopping_cart') || icon.textContent.includes('add_shopping_cart')) {
            const nextSibling = icon.nextElementSibling;
            if (nextSibling && nextSibling.tagName === 'SPAN') {
                if (count > 0) {
                    nextSibling.textContent = count;
                    nextSibling.style.display = 'flex';
                } else {
                    nextSibling.style.display = 'none';
                }
            }
        }
    });
}

// Favorite/Wishlist Toggle
function initFavorites() {
    const allButtons = document.querySelectorAll('button');
    const favoriteButtons = Array.from(allButtons).filter(btn => {
        const icon = btn.querySelector('.material-symbols-outlined');
        return icon && icon.textContent.includes('favorite');
    });
    
    favoriteButtons.forEach(btn => {
        const icon = btn.querySelector('.material-symbols-outlined');
        if (!icon) return;
        
        // Find parent card or product container
        let productContainer = btn.closest('[class*="card"], [class*="product"], [class*="group"]');
        const productId = productContainer?.getAttribute('data-product-id') || 
                         productContainer?.querySelector('h3')?.textContent?.trim() ||
                         Math.random().toString(36).substr(2, 9);
        
        // Check if already favorited
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        if (favorites.includes(productId)) {
            icon.style.color = '#ef4444';
            icon.style.fontVariationSettings = "'FILL' 1";
        }
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            
            if (favorites.includes(productId)) {
                favorites = favorites.filter(id => id !== productId);
                icon.style.color = '';
                icon.style.fontVariationSettings = "'FILL' 0";
                showNotification('Removed from favorites');
            } else {
                favorites.push(productId);
                icon.style.color = '#ef4444';
                icon.style.fontVariationSettings = "'FILL' 1";
                showNotification('Added to favorites!');
            }
            
            localStorage.setItem('favorites', JSON.stringify(favorites));
        });
    });
}

// Smooth Scrolling for Anchor Links
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mobile Menu Toggle (if needed)
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('[data-mobile-menu]');
    const mobileMenu = document.querySelector('[data-mobile-menu-content]');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Notification System
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification fixed top-4 right-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg px-6 py-4 z-50 flex items-center gap-3 animate-slide-in';
    notification.innerHTML = `
        <span class="material-symbols-outlined text-green-500">check_circle</span>
        <span class="text-sm font-semibold text-slate-900 dark:text-white">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slide-out 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slide-in {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slide-out {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .animate-slide-in {
        animation: slide-in 0.3s ease-out;
    }
`;
document.head.appendChild(style);

// Page-specific functionality
// ========== Homepage (index.html) ==========
if (document.title.includes('TechSpec | Smartphone Specs')) {
    initHomepageFeatures();
}

function initHomepageFeatures() {
    // Add to Compare functionality
    const allButtons = document.querySelectorAll('button');
    const compareButtons = Array.from(allButtons).filter(btn => 
        btn.textContent.includes('Add to Compare') || 
        btn.textContent.includes('Compare')
    );
    
    let compareCount = parseInt(localStorage.getItem('compareCount') || '3');
    
    // Find compare badge
    const allIcons = document.querySelectorAll('.material-symbols-outlined');
    let compareBadge = null;
    allIcons.forEach(icon => {
        if (icon.textContent.includes('compare_arrows')) {
            const nextSibling = icon.nextElementSibling;
            if (nextSibling && nextSibling.tagName === 'SPAN') {
                compareBadge = nextSibling;
            }
        }
    });
    
    compareButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (this.classList.contains('bg-primary')) {
                this.className = 'w-full bg-slate-50 dark:bg-slate-800 hover:bg-primary hover:text-white text-primary text-xs font-bold py-2 rounded-lg transition-colors border border-primary/20';
                this.textContent = 'Add to Compare';
                compareCount--;
            } else {
                this.className = 'w-full bg-primary text-white text-xs font-bold py-2 rounded-lg transition-colors border border-primary';
                this.textContent = 'Added';
                compareCount++;
            }
            localStorage.setItem('compareCount', compareCount);
            if (compareBadge) compareBadge.textContent = compareCount;
        });
    });
}

// ========== Laptops Page (index2.html) ==========
if (document.title.includes('High Performance Laptops')) {
    initLaptopsPageFeatures();
}

function initLaptopsPageFeatures() {
    // Price Range Slider
    const priceRange = document.querySelector('input[type="range"]');
    if (priceRange) {
        priceRange.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            const priceHeader = Array.from(document.querySelectorAll('h4')).find(h => h.textContent.includes('Price Range'));
            if (priceHeader) {
                priceHeader.innerHTML = `Price Range: <span class="text-primary">$${value.toLocaleString()}</span>`;
            }
        });
    }
    
    // Filter Accordions
    const filterHeaders = document.querySelectorAll('aside h4');
    filterHeaders.forEach(header => {
        const icon = header.querySelector('.material-symbols-outlined');
        if (icon && icon.textContent === 'expand_more') {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                if (content) {
                    content.classList.toggle('hidden');
                    icon.style.transform = content.classList.contains('hidden') ? 'rotate(-90deg)' : 'rotate(0deg)';
                    icon.style.transition = 'transform 0.2s';
                }
            });
        }
    });
}

// ========== Product Detail Page (index3.html) ==========
if (document.title.includes('Product Details') || document.title.includes('Quantum')) {
    initProductDetailFeatures();
}

function initProductDetailFeatures() {
    // Image Gallery
    const mainImage = document.querySelector('img[data-alt*="main"], img[data-alt*="front view"]');
    const thumbnails = document.querySelectorAll('.size-20 img, .size-24 img, [class*="thumb"] img');
    
    if (mainImage && thumbnails.length > 0) {
        thumbnails.forEach(thumb => {
            thumb.parentElement.addEventListener('click', () => {
                mainImage.style.opacity = '0.5';
                mainImage.src = thumb.src;
                setTimeout(() => mainImage.style.opacity = '1', 150);
                
                // Update active state
                thumbnails.forEach(t => {
                    t.parentElement.classList.remove('border-primary', 'border-2');
                    t.parentElement.classList.add('border-slate-200');
                });
                thumb.parentElement.classList.remove('border-slate-200');
                thumb.parentElement.classList.add('border-primary', 'border-2');
            });
        });
    }
    
    // Color Selection
    const colorOptions = document.querySelectorAll('.size-8.rounded-full');
    const colorNameDisplay = document.querySelector('p.text-sm.font-bold.text-slate-900 span');
    const colorNames = ['Phantom Black', 'Titanium Silver', 'Deep Ocean Blue', 'Emerald Green'];
    
    if (colorOptions.length > 0) {
        colorOptions.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                colorOptions.forEach(b => {
                    b.classList.remove('ring-2', 'ring-offset-2');
                });
                
                btn.classList.add('ring-2', 'ring-offset-2');
                if (colorNameDisplay && colorNames[index]) {
                    colorNameDisplay.textContent = colorNames[index];
                }
            });
        });
    }
    
    // Storage Selection
    const storageContainer = Array.from(document.querySelectorAll('p')).find(p => p.textContent === 'Storage')?.nextElementSibling;
    if (storageContainer) {
        const storageBtns = storageContainer.querySelectorAll('button');
        storageBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                storageBtns.forEach(b => {
                    b.className = 'px-4 py-2 text-sm font-semibold rounded-lg border border-slate-200 bg-white text-slate-900 hover:border-primary transition-all';
                });
                btn.className = 'px-4 py-2 text-sm font-semibold rounded-lg border-2 border-primary bg-primary/5 text-primary';
            });
        });
    }
}
