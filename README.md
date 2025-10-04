# 🎨 Interactive Web Experience - Week 7 Assignment

A dynamic and interactive web experience combining the power of **CSS3 animations** with **JavaScript functions**. This project demonstrates modern web development techniques including transitions, keyframe animations, function scope, and JavaScript-triggered CSS effects.

## 🚀 Live Demo

Open `index.html` in your browser to see the interactive experience!

## 📋 Project Overview

This assignment showcases three key parts:

### Part 1: CSS3 Transitions and Animations ✨
- **Button Hover Effects**: Glow, bounce, slide, and rotate animations
- **Continuous Keyframe Animations**: Floating, pulsing, rotating, and color-shifting boxes
- **Smooth Transitions**: Interactive cards with hover effects and icon rotations

### Part 2: JavaScript Functions 📚
- **Parameters & Return Values**: Calculator demonstrating function inputs and outputs
- **Scope Demonstration**: Clear examples of local vs global scope
- **Reusable Functions**: Text transformation utilities (uppercase, lowercase, reverse, word count)

### Part 3: CSS + JavaScript Integration 🎬
- **Dynamic Animation Control**: Buttons that trigger CSS animations (bounce, spin, shake, flip)
- **Interactive Card Flip**: 3D card flip effect on click
- **Loading Animation**: Toggle-able loader with smooth transitions
- **Animated Modal Popup**: Slide-in modal with fade effects
- **Bonus Score Tracker**: Interactive score system tracking user engagement

## 🛠️ Technologies Used

- **HTML5**: Semantic structure and accessibility
- **CSS3**: Advanced animations, transitions, and responsive design
- **JavaScript (ES6+)**: Functions, scope management, DOM manipulation, event handling

## 📁 File Structure

```
Week7/
│
├── index.html          # Main HTML structure
├── styles.css          # All CSS styles and animations
├── script.js           # JavaScript functions and logic
└── README.md           # Project documentation
```

## 🎯 Key Features

### CSS Animations Demonstrated:
- `@keyframes` animations (fadeIn, slideIn, bounce, float, pulse, rotate, colorShift)
- CSS transitions (transform, box-shadow, background, color)
- 3D transforms (card flip with perspective)
- Animation timing functions (ease, ease-in-out, cubic-bezier)

### JavaScript Concepts Demonstrated:
- **Global Scope**: Variables accessible throughout the entire script
- **Local Scope**: Variables that exist only within functions
- **Function Parameters**: Passing data into functions
- **Return Values**: Getting results back from functions
- **Event Handlers**: Responding to user interactions
- **DOM Manipulation**: Dynamically updating page content
- **Class Manipulation**: Adding/removing CSS classes for animations

## 🎨 Color Palette

- Primary: `#667eea` (Purple-Blue)
- Secondary: `#764ba2` (Deep Purple)
- Accent 1: `#f093fb` (Pink)
- Accent 2: `#4facfe` (Light Blue)
- Success: `#43e97b` (Green)
- Warning: `#fa709a` (Coral)

## 📱 Responsive Design

The project is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile devices

## 🧪 How to Use

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Iydreess/Week7-Interactive-Experience.git
   ```

2. **Navigate to the project folder**:
   ```bash
   cd Week7-Interactive-Experience
   ```

3. **Open in browser**:
   - Simply open `index.html` in your preferred browser
   - No build process or dependencies required!

## 💡 Learning Outcomes

This project demonstrates:
- ✅ Creating smooth CSS transitions for better UX
- ✅ Building complex keyframe animations
- ✅ Understanding JavaScript function scope
- ✅ Writing reusable functions with parameters and return values
- ✅ Integrating JavaScript with CSS animations
- ✅ Event-driven programming
- ✅ DOM manipulation techniques
- ✅ Responsive web design principles

## 👨‍💻 Code Highlights

### Example: JavaScript-Triggered Animation
```javascript
function triggerAnimation(animationClass) {
    const animBox = document.getElementById('animBox');
    animBox.className = 'animation-box';
    void animBox.offsetWidth; // Force reflow
    animBox.classList.add(animationClass);
}
```

### Example: Function with Parameters & Return Value
```javascript
function calculate(a, b, operation) {
    let result;
    switch(operation) {
        case 'add': result = a + b; break;
        case 'subtract': result = a - b; break;
        // ... more operations
    }
    return result;
}
```

## 📝 Assignment Requirements Met

- ✅ Part 1: CSS3 transitions and keyframe animations
- ✅ Part 2: JavaScript functions with scope, parameters, and return values
- ✅ Part 3: Combined CSS animations with JavaScript triggers
- ✅ Clean, commented code for easy understanding
- ✅ Professional styling and user experience

## 🌟 Bonus Features

- Interactive score tracker
- Keyboard support (ESC to close modal)
- Smooth page load animations
- Multiple animation variations
- Comprehensive code comments

## 📄 License

This project is part of the PLP Web Development curriculum - Week 7 Assignment.

## 👤 Author

**Iddris**
- GitHub: [@Iydreess](https://github.com/Iydreess)

---

Created with ❤️ using CSS3 & JavaScript | October 2025
