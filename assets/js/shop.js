// 商店页面功能实现
document.addEventListener('DOMContentLoaded', function() {
    initFilters();
    initSort();
    initSearch();
    initQuickView();
    initAddToCart();
    initWishlist();
    initPriceRange();
    initInfiniteScroll();
    initImageLazyLoading();
});

// 筛选功能
function initFilters() {
    const filterSelects = document.querySelectorAll('.filter-select');
    const products = document.querySelectorAll('.product-card');
    
    filterSelects.forEach(select => {
        select.addEventListener('change', () => {
            const filters = {};
            filterSelects.forEach(s => {
                filters[s.name] = s.value;
            });
            
            filterProducts(products, filters);
        });
    });
}

// 排序功能
function initSort() {
    const sortSelect = document.querySelector('.sort-select');
    const productsGrid = document.querySelector('.products-grid');
    
    if (sortSelect && productsGrid) {
        sortSelect.addEventListener('change', () => {
            const products = Array.from(productsGrid.children);
            const sortBy = sortSelect.value;
            
            products.sort((a, b) => {
                switch(sortBy) {
                    case 'price-low':
                        return getPrice(a) - getPrice(b);
                    case 'price-high':
                        return getPrice(b) - getPrice(a);
                    case 'name-asc':
                        return getName(a).localeCompare(getName(b));
                    case 'name-desc':
                        return getName(b).localeCompare(getName(a));
                    default:
                        return 0;
                }
            });
            
            // 重新添加排序后的产品
            products.forEach(product => {
                productsGrid.appendChild(product);
            });
        });
    }
}

// 搜索功能
function initSearch() {
    const searchInput = document.querySelector('.search-products input');
    const products = document.querySelectorAll('.product-card');
    
    let debounceTimer;
    
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const searchTerm = searchInput.value.toLowerCase();
                
                products.forEach(product => {
                    const title = product.querySelector('.product-title').textContent.toLowerCase();
                    const category = product.querySelector('.product-category').textContent.toLowerCase();
                    
                    if (title.includes(searchTerm) || category.includes(searchTerm)) {
                        fadeIn(product);
                    } else {
                        fadeOut(product);
                    }
                });
            }, 300);
        });
    }
}

// 快速查看功能
function initQuickView() {
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');
    const modal = document.querySelector('.quick-view-modal');
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const productId = button.dataset.productId;
            
            try {
                const productData = await fetchProductDetails(productId);
                showQuickViewModal(productData);
            } catch (error) {
                console.error('Failed to fetch product details:', error);
                showNotification('Failed to load product details', 'error');
            }
        });
    });
    
    // 关闭模态框
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// 添加到购物车
function initAddToCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const productId = button.dataset.productId;
            
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            try {
                await addProductToCart(productId);
                updateCartCount();
                showNotification('Product added to cart!', 'success');
                
                // 添加动画效果
                const product = button.closest('.product-card');
                const cart = document.querySelector('.cart-icon');
                animateToCart(product, cart);
                
            } catch (error) {
                console.error('Failed to add product to cart:', error);
                showNotification('Failed to add product to cart', 'error');
            } finally {
                button.disabled = false;
                button.textContent = 'Add to Cart';
            }
        });
    });
}

// 愿望清单功能
function initWishlist() {
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const productId = button.dataset.productId;
            const isInWishlist = button.classList.contains('active');
            
            try {
                if (isInWishlist) {
                    await removeFromWishlist(productId);
                    button.classList.remove('active');
                    showNotification('Removed from wishlist', 'info');
                } else {
                    await addToWishlist(productId);
                    button.classList.add('active');
                    showNotification('Added to wishlist', 'success');
                }
            } catch (error) {
                console.error('Wishlist operation failed:', error);
                showNotification('Failed to update wishlist', 'error');
            }
        });
    });
}

// 价格范围筛选
function initPriceRange() {
    const priceRange = document.querySelector('.price-range');
    const minPrice = document.querySelector('.min-price');
    const maxPrice = document.querySelector('.max-price');
    
    if (priceRange && minPrice && maxPrice) {
        noUiSlider.create(priceRange, {
            start: [0, 1000],
            connect: true,
            range: {
                'min': 0,
                'max': 1000
            }
        });
        
        priceRange.noUiSlider.on('update', (values) => {
            minPrice.textContent = `$${Math.round(values[0])}`;
            maxPrice.textContent = `$${Math.round(values[1])}`;
            
            filterByPrice(values[0], values[1]);
        });
    }
}

// 无限滚动
function initInfiniteScroll() {
    const productsGrid = document.querySelector('.products-grid');
    let page = 1;
    let loading = false;
    
    window.addEventListener('scroll', async () => {
        if (loading) return;
        
        const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
        
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            loading = true;
            
            try {
                const response = await fetchMoreProducts(page + 1);
                if (response.products.length > 0) {
                    appendProducts(response.products);
                    page++;
                }
            } catch (error) {
                console.error('Failed to load more products:', error);
            } finally {
                loading = false;
            }
        }
    });
}

// 图���懒加载
function initImageLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// 工具函数
function getPrice(product) {
    return parseFloat(product.querySelector('.current-price').textContent.replace('$', ''));
}

function getName(product) {
    return product.querySelector('.product-title').textContent;
}

function fadeIn(element) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    (function fade() {
        let val = parseFloat(element.style.opacity);
        if (!((val += .1) > 1)) {
            element.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
}

function fadeOut(element) {
    element.style.opacity = '1';
    
    (function fade() {
        if ((element.style.opacity -= .1) < 0) {
            element.style.display = 'none';
        } else {
            requestAnimationFrame(fade);
        }
    })();
}

function animateToCart(product, cart) {
    const productRect = product.getBoundingClientRect();
    const cartRect = cart.getBoundingClientRect();
    
    const ghost = product.cloneNode(true);
    ghost.style.position = 'fixed';
    ghost.style.top = `${productRect.top}px`;
    ghost.style.left = `${productRect.left}px`;
    ghost.style.width = `${productRect.width}px`;
    ghost.style.height = `${productRect.height}px`;
    ghost.style.transition = 'all 0.8s ease-in-out';
    ghost.style.zIndex = '1000';
    
    document.body.appendChild(ghost);
    
    requestAnimationFrame(() => {
        ghost.style.transform = `
            translate(
                ${cartRect.left - productRect.left}px,
                ${cartRect.top - productRect.top}px
            ) scale(0.1)
        `;
        ghost.style.opacity = '0';
    });
    
    setTimeout(() => {
        ghost.remove();
    }, 800);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// API调用函数
async function fetchProductDetails(productId) {
    // 这里替换为实际的API调用
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: productId,
                title: 'Product Name',
                price: 99.99,
                description: 'Product description...'
            });
        }, 500);
    });
}

async function addProductToCart(productId) {
    // 这里替换为实际的API调用
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 500);
    });
}

async function addToWishlist(productId) {
    // 这里替换为实际的API调用
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 500);
    });
}

async function removeFromWishlist(productId) {
    // 这里替换为实际的API调用
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 500);
    });
}

async function fetchMoreProducts(page) {
    // 这里替换为实际的API调用
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                products: [],
                hasMore: false
            });
        }, 500);
    });
}
