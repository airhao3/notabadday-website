// 博客页面功能实现
document.addEventListener('DOMContentLoaded', function() {
    initCategoryFilter();
    initSearch();
    initInfiniteScroll();
    initSubscribeForm();
    initLazyLoading();
    initShareButtons();
    initReadingTime();
});

// 分类筛选
function initCategoryFilter() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const posts = document.querySelectorAll('.post-card');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按钮的活动状态
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.dataset.category;
            
            posts.forEach(post => {
                if (category === 'all') {
                    post.style.display = 'block';
                    fadeIn(post);
                } else {
                    if (post.dataset.category === category) {
                        post.style.display = 'block';
                        fadeIn(post);
                    } else {
                        fadeOut(post);
                    }
                }
            });
        });
    });
}

// 搜索功能
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    const posts = document.querySelectorAll('.post-card');
    
    let debounceTimer;
    
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const searchTerm = searchInput.value.toLowerCase();
            
            posts.forEach(post => {
                const title = post.querySelector('h3').textContent.toLowerCase();
                const content = post.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || content.includes(searchTerm)) {
                    post.style.display = 'block';
                    fadeIn(post);
                } else {
                    fadeOut(post);
                }
            });
        }, 300);
    });
    
    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        searchInput.dispatchEvent(new Event('input'));
    });
}

// 无限滚动
function initInfiniteScroll() {
    const postsGrid = document.querySelector('.posts-grid');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    let page = 1;
    let loading = false;
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', async () => {
            if (loading) return;
            
            loading = true;
            loadMoreBtn.textContent = 'Loading...';
            
            try {
                const response = await fetchMorePosts(page + 1);
                if (response.posts.length > 0) {
                    appendPosts(response.posts);
                    page++;
                    
                    if (response.hasMore === false) {
                        loadMoreBtn.style.display = 'none';
                    }
                }
            } catch (error) {
                console.error('Failed to load more posts:', error);
                showNotification('Failed to load more posts. Please try again.', 'error');
            } finally {
                loading = false;
                loadMoreBtn.textContent = 'Load More';
            }
        });
    }
}

// 订阅表单处理
function initSubscribeForm() {
    const subscribeForm = document.querySelector('.subscribe-form');
    
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = subscribeForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            try {
                const response = await subscribeToNewsletter(email);
                showNotification('Successfully subscribed to newsletter!', 'success');
                subscribeForm.reset();
            } catch (error) {
                console.error('Newsletter subscription error:', error);
                showNotification('Failed to subscribe. Please try again.', 'error');
            }
        });
    }
}

// 图片懒加载
function initLazyLoading() {
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

// 分享按钮功能
function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-button');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', () => {
            const platform = button.dataset.platform;
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            
            let shareUrl;
            switch (platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                    break;
            }
            
            window.open(shareUrl, '_blank', 'width=600,height=400');
        });
    });
}

// 阅读时间计算
function initReadingTime() {
    const articles = document.querySelectorAll('.post-card');
    
    articles.forEach(article => {
        const content = article.querySelector('p').textContent;
        const wordCount = content.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200); // 假设平均阅读速度为每分钟200字
        
        const timeElement = article.querySelector('.reading-time');
        if (timeElement) {
            timeElement.textContent = `${readingTime} min read`;
        }
    });
}

// 工具函数
function fadeIn(element) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let opacity = 0;
    const animation = setInterval(() => {
        opacity += 0.1;
        element.style.opacity = opacity;
        
        if (opacity >= 1) {
            clearInterval(animation);
        }
    }, 30);
}

function fadeOut(element) {
    let opacity = 1;
    const animation = setInterval(() => {
        opacity -= 0.1;
        element.style.opacity = opacity;
        
        if (opacity <= 0) {
            element.style.display = 'none';
            clearInterval(animation);
        }
    }, 30);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
async function fetchMorePosts(page) {
    // 这里替换为实际的API调用
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                posts: [], // 模拟数据
                hasMore: false
            });
        }, 1000);
    });
}

async function subscribeToNewsletter(email) {
    // 这里替换为实际的API调用
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 1000);
    });
}
