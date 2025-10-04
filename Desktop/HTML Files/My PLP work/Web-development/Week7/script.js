/* ========================================
   GLOBAL VARIABLES - Demonstrating Global Scope
   ======================================== */

// Global variable accessible throughout the script
let globalMessage = "This is a GLOBAL variable";
let interactionScore = 0;

// Global counter to demonstrate scope persistence
let functionCallCounter = 0;

/* ========================================
   PART 2: JAVASCRIPT FUNCTIONS
   Demonstrating Scope, Parameters & Return Values
   ======================================== */

/**
 * Function with Parameters and Return Values
 * Takes two numbers and an operation, returns the result
 * @param {number} a - First number
 * @param {number} b - Second number
 * @param {string} operation - Operation to perform (add, subtract, multiply, divide)
 * @returns {number|string} - Result of the calculation or error message
 */
function calculate(a, b, operation) {
    // Local variables - only accessible within this function
    let result;
    
    switch(operation) {
        case 'add':
            result = a + b;
            break;
        case 'subtract':
            result = a - b;
            break;
        case 'multiply':
            result = a * b;
            break;
        case 'divide':
            if (b === 0) {
                return "Error: Cannot divide by zero!";
            }
            result = a / b;
            break;
        default:
            return "Error: Invalid operation";
    }
    
    // Return the calculated result
    return result;
}

/**
 * Performs calculation based on user input
 * Demonstrates how to use functions with parameters and return values
 */
function performCalculation() {
    // Get input values from DOM
    const num1 = parseFloat(document.getElementById('num1').value);
    const num2 = parseFloat(document.getElementById('num2').value);
    const operation = document.getElementById('operation').value;
    
    // Call the calculate function with parameters
    const result = calculate(num1, num2, operation);
    
    // Display the returned result
    const resultDiv = document.getElementById('calcResult');
    resultDiv.innerHTML = `
        <strong>Calculation:</strong> ${num1} ${getOperationSymbol(operation)} ${num2} = <span style="color: #667eea; font-size: 1.3rem;">${result}</span>
    `;
    
    // Increment interaction score (using global variable)
    incrementScore();
}

/**
 * Helper function with parameter and return value
 * Returns the symbol for a given operation
 * @param {string} operation - The operation name
 * @returns {string} - The operation symbol
 */
function getOperationSymbol(operation) {
    const symbols = {
        'add': '+',
        'subtract': '-',
        'multiply': '×',
        'divide': '÷'
    };
    return symbols[operation] || '?';
}

/**
 * Demonstrates Local vs Global Scope
 * Shows how variables behave in different scopes
 */
function demonstrateScope() {
    // Local variable - only exists within this function
    let localMessage = "This is a LOCAL variable (only exists in this function)";
    
    // Increment the global counter
    functionCallCounter++;
    
    // Modify global variable
    globalMessage = `Global variable accessed ${functionCallCounter} time(s)`;
    
    // Display scope information
    const scopeResult = document.getElementById('scopeResult');
    scopeResult.innerHTML = `
        <div style="margin: 10px 0;">
            <strong>Local Variable:</strong><br>
            <code>${localMessage}</code>
        </div>
        <div style="margin: 10px 0;">
            <strong>Global Variable:</strong><br>
            <code>${globalMessage}</code>
        </div>
        <div style="margin: 10px 0; color: #667eea;">
            <strong>Note:</strong> The local variable will disappear after this function ends,
            but the global variable persists!
        </div>
    `;
    
    // Update global variable displays
    document.getElementById('globalVar').textContent = globalMessage;
    document.getElementById('counterValue').textContent = functionCallCounter;
    
    incrementScore();
}

/**
 * Reusable Text Transformation Function
 * Demonstrates function reusability with different parameters
 * @param {string} transformType - Type of transformation to apply
 * @returns {string} - Transformed text or count
 */
function transformText(transformType) {
    const input = document.getElementById('userInput').value;
    
    // Local variable for storing result
    let transformedText;
    
    // Apply transformation based on parameter
    switch(transformType) {
        case 'uppercase':
            transformedText = input.toUpperCase();
            break;
        case 'lowercase':
            transformedText = input.toLowerCase();
            break;
        case 'reverse':
            transformedText = input.split('').reverse().join('');
            break;
        case 'wordcount':
            const wordCount = input.trim().split(/\s+/).filter(word => word.length > 0).length;
            transformedText = `Word count: ${wordCount}`;
            break;
        default:
            transformedText = input;
    }
    
    // Display result
    const resultDiv = document.getElementById('textResult');
    resultDiv.innerHTML = `
        <strong>Original:</strong> ${input}<br>
        <strong>Result:</strong> <span style="color: #667eea;">${transformedText}</span>
    `;
    
    incrementScore();
    
    // Return the transformed text
    return transformedText;
}

/* ========================================
   PART 3: COMBINING CSS ANIMATIONS WITH JAVASCRIPT
   Dynamically Triggering CSS Animations
   ======================================== */

/**
 * Triggers CSS animation by adding/removing classes
 * Demonstrates how JavaScript can control CSS animations
 * @param {string} animationClass - The CSS animation class to apply
 */
function triggerAnimation(animationClass) {
    const animBox = document.getElementById('animBox');
    
    // Remove any existing animation classes
    animBox.className = 'animation-box';
    
    // Force a reflow to restart animation
    void animBox.offsetWidth;
    
    // Add the new animation class
    animBox.classList.add(animationClass);
    
    // Change text based on animation
    const messages = {
        'bounce-in': '🎉 Bouncing!',
        'spin': '🌀 Spinning!',
        'shake': '⚡ Shaking!',
        'flip': '🔄 Flipping!'
    };
    
    animBox.innerHTML = `<p>${messages[animationClass] || 'Animating!'}</p>`;
    
    // Remove animation class after it completes
    setTimeout(() => {
        animBox.classList.remove(animationClass);
        animBox.innerHTML = '<p>Click buttons to animate me!</p>';
    }, 1000);
    
    incrementScore();
}

/**
 * Resets the animation box to its original state
 */
function resetAnimation() {
    const animBox = document.getElementById('animBox');
    animBox.className = 'animation-box';
    animBox.innerHTML = '<p>Click buttons to animate me!</p>';
    incrementScore();
}

/**
 * Toggles the flip state of the card
 * Demonstrates state management with CSS animations
 */
function toggleCardFlip() {
    const flipCard = document.getElementById('flipCard');
    
    // Toggle the 'flipped' class to trigger CSS animation
    flipCard.classList.toggle('flipped');
    
    incrementScore();
}

/**
 * Toggles the loading animation on/off
 * Shows how to control CSS animations with JavaScript state
 */
function toggleLoader() {
    const loaderContainer = document.getElementById('loaderContainer');
    
    // Toggle the 'active' class to show/hide loader
    loaderContainer.classList.toggle('active');
    
    incrementScore();
}

/**
 * Opens the modal with slide-in animation
 * Uses JavaScript to add class that triggers CSS animations
 */
function openModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    
    // Add 'active' class to trigger fade-in and slide-in animations
    modalOverlay.classList.add('active');
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    incrementScore();
}

/**
 * Closes the modal with animation
 * Removes class to trigger fade-out effect
 */
function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    
    // Remove 'active' class to trigger fade-out
    modalOverlay.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
    
    incrementScore();
}

/* ========================================
   BONUS: INTERACTION SCORE SYSTEM
   Demonstrates Global State Management
   ======================================== */

/**
 * Increments the global interaction score
 * Shows how global variables can track state across functions
 */
function incrementScore() {
    // Modify global variable
    interactionScore++;
    
    // Update display
    updateScoreDisplay();
}

/**
 * Updates the score display with animation
 * Reusable function for UI updates
 */
function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('scoreDisplay');
    
    // Update the text
    scoreDisplay.textContent = interactionScore;
    
    // Add a brief animation effect
    scoreDisplay.style.transform = 'scale(1.3)';
    scoreDisplay.style.color = '#fee140';
    
    setTimeout(() => {
        scoreDisplay.style.transform = 'scale(1)';
        scoreDisplay.style.color = '#fee140';
    }, 200);
}

/**
 * Resets the interaction score to zero
 */
function resetScore() {
    // Reset global variable
    interactionScore = 0;
    
    // Update display
    updateScoreDisplay();
    
    // Show confirmation message
    alert('Score has been reset! Keep exploring to increase your score.');
}

/* ========================================
   INITIALIZATION & EVENT LISTENERS
   ======================================== */

/**
 * Initialize the page when DOM is fully loaded
 * Demonstrates good practice of waiting for DOM to be ready
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 Interactive Web Experience Loaded!');
    console.log('Global scope initialized:', globalMessage);
    
    // Initialize score display
    updateScoreDisplay();
    
    // Add keyboard support for modal (ESC to close)
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
    
    console.log('All event listeners attached successfully!');
});

/* ========================================
   ADDITIONAL HELPER FUNCTIONS
   Demonstrating More Function Concepts
   ======================================== */

/**
 * Example of a function that returns a function (closure)
 * Demonstrates advanced scope concepts
 * @param {string} prefix - Prefix to add to messages
 * @returns {function} - A function that adds the prefix
 */
function createMessageFormatter(prefix) {
    // This is a closure - the inner function has access to 'prefix'
    return function(message) {
        return `${prefix}: ${message}`;
    };
}

// Example usage (uncomment to test in console):
// const errorFormatter = createMessageFormatter('ERROR');
// console.log(errorFormatter('Something went wrong')); // "ERROR: Something went wrong"

/**
 * Example of a pure function with no side effects
 * Always returns the same output for the same input
 * @param {number} x - Input number
 * @returns {number} - Square of the input
 */
function square(x) {
    return x * x;
}

/**
 * Example of function with default parameters
 * @param {string} name - User's name
 * @param {string} greeting - Greeting message (default: "Hello")
 * @returns {string} - Formatted greeting
 */
function greet(name, greeting = "Hello") {
    return `${greeting}, ${name}!`;
}

/* ========================================
   SCOPE DEMONSTRATION SUMMARY
   
   This script demonstrates:
   
   1. GLOBAL SCOPE:
      - Variables declared outside functions (globalMessage, interactionScore)
      - Accessible from anywhere in the script
      - Persist throughout the page lifetime
   
   2. LOCAL SCOPE:
      - Variables declared inside functions (localMessage, result, etc.)
      - Only accessible within their function
      - Destroyed when function completes
   
   3. PARAMETERS:
      - Values passed into functions (a, b, operation, etc.)
      - Act like local variables within the function
      - Make functions reusable and flexible
   
   4. RETURN VALUES:
      - Functions send back results using 'return'
      - Allows function output to be used elsewhere
      - Essential for building composable code
   
   5. CSS ANIMATION INTEGRATION:
      - JavaScript adds/removes classes to trigger CSS animations
      - Separation of concerns: CSS handles animation, JS handles logic
      - More performant than JavaScript-based animations
   
   ======================================== */
