// 联系页面功能实现
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initFaqAccordion();
    initQuickContactLinks();
    initNewsletterForm();
    initMapInteraction();
    initFormValidation();
});

// 初始化联系表单
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(contactForm);
            const formObject = {};
            formData.forEach((value, key) => formObject[key] = value);

            try {
                // 显示加载状态
                showLoadingState();

                // 模拟API调用
                const response = await submitFormData(formObject);

                // 显示成功消息
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                
                // 重置表单
                contactForm.reset();

            } catch (error) {
                // 显示错误消息
                showNotification('Failed to send message. Please try again.', 'error');
                console.error('Form submission error:', error);
            } finally {
                // 移除加载状态
                hideLoadingState();
            }
        });
    }
}

// 表单验证
function initFormValidation() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
        // 实时验证
        input.addEventListener('blur', function() {
            validateField(input);
        });

        // 输入时移除错误状态
        input.addEventListener('input', function() {
            removeFieldError(input);
        });
    });
}

// 验证单个字段
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch (field.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;

        case 'text':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'This field is required';
            }
            break;

        case 'select-one':
            if (!value) {
                isValid = false;
                errorMessage = 'Please select an option';
            }
            break;

        case 'textarea':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Please enter at least 10 characters';
            }
            break;
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        removeFieldError(field);
    }

    return isValid;
}

// 显示字段错误
function showFieldError(field, message) {
    removeFieldError(field); // 先移除已存在的错误提示

    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    field.classList.add('error');
    field.parentNode.appendChild(errorDiv);
}

// 移除字段错误
function removeFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.classList.remove('error');
}

// FAQ手风琴效果
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        const answer = item.querySelector('p');
        
        // 初始状态：隐藏答案
        answer.style.display = 'none';
        
        question.addEventListener('click', () => {
            // 切换答案的显示状态
            const isExpanded = answer.style.display === 'block';
            
            // 收起所有其他答案
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('p').style.display = 'none';
                    otherItem.classList.remove('active');
                }
            });
            
            // 切换当前答案
            answer.style.display = isExpanded ? 'none' : 'block';
            item.classList.toggle('active', !isExpanded);
        });
    });
}

// 快速联系链接处理
function initQuickContactLinks() {
    const quickLinks = document.querySelectorAll('.option-link');
    
    quickLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 订阅表单处理
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            try {
                // 模拟API调用
                await subscribeToNewsletter(email);
                
                showNotification('Successfully subscribed to newsletter!', 'success');
                newsletterForm.reset();
                
            } catch (error) {
                showNotification('Failed to subscribe. Please try again.', 'error');
                console.error('Newsletter subscription error:', error);
            }
        });
    }
}

// 地图交互
function initMapInteraction() {
    const mapContainer = document.querySelector('.map-container');
    
    if (mapContainer) {
        // 添加鼠标悬停效果
        mapContainer.addEventListener('mouseenter', () => {
            mapContainer.style.transform = 'scale(1.02)';
        });
        
        mapContainer.addEventListener('mouseleave', () => {
            mapContainer.style.transform = 'scale(1)';
        });
    }
}

// 工具函数：显示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 动画效果
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // 自动移除
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 工具函数：显示加载状态
function showLoadingState() {
    const submitButton = document.querySelector('.submit-button');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    }
}

// 工具函数：隐藏加载状态
function hideLoadingState() {
    const submitButton = document.querySelector('.submit-button');
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
    }
}

// API调用函数
async function submitFormData(data) {
    // 这里替换为实际的API调用
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 1500);
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
