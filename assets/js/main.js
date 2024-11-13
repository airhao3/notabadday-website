// 主要JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavigation();
    initScrollEffects();
    initLazyLoading();
    initAnimations();
    initProductInteractions();
    initSearchFunctionality();
});

// 导航功能
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
    let lastScroll = 0;

    // 滚动处理
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // 导航栏显示/隐藏逻辑
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.classList.add('hide');
        } else {
            navbar.classList.remove('hide');
        }
        
        // 添加背景色
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // 移动端菜单
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            document.body.classList.toggle('menu-open');
            mobileMenuBtn.classList.toggle('active');
        });
    }
}

// 滚动效果
function initScrollEffects() {
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 返回顶部按钮
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 懒加载图片
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// 动画效果
function initAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1
    });
    animatedElements.forEach(el => animationObserver.observe(el));
}

// 产品交互
function initProductInteractions() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // 快速预览
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-view')) {
                showProductQuickView(card);
            }
        });

        // 颜色选择
        const colorOptions = card.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                updateProductImage(card, option.dataset.color);
            });
        });
    });
}

// 快速预览模态框
function showProductQuickView(productCard) {
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    
    const productData = {
        name: productCard.querySelector('h3').textContent,
        price: productCard.querySelector('.price').textContent,
        image: productCard.querySelector('img').dataset.src,
        description: productCard.dataset.description
    };

    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <div class="product-preview">
                <img src="${productData.image}" alt="${productData.name}">
                <div class="product-details">
                    <h3>${productData.name}</h3>
                    <p class="price">${productData.price}</p>
                    <p class="description">${productData.description}</p>
                    <button class="add-to-cart">Add to Cart</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);

    // 关闭模态框
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    });
}

// 搜索功能
function initSearchFunctionality() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (searchInput) {
        let debounceTimer;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const query = e.target.value.trim();
                if (query.length >= 2) {
                    performSearch(query);
                } else {
                    searchResults.innerHTML = '';
                }
            }, 300);
        });
    }
}

// 执行搜索
async function performSearch(query) {
    try {
        // 这里可以替换为实际的API调用
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const results = await response.json();
        displaySearchResults(results);
    } catch (error) {
        console.error('Search failed:', error);
    }
}

// 显示搜索结果
function displaySearchResults(results) {
    const searchResults = document.querySelector('.search-results');
    if (!results.length) {
        searchResults.innerHTML = '<p class="no-results">No results found</p>';
        return;
    }

    searchResults.innerHTML = results.map(result => `
        <div class="search-result-item">
            <img src="${result.image}" alt="${result.name}">
            <div class="result-details">
                <h4>${result.name}</h4>
                <p class="price">${result.price}</p>
            </div>
        </div>
    `).join('');
}

