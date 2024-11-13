// 购物车功能实现
class ShoppingCart {
    constructor() {
        this.cart = [];
        this.init();
    }

    // 初始化购物车
    init() {
        // 从 localStorage 加载购物车数据
        this.loadCart();
        
        // 绑定添加到购物车按钮
        this.bindAddToCartButtons();
        
        // 更新购物车计数
        this.updateCartCount();

        // 初始化购物车图标点击事件
        this.initCartIcon();
    }

    // 加载购物车数据
    loadCart() {
        const savedCart = localStorage.getItem('shopping-cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }

    // 保存购物车数据
    saveCart() {
        localStorage.setItem('shopping-cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    // 绑定添加到购物车按钮
    bindAddToCartButtons() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    const product = this.getProductDetails(productCard);
                    this.addToCart(product);
                    this.showAddToCartAnimation(button);
                }
            });
        });
    }

    // 获取产品详情
    getProductDetails(productCard) {
        return {
            id: productCard.dataset.productId || Date.now().toString(),
            name: productCard.querySelector('h3').textContent,
            price: parseFloat(productCard.querySelector('.price').textContent.replace('$', '')),
            image: productCard.querySelector('.product-image img').src,
            quantity: 1
        };
    }

    // 添加商品到购物车
    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push(product);
        }
        
        this.saveCart();
        this.showNotification('Product added to cart!');
    }

    // 从购物车移除商品
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.showNotification('Product removed from cart!');
    }

    // 更新购物车数量
    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // 添加动画效果
            cartCount.classList.add('update');
            setTimeout(() => cartCount.classList.remove('update'), 300);
        }
    }

    // 显示购物车通知
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // 动画效果
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }

    // 添加到购物车动画
    showAddToCartAnimation(button) {
        button.classList.add('adding');
        button.textContent = 'Added!';
        
        setTimeout(() => {
            button.classList.remove('adding');
            button.textContent = 'Add to Cart';
        }, 1500);
    }

    // 初始化购物车图标
    initCartIcon() {
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.addEventListener('click', () => this.showCart());
        }
    }

    // 显示购物车面板
    showCart() {
        const cartPanel = this.createCartPanel();
        document.body.appendChild(cartPanel);
        
        setTimeout(() => {
            cartPanel.classList.add('show');
        }, 100);
    }

    // 创建购物车面板
    createCartPanel() {
        const panel = document.createElement('div');
        panel.className = 'cart-panel';
        
        panel.innerHTML = `
            <div class="cart-header">
                <h3>Shopping Cart</h3>
                <button class="close-cart">&times;</button>
            </div>
            <div class="cart-items">
                ${this.cart.length ? this.renderCartItems() : '<p class="empty-cart">Your cart is empty</p>'}
            </div>
            <div class="cart-footer">
                <div class="cart-total">
                    Total: $${this.calculateTotal().toFixed(2)}
                </div>
                <button class="checkout-button" ${!this.cart.length ? 'disabled' : ''}>
                    Proceed to Checkout
                </button>
            </div>
        `;

        // 绑定关闭按钮
        panel.querySelector('.close-cart').addEventListener('click', () => {
            panel.classList.remove('show');
            setTimeout(() => panel.remove(), 300);
        });

        // 绑定结账按钮
        panel.querySelector('.checkout-button').addEventListener('click', () => {
            if (this.cart.length) {
                this.proceedToCheckout();
            }
        });

        return panel;
    }

    // 渲染购物车商品
    renderCartItems() {
        return this.cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <div class="item-price">$${item.price}</div>
                    <div class="item-quantity">
                        <button class="quantity-btn minus">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus">+</button>
                    </div>
                </div>
                <button class="remove-item">&times;</button>
            </div>
        `).join('');
    }

    // 计算总价
    calculateTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // 处理结账
    proceedToCheckout() {
        // 这里添加结账逻辑
        console.log('Proceeding to checkout with items:', this.cart);
        this.showNotification('Redirecting to checkout...');
    }
}

// 初始化购物车
document.addEventListener('DOMContentLoaded', () => {
    window.shoppingCart = new ShoppingCart();
});
