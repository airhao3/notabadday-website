// 博客文章页面功能实现
document.addEventListener('DOMContentLoaded', function() {
    initTableOfContents();
    initSyntaxHighlighting();
    initImageZoom();
    initShareButtons();
    initCommentSystem();
    initProgressBar();
    initRelatedPosts();
    initReadingTime();
    initStickyShare();
});

// 目录生成
function initTableOfContents() {
    const article = document.querySelector('.post-content');
    const toc = document.querySelector('.table-of-contents');
    
    if (article && toc) {
        const headings = article.querySelectorAll('h2, h3');
        const tocList = document.createElement('ul');
        
        headings.forEach((heading, index) => {
            // 为每个标题添加ID
            heading.id = `heading-${index}`;
            
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            
            link.href = `#heading-${index}`;
            link.textContent = heading.textContent;
            link.className = heading.tagName.toLowerCase();
            
            // 平滑滚动
            link.addEventListener('click', (e) => {
                e.preventDefault();
                heading.scrollIntoView({ behavior: 'smooth' });
                // 更新URL但不滚动
                history.pushState(null, null, link.href);
            });
            
            listItem.appendChild(link);
            tocList.appendChild(listItem);
        });
        
        toc.appendChild(tocList);
    }
}

// 代码语法高亮
function initSyntaxHighlighting() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    if (window.hljs) {
        codeBlocks.forEach(block => {
            hljs.highlightBlock(block);
            
            // 添加复制按钮
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-code-btn';
            copyButton.innerHTML = '<i class="fas fa-copy"></i>';
            
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(block.textContent).then(() => {
                    copyButton.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                    }, 2000);
                });
            });
            
            block.parentNode.appendChild(copyButton);
        });
    }
}

// 图片放大功能
function initImageZoom() {
    const images = document.querySelectorAll('.post-content img:not(.no-zoom)');
    
    images.forEach(img => {
        img.addEventListener('click', () => {
            const overlay = document.createElement('div');
            overlay.className = 'image-zoom-overlay';
            
            const imgClone = img.cloneNode();
            overlay.appendChild(imgClone);
            
            overlay.addEventListener('click', () => {
                overlay.classList.add('fade-out');
                setTimeout(() => overlay.remove(), 300);
            });
            
            document.body.appendChild(overlay);
            setTimeout(() => overlay.classList.add('active'), 50);
        });
    });
}

// 分享功能
function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-button');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', () => {
            const platform = button.dataset.platform;
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            const description = encodeURIComponent(document.querySelector('meta[name="description"]')?.content || '');
            
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
                case 'email':
                    shareUrl = `mailto:?subject=${title}&body=${url}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

// 评论系统
function initCommentSystem() {
    const commentForm = document.querySelector('.comment-form');
    const commentsList = document.querySelector('.comments-list');
    
    if (commentForm) {
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const textarea = commentForm.querySelector('textarea');
            const comment = textarea.value.trim();
            
            if (!comment) {
                showNotification('Please enter a comment.', 'error');
                return;
            }
            
            try {
                const response = await submitComment({
                    content: comment,
                    postId: commentForm.dataset.postId
                });
                
                // 添加新评论到列表
                appendComment(response.comment);
                commentForm.reset();
                showNotification('Comment posted successfully!', 'success');
                
            } catch (error) {
                console.error('Comment submission error:', error);
                showNotification('Failed to post comment. Please try again.', 'error');
            }
        });
    }
}

// 阅读进度条
function initProgressBar() {
    const progressBar = document.querySelector('.reading-progress');
    
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const article = document.querySelector('.post-content');
            const articleHeight = article.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrolled = window.scrollY;
            
            const progress = (scrolled / (articleHeight - windowHeight)) * 100;
            progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        });
    }
}

// 相关文章
function initRelatedPosts() {
    const relatedPosts = document.querySelectorAll('.related-post');
    
    relatedPosts.forEach(post => {
        post.addEventListener('mouseenter', () => {
            post.querySelector('.post-preview').style.opacity = '1';
        });
        
        post.addEventListener('mouseleave', () => {
            post.querySelector('.post-preview').style.opacity = '0';
        });
    });
}

// 阅读时间计算
function initReadingTime() {
    const article = document.querySelector('.post-content');
    const readingTimeElement = document.querySelector('.reading-time');
    
    if (article && readingTimeElement) {
        const text = article.textContent;
        const wordCount = text.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200); // 假设阅读速度为每分钟200字
        
        readingTimeElement.textContent = `${readingTime} min read`;
    }
}

// 固定分享栏
function initStickyShare() {
    const shareBar = document.querySelector('.share-bar');
    
    if (shareBar) {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) {
                    shareBar.classList.add('sticky');
                } else {
                    shareBar.classList.remove('sticky');
                }
            },
            { threshold: 1 }
        );
        
        observer.observe(shareBar);
    }
}

// 工具函数
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

// 添加新评论到列表
function appendComment(comment) {
    const commentsList = document.querySelector('.comments-list');
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    commentElement.innerHTML = `
        <div class="comment-header">
            <div class="comment-author">
                <img src="${comment.author.avatar}" alt="${comment.author.name}">
                <div>
                    <h4>${comment.author.name}</h4>
                    <span>${new Date(comment.date).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
        <div class="comment-content">
            <p>${comment.content}</p>
        </div>
    `;
    
    commentsList.insertBefore(commentElement, commentsList.firstChild);
}

// API调用函数
async function submitComment(data) {
    // 这里替换为实际的API调用
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                comment: {
                    author: {
                        name: 'Current User',
                        avatar: '/assets/images/avatar/default.jpg'
                    },
                    content: data.content,
                    date: new Date()
                }
            });
        }, 1000);
    });
}
