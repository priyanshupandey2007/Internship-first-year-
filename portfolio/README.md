# Priyanshu Pandey - AI/ML Portfolio Website 🚀

A modern, responsive portfolio website showcasing AI/ML projects and skills. Built based on professional portfolio standards with enhanced features and modern design.

## 📁 Files Included

1. **priyanshu_index.html** - Main HTML file with portfolio structure
2. **priyanshu_style.css** - Modern CSS styling with animations
3. **priyanshu_script.js** - JavaScript for interactivity and smooth scrolling

## 🚀 Quick Start

### Option 1: Save All Files in One Folder
1. Create a new folder named `portfolio`
2. Download all three files into this folder
3. Open `priyanshu_index.html` in your web browser

### Option 2: Rename Files (Optional)
If you want simpler filenames:
- Rename `priyanshu_index.html` to `index.html`
- Rename `priyanshu_style.css` to `style.css`
- Rename `priyanshu_script.js` to `script.js`

Then update the links in the HTML file:
```html
<link rel="stylesheet" href="style.css">
<!-- Change to -->
<script src="script.js"></script>
<!-- Change to -->
```

## 📋 What's Included

### Sections:
- **Navigation Bar** - Sticky navigation with smooth scrolling
- **Hero Section** - Eye-catching introduction with animated shapes
- **About Me** - Personal introduction and statistics
- **Technical Skills** - 4 categories of skills with icons
- **Featured Projects** - 6 AI/ML projects with descriptions and tech tags
- **Contact Form** - Fully functional contact form with validation
- **Footer** - Social links and copyright info

### Features:
✅ Fully Responsive Design (Mobile, Tablet, Desktop)
✅ Smooth Scrolling & Animations
✅ Modern Gradient Backgrounds
✅ Hover Effects & Transitions
✅ Form Validation
✅ Intersection Observer for Scroll Animations
✅ Active Navigation Highlighting

## 🎨 Design Highlights

- **Color Scheme**: Purple & Blue Gradients (#667eea, #764ba2)
- **Typography**: Clean, modern sans-serif fonts
- **Animations**: Floating shapes, slide-in effects, hover transforms
- **Responsive**: Works perfectly on all screen sizes
- **Performance**: Lightweight, no external dependencies

## 📝 Customization Guide

### 1. Change Your Information

#### In HTML (priyanshu_index.html):
```html
<div class="logo">Priyanshu Pandey</div>
<!-- Change "Priyanshu Pandey" to your name -->

<h1>Hello, I'm Priyanshu Pandey</h1>
<!-- Update your introduction -->

<p>AI/ML Enthusiast | Data Science Passionate | Always Learning</p>
<!-- Update your subtitle -->
```

### 2. Update Projects

Replace project cards with your own:
```html
<div class="card">
    <div class="card-icon">🖼️</div>
    <h3>CNN Image Classification</h3>
    <p>Your project description here...</p>
    <div class="tech-tags">
        <span class="tag">TensorFlow</span>
        <span class="tag">CNN</span>
        <span class="tag">Python</span>
    </div>
</div>
```

### 3. Update Skills

Modify the skills section:
```html
<div class="skill-box">
    <h3>🐍 Programming</h3>
    <ul>
        <li>Python</li>
        <li>SQL</li>
        <li>JavaScript</li>
    </ul>
</div>
```

### 4. Change Color Scheme (CSS)

In `priyanshu_style.css`, find and replace colors:
```css
/* Original */
background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);

/* Change to your colors */
background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 50%, #YOUR_COLOR3 100%);
```

### 5. Update Social Links

In HTML:
```html
<div class="social-links">
    <a href="https://github.com/your-username">GitHub</a>
    <a href="https://linkedin.com/in/your-profile">LinkedIn</a>
    <a href="https://kaggle.com/your-username">Kaggle</a>
    <a href="mailto:your-email@gmail.com">Email</a>
</div>
```

## 🔧 Making Form Functional

The current form shows a success message but doesn't actually send emails. To make it functional, you have three options:

### Option 1: Using Formspree (Recommended - Free)
1. Go to https://formspree.io/
2. Sign up and create a new form
3. Replace the form action:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
    <!-- rest of form -->
</form>
```

### Option 2: Using EmailJS (Free)
1. Go to https://www.emailjs.com/
2. Sign up and get API keys
3. Add EmailJS script to your HTML and configure in JavaScript

### Option 3: Using Backend Service
Set up a simple backend to handle form submissions (Node.js, Python, PHP, etc.)

## 📱 Responsive Breakpoints

- **Desktop**: Full layout (1200px+)
- **Tablet**: Adjusted grid layout (768px - 1199px)
- **Mobile**: Single column layout (<768px)

## 🎯 Best Practices

1. **Update Project Links**: Add actual GitHub, Kaggle, or project links
2. **Add Real Images**: Replace emoji icons with actual project screenshots
3. **Keep Content Fresh**: Update projects as you complete new ones
4. **Test Form**: Verify contact form works with your email service
5. **Optimize Images**: If adding images, compress them for faster loading
6. **SEO**: Update meta tags in HTML for better search engine visibility

## 🌐 Deploying Your Portfolio

### Free Options:
- **GitHub Pages** - Free hosting for GitHub users
- **Vercel** - Simple deployment from GitHub/GitLab
- **Netlify** - Drag & drop deployment
- **Firebase Hosting** - Google's free hosting service

### Paid Options:
- **Bluehost** - Web hosting with domain
- **GoDaddy** - Domain + hosting
- **Namecheap** - Affordable domain + hosting

## 📚 Additional Features You Can Add

- Blog section
- Testimonials
- Dark mode toggle
- PDF resume download
- Integration with GitHub API to show repos
- Progress bars for skills
- Lightbox for project images
- Comments section
- Newsletter signup

## 🐛 Troubleshooting

### Form not working?
- Check browser console for errors (F12)
- Ensure all input fields have proper names
- Verify form action URL is correct

### Styles not loading?
- Confirm CSS filename matches the link in HTML
- Clear browser cache (Ctrl+Shift+Delete)
- Check file path is correct

### Animations not working?
- Update your browser to latest version
- Check CSS file is linked correctly
- Verify JavaScript file is loaded

## 📧 Contact & Support

If you have questions about customization or need help:
- Check the code comments for guidance
- Review the customization section above
- Test changes in a local environment first

## 📄 License

Free to use and modify for personal projects!

---

**Made with ❤️ for Priyanshu Pandey | Last Updated: 2024**

Enjoy your new portfolio! Remember to update it regularly as you learn new technologies and complete new projects. 🚀