// 关于页面功能实现
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initTeamMembers();
    initPartners();
    initTimelineAnimation();
    initImpactCounter();
});

// 滚动动画
function initScrollAnimations() {
    const elements = document.querySelectorAll('.value-card, .team-member, .timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    elements.forEach(element => {
        observer.observe(element);
    });
}

// 团队成员交互
function initTeamMembers() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        // 添加鼠标悬停效果
        member.addEventListener('mouseenter', () => {
            member.querySelector('.member-image').style.transform = 'scale(1.1)';
        });
        
        member.addEventListener('mouseleave', () => {
            member.querySelector('.member-image').style.transform = 'scale(1)';
        });

        // 社交媒体链接处理
        const socialLinks = member.querySelectorAll('.social-links a');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const url = link.getAttribute('href');
                if (url !== '#') {
                    window.open(url, '_blank');
                }
            });
        });
    });
}

// 合作伙伴logo处理
function initPartners() {
    const partners = document.querySelectorAll('.partners-grid img');
    
    partners.forEach(partner => {
        // 图片加载错误处理
        partner.addEventListener('error', () => {
            partner.src = '../assets/images/placeholder-logo.png';
        });

        // 添加加载动画
        partner.addEventListener('load', () => {
            partner.classList.add('loaded');
        });
    });
}

// 时间线动画
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                
                // 添加年份计数动画
                const yearElement = entry.target.querySelector('.year');
                const targetYear = parseInt(yearElement.textContent);
                animateNumber(yearElement, targetYear);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

// 影响力数据计数动画
function initImpactCounter() {
    const stats = document.querySelectorAll('.impact-stat');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numberElement = entry.target.querySelector('.number');
                const targetNumber = parseInt(numberElement.textContent.replace(/\D/g, ''));
                animateNumber(numberElement, targetNumber);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    stats.forEach(stat => {
        observer.observe(stat);
    });
}

// 数字动画辅助函数
function animateNumber(element, target) {
    let current = 0;
    const duration = 2000; // 动画持续时间（毫秒）
    const step = target / (duration / 16); // 60fps
    
    function update() {
        current = Math.min(current + step, target);
        element.textContent = Math.floor(current).toLocaleString();
        
        if (current < target) {
            requestAnimationFrame(update);
        }
    }
    
    update();
}

// 工作机会按钮处理
document.querySelector('.cta-button')?.addEventListener('click', (e) => {
    e.preventDefault();
    
    // 平滑滚动到职位列表
    const careersSection = document.querySelector('#careers-list');
    if (careersSection) {
        careersSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
});

// 视差滚动效果
window.addEventListener('scroll', () => {
    const header = document.querySelector('.about-header');
    const scrolled = window.pageYOffset;
    
    if (header) {
        header.style.backgroundPositionY = `${scrolled * 0.5}px`;
    }
});

// 响应式图片加载
function loadResponsiveImages() {
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

// 初始化响应式图片
loadResponsiveImages();
