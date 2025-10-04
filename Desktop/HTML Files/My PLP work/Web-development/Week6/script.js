// ============================================
// PART 1: EVENT HANDLING & INTERACTIVE ELEMENTS
// ============================================

/**
 * DARK/LIGHT MODE TOGGLE
 * Listens for click events on the theme toggle button
 * Changes the theme by adding/removing 'dark-mode' class
 * Updates button text and icon accordingly
 */
const themeToggleBtn = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');
const themeText = document.querySelector('.theme-text');

// Load saved theme from localStorage
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light Mode';
    }
});

// Toggle theme on button click
themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Update button icon and text
    if (document.body.classList.contains('dark-mode')) {
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'light');
    }
});

// ============================================
// INTERACTIVE ELEMENT 1: COUNTER GAME
// ============================================

/**
 * COUNTER FUNCTIONALITY
 * Three buttons: Increase, Decrease, Reset
 * Shows different messages based on counter value
 * Demonstrates event handling and DOM manipulation
 */
const counterValue = document.getElementById('counterValue');
const increaseBtn = document.getElementById('increaseBtn');
const decreaseBtn = document.getElementById('decreaseBtn');
const resetBtn = document.getElementById('resetBtn');
const counterMessage = document.getElementById('counterMessage');

let count = 0;

// Function to update counter display and messages
function updateCounter() {
    counterValue.textContent = count;
    
    // Remove previous message classes
    counterMessage.classList.remove('positive', 'negative', 'milestone');
    
    // Display contextual messages based on counter value
    if (count === 0) {
        counterMessage.textContent = 'Back to the start!';
        counterMessage.classList.add('negative');
    } else if (count > 0 && count < 10) {
        counterMessage.textContent = 'Keep going! 🚀';
        counterMessage.classList.add('positive');
    } else if (count === 10) {
        counterMessage.textContent = '🎉 You reached 10! Amazing!';
        counterMessage.classList.add('milestone');
    } else if (count > 10 && count < 50) {
        counterMessage.textContent = 'You\'re on fire! 🔥';
        counterMessage.classList.add('positive');
    } else if (count >= 50 && count < 100) {
        counterMessage.textContent = '🌟 Halfway to 100!';
        counterMessage.classList.add('milestone');
    } else if (count >= 100) {
        counterMessage.textContent = '🏆 CENTURY! You\'re a champion!';
        counterMessage.classList.add('milestone');
    } else if (count < 0 && count > -10) {
        counterMessage.textContent = 'Going negative... 📉';
        counterMessage.classList.add('negative');
    } else if (count <= -10) {
        counterMessage.textContent = '⚠️ Deep in the negatives!';
        counterMessage.classList.add('negative');
    }
}

// Event listener for increase button
increaseBtn.addEventListener('click', () => {
    count++;
    updateCounter();
});

// Event listener for decrease button
decreaseBtn.addEventListener('click', () => {
    count--;
    updateCounter();
});

// Event listener for reset button
resetBtn.addEventListener('click', () => {
    count = 0;
    updateCounter();
});

// Keyboard shortcuts for counter (Arrow Up/Down keys)
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        count++;
        updateCounter();
    } else if (event.key === 'ArrowDown') {
        count--;
        updateCounter();
    } else if (event.key === 'r' || event.key === 'R') {
        count = 0;
        updateCounter();
    }
});

// ============================================
// INTERACTIVE ELEMENT 2: COLLAPSIBLE FAQ
// ============================================

/**
 * FAQ ACCORDION
 * Click on question to toggle answer visibility
 * Only one FAQ item can be open at a time
 * Demonstrates event delegation and classList manipulation
 */
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach((question) => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach((item) => {
            item.classList.remove('active');
        });
        
        // Toggle current item (if it wasn't active before)
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// ============================================
// INTERACTIVE ELEMENT 3: TABBED INTERFACE
// ============================================

/**
 * TABBED CONTENT SWITCHER
 * Click on tabs to switch between different content panels
 * Only one tab content is visible at a time
 * Demonstrates data attributes and content switching
 */
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
        // Get the target tab from data attribute
        const targetTab = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// ============================================
// PART 3: FORM VALIDATION WITH JAVASCRIPT
// ============================================

/**
 * COMPREHENSIVE FORM VALIDATION
 * Validates all form fields using custom JavaScript
 * Uses regular expressions for pattern matching
 * Provides real-time feedback to users
 * Prevents form submission if validation fails
 */

const form = document.getElementById('registrationForm');

// Get all form inputs
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const ageInput = document.getElementById('age');
const termsCheckbox = document.getElementById('terms');

// Regular expressions for validation
const nameRegex = /^[a-zA-Z\s]{2,50}$/;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^(\+?254|0)[17]\d{8}$/; // Kenyan phone format
const passwordRegex = {
    length: /.{8,}/,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /\d/,
    special: /[!@#$%^&*(),.?":{}|<>]/
};

/**
 * VALIDATION HELPER FUNCTIONS
 */

// Function to show error message
function showError(input, message) {
    const errorElement = document.getElementById(`${input.id}Error`);
    const successElement = document.getElementById(`${input.id}Success`);
    
    errorElement.textContent = message;
    if (successElement) successElement.textContent = '';
    input.classList.add('invalid');
    input.classList.remove('valid');
}

// Function to show success message
function showSuccess(input, message = '✓ Looks good!') {
    const errorElement = document.getElementById(`${input.id}Error`);
    const successElement = document.getElementById(`${input.id}Success`);
    
    errorElement.textContent = '';
    if (successElement) successElement.textContent = message;
    input.classList.add('valid');
    input.classList.remove('invalid');
}

// Function to clear validation styling
function clearValidation(input) {
    const errorElement = document.getElementById(`${input.id}Error`);
    const successElement = document.getElementById(`${input.id}Success`);
    
    if (errorElement) errorElement.textContent = '';
    if (successElement) successElement.textContent = '';
    input.classList.remove('valid', 'invalid');
}

/**
 * INDIVIDUAL FIELD VALIDATORS
 */

// Validate Full Name
function validateFullName() {
    const value = fullNameInput.value.trim();
    
    if (value === '') {
        showError(fullNameInput, 'Full name is required');
        return false;
    } else if (!nameRegex.test(value)) {
        showError(fullNameInput, 'Please enter a valid name (letters and spaces only, 2-50 characters)');
        return false;
    } else {
        showSuccess(fullNameInput);
        return true;
    }
}

// Validate Email
function validateEmail() {
    const value = emailInput.value.trim();
    
    if (value === '') {
        showError(emailInput, 'Email address is required');
        return false;
    } else if (!emailRegex.test(value)) {
        showError(emailInput, 'Please enter a valid email address');
        return false;
    } else {
        showSuccess(emailInput);
        return true;
    }
}

// Validate Phone Number
function validatePhone() {
    const value = phoneInput.value.trim();
    
    if (value === '') {
        showError(phoneInput, 'Phone number is required');
        return false;
    } else if (!phoneRegex.test(value)) {
        showError(phoneInput, 'Please enter a valid Kenyan phone number (e.g., 0712345678 or +254712345678)');
        return false;
    } else {
        showSuccess(phoneInput);
        return true;
    }
}

// Validate Password with requirements checklist
function validatePassword() {
    const value = passwordInput.value;
    const requirements = {
        length: document.getElementById('length'),
        uppercase: document.getElementById('uppercase'),
        lowercase: document.getElementById('lowercase'),
        number: document.getElementById('number'),
        special: document.getElementById('special')
    };
    
    let isValid = true;
    
    // Check each requirement
    if (passwordRegex.length.test(value)) {
        requirements.length.classList.add('valid');
    } else {
        requirements.length.classList.remove('valid');
        isValid = false;
    }
    
    if (passwordRegex.uppercase.test(value)) {
        requirements.uppercase.classList.add('valid');
    } else {
        requirements.uppercase.classList.remove('valid');
        isValid = false;
    }
    
    if (passwordRegex.lowercase.test(value)) {
        requirements.lowercase.classList.add('valid');
    } else {
        requirements.lowercase.classList.remove('valid');
        isValid = false;
    }
    
    if (passwordRegex.number.test(value)) {
        requirements.number.classList.add('valid');
    } else {
        requirements.number.classList.remove('valid');
        isValid = false;
    }
    
    if (passwordRegex.special.test(value)) {
        requirements.special.classList.add('valid');
    } else {
        requirements.special.classList.remove('valid');
        isValid = false;
    }
    
    if (value === '') {
        showError(passwordInput, 'Password is required');
        return false;
    } else if (!isValid) {
        showError(passwordInput, 'Password does not meet all requirements');
        return false;
    } else {
        showSuccess(passwordInput, '✓ Strong password!');
        return true;
    }
}

// Validate Confirm Password
function validateConfirmPassword() {
    const value = confirmPasswordInput.value;
    const passwordValue = passwordInput.value;
    
    if (value === '') {
        showError(confirmPasswordInput, 'Please confirm your password');
        return false;
    } else if (value !== passwordValue) {
        showError(confirmPasswordInput, 'Passwords do not match');
        return false;
    } else {
        showSuccess(confirmPasswordInput, '✓ Passwords match!');
        return true;
    }
}

// Validate Age
function validateAge() {
    const value = ageInput.value;
    
    if (value === '') {
        showError(ageInput, 'Age is required');
        return false;
    } else if (value < 18) {
        showError(ageInput, 'You must be at least 18 years old');
        return false;
    } else if (value > 120) {
        showError(ageInput, 'Please enter a valid age');
        return false;
    } else {
        showSuccess(ageInput);
        return true;
    }
}

// Validate Terms Checkbox
function validateTerms() {
    const termsError = document.getElementById('termsError');
    
    if (!termsCheckbox.checked) {
        termsError.textContent = 'You must agree to the terms and conditions';
        return false;
    } else {
        termsError.textContent = '';
        return true;
    }
}

/**
 * REAL-TIME VALIDATION EVENT LISTENERS
 * Validate fields as user types (on 'input' event)
 */

fullNameInput.addEventListener('input', validateFullName);
fullNameInput.addEventListener('blur', validateFullName);

emailInput.addEventListener('input', validateEmail);
emailInput.addEventListener('blur', validateEmail);

phoneInput.addEventListener('input', validatePhone);
phoneInput.addEventListener('blur', validatePhone);

passwordInput.addEventListener('input', validatePassword);
passwordInput.addEventListener('blur', validatePassword);

confirmPasswordInput.addEventListener('input', validateConfirmPassword);
confirmPasswordInput.addEventListener('blur', validateConfirmPassword);

ageInput.addEventListener('input', validateAge);
ageInput.addEventListener('blur', validateAge);

termsCheckbox.addEventListener('change', validateTerms);

/**
 * FORM SUBMISSION HANDLER
 * Validates all fields before submission
 * Prevents submission if any validation fails
 * Shows success message on successful validation
 */
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission
    
    // Validate all fields
    const isFullNameValid = validateFullName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    const isAgeValid = validateAge();
    const areTermsValid = validateTerms();
    
    // Check if all validations passed
    const isFormValid = isFullNameValid && isEmailValid && isPhoneValid && 
                       isPasswordValid && isConfirmPasswordValid && 
                       isAgeValid && areTermsValid;
    
    if (isFormValid) {
        // Show success message
        const successContainer = document.getElementById('formSuccessMessage');
        successContainer.innerHTML = `
            <h3>🎉 Registration Successful!</h3>
            <p>Thank you, ${fullNameInput.value}! Your account has been created.</p>
            <p>A confirmation email has been sent to ${emailInput.value}</p>
        `;
        successContainer.classList.add('show');
        
        // Log form data to console (in real app, this would be sent to server)
        console.log('Form Data Submitted:', {
            fullName: fullNameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            age: ageInput.value,
            termsAccepted: termsCheckbox.checked
        });
        
        // Reset form after 3 seconds
        setTimeout(() => {
            form.reset();
            successContainer.classList.remove('show');
            // Clear all validation styling
            [fullNameInput, emailInput, phoneInput, passwordInput, 
             confirmPasswordInput, ageInput].forEach(input => {
                clearValidation(input);
            });
            // Reset password requirements
            document.querySelectorAll('.password-requirements li').forEach(li => {
                li.classList.remove('valid');
            });
        }, 5000);
        
    } else {
        // Scroll to first error
        const firstError = document.querySelector('.invalid');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }
});

/**
 * ADDITIONAL INTERACTIVITY: Form Reset Button
 * Clear all validation when form is reset
 */
form.addEventListener('reset', () => {
    setTimeout(() => {
        [fullNameInput, emailInput, phoneInput, passwordInput, 
         confirmPasswordInput, ageInput].forEach(input => {
            clearValidation(input);
        });
        document.getElementById('termsError').textContent = '';
        document.querySelectorAll('.password-requirements li').forEach(li => {
            li.classList.remove('valid');
        });
    }, 0);
});

// ============================================
// ADDITIONAL EVENT HANDLING DEMONSTRATIONS
// ============================================

/**
 * MOUSEOVER EFFECTS ON BUTTONS
 * Add ripple effect on button hover
 */
const allButtons = document.querySelectorAll('.btn');

allButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

/**
 * DOUBLE CLICK EVENT ON COUNTER
 * Double-click counter display to set custom value
 */
counterValue.addEventListener('dblclick', () => {
    const newValue = prompt('Enter a new counter value:', count);
    if (newValue !== null && !isNaN(newValue)) {
        count = parseInt(newValue);
        updateCounter();
    }
});

/**
 * CONSOLE WELCOME MESSAGE
 * Log a welcome message when page loads
 */
console.log('%c🚀 Welcome to Interactive Web Application!', 'color: #3b82f6; font-size: 20px; font-weight: bold;');
console.log('%cThis page demonstrates various JavaScript concepts:', 'color: #10b981; font-size: 14px;');
console.log('✓ Event Handling (click, input, submit, keydown, mouseover)');
console.log('✓ DOM Manipulation (classList, textContent, attributes)');
console.log('✓ Form Validation (regex, custom validation functions)');
console.log('✓ Interactive Components (tabs, accordion, counter, theme toggle)');
console.log('%cTry the keyboard shortcuts: ↑ ↓ to change counter, R to reset!', 'color: #f59e0b; font-style: italic;');
