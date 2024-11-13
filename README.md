# Not A Bad Day - Website Documentation

## 目录结构
```plaintext
corp-website/
├── index.html
├── assets/
│ ├── images/
│ │ ├── avatar/ # 用户头像
│ │ │ └── avatar1.jpg # 80x80px
│ │ ├── hero/ # 首页大图
│ │ │ ├── hero-bg.jpg # 1920x1080px
│ │ │ ├── hero-large.jpg # 1440x810px
│ │ │ └── hero-medium.jpg # 768x432px
│ │ ├── inspiration/ # 博客和灵感图片
│ │ │ ├── mindfulness.jpg
│ │ │ ├── mindfulness.webp
│ │ │ ├── morning-routine.jpg
│ │ │ └── cozy-space.jpg
│ │ ├── placeholders/ # 占位图片
│ │ │ ├── product-placeholder.jpg
│ │ │ └── avatar-placeholder.jpg
│ │ └── products/ # 产品图片
│ │ ├── product-1.jpg
```

## 图片规格指南

### 1. 产品图片
- 尺寸：800x800px (1:1 比例)
- 格式：JPG/WebP
- 质量：70-80%
- 文件大小：< 200KB
- 命名规则：`product-[number].jpg`

### 2. 用户头像
- 尺寸：80x80px
- 格式：JPG
- 质量：80%
- 文件大小：< 50KB
- 命名规则：`avatar[number].jpg`

### 3. Hero 图片
- 桌面版：1920x1080px
- 平板版：1440x810px
- 移动版：768x432px
- 格式：JPG
- 质量：70-80%
- 文件大小：< 500KB

### 4. 博客/灵感图片
- 尺寸：800x600px (4:3 比例)
- 格式：JPG/WebP
- 质量：80%
- 文件大小：< 300KB

## 如何添加新内容

### 添加新产品
1. 准备产品图片，遵循上述规格
2. 将图片放入 `assets/images/products/` 目录
3. 在 HTML 中添加产品卡片：
```html
<div class="product-card">
<div class="product-image">
<img
src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
data-src="assets/images/products/product-3.jpg"
alt="Product Name"
loading="lazy">
</div>
<div class="product-info">
<h3>Product Name</h3>
<p>Product Description</p>
<span class="price">$XX.XX</span>
<button class="add-to-cart">Add to Cart</button>
</div>
</div>
```

### 添加新用户评价
1. 准备用户头像，遵循上述规格
2. 将头像放入 `assets/images/avatar/` 目录
3. 在 HTML 中添加评价：
```html
<div class="testimonial-item">
<div class="user-avatar">
<img
src="assets/images/avatar/avatar2.jpg"
alt="User Name"
loading="lazy">
</div>
<p class="testimonial-text">User testimonial text here</p>
<h4>User Name</h4>
<span class="location">Location</span>
</div>
```


### 添加新博客文章
1. 准备文章配图，遵循上述规格
2. 将图片放入 `assets/images/inspiration/` 目录
3. 在 HTML 中添加文章卡片：
```html
<article class="inspiration-card">
<div class="card-image">
<img
src="assets/images/inspiration/article-image.jpg"
alt="Article Title"
loading="lazy">
</div>
<div class="card-content">
<div class="card-category">Category</div>
<h3>Article Title</h3>
<p>Article excerpt...</p>
<div class="card-meta">
<span class="read-time">X min read</span>
<a href="/blog/article-url" class="read-more">Read More</a>
</div>
</div>
</article>
```

## 图片优化建议

1. 使用适当的图片格式
   - 照片类图片使用 JPG
   - 支持透明度时使用 PNG
   - 考虑使用 WebP 作为现代替代方案

2. 图片压缩
   - 使用 [TinyPNG](https://tinypng.com/) 压缩图片
   - 使用 [Squoosh](https://squoosh.app/) 进行高级压缩

3. 响应式图片
   - 使用 `srcset` 和 `sizes` 属性
   - 为不同设备提供适当大小的图片

4. 延迟加载
   - 使用 `loading="lazy"` 属性
   - 使用 data-src 进行自定义延迟加载

## 常见问题解决

### 图片无法显示
1. 检查文件路径是否正确
2. 确认文件名大小写是否匹配
3. 验证文件格式是否支持
4. 检查文件权限

### 图片加载过慢
1. 压缩图片文件大小
2. 使用适当的图片格式
3. 实现延迟加载
4. 考虑使用 CDN

### 图片比例失调
1. 检查 CSS 中的 object-fit 属性
2. 验证容器尺寸设置
3. 确保原始图片比例正确

## 维护说明

1. 定期检查和更新图片内容
2. 监控图片加载性能
3. 备份重要图片资源
4. 保持文件命名规范

需要更多帮助或有其他问题，请随时联系技术支持团队。