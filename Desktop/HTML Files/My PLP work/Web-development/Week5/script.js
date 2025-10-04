// ========================================
// PART 1: JAVASCRIPT BASICS
// Variables, Data Types, Operators, and Conditionals
// ========================================

/*
 * This section demonstrates:
 * - Variable declarations (let, const)
 * - Data types (string, number, boolean)
 * - Operators (arithmetic, comparison, logical)
 * - Conditionals (if/else statements)
 */

// Age Checker & Greeting Generator
document.getElementById('checkUserBtn').addEventListener('click', function() {
    // Get user input - demonstrating string and number data types
    const userName = document.getElementById('userName').value;
    const userAge = parseInt(document.getElementById('userAge').value);
    const resultDiv = document.getElementById('userResult');
    
    // Variable declarations for processing
    let greeting = '';
    let ageCategory = '';
    let canVote = false;
    
    // Conditional logic - if/else statements
    if (!userName || isNaN(userAge)) {
        resultDiv.innerHTML = '⚠️ Please enter both name and age!';
        resultDiv.style.color = 'red';
        return;
    }
    
    // Age-based conditionals
    if (userAge < 0) {
        resultDiv.innerHTML = '❌ Age cannot be negative!';
        resultDiv.style.color = 'red';
    } else if (userAge < 13) {
        ageCategory = 'child';
        greeting = `Hello ${userName}! You're just a kid. Enjoy your childhood! 🎈`;
        canVote = false;
    } else if (userAge < 18) {
        ageCategory = 'teenager';
        greeting = `Hey ${userName}! You're a teenager. The world is yours to explore! 🌟`;
        canVote = false;
    } else if (userAge < 65) {
        ageCategory = 'adult';
        greeting = `Welcome ${userName}! You're an adult. Time to conquer your dreams! 💪`;
        canVote = true;
    } else {
        ageCategory = 'senior';
        greeting = `Greetings ${userName}! You're a senior. Wisdom comes with age! 🎓`;
        canVote = true;
    }
    
    // Using logical operators
    const votingStatus = canVote ? 'You can vote! 🗳️' : 'You cannot vote yet.';
    
    // Output to console (demonstrating console.log)
    console.log(`User: ${userName}, Age: ${userAge}, Category: ${ageCategory}`);
    
    // Display results on webpage
    resultDiv.innerHTML = `${greeting}<br><strong>${votingStatus}</strong>`;
    resultDiv.style.color = '#333';
});

// Simple Calculator - Demonstrating arithmetic operators
document.getElementById('calculateBtn').addEventListener('click', function() {
    // Get numeric inputs
    const num1 = parseFloat(document.getElementById('num1').value);
    const num2 = parseFloat(document.getElementById('num2').value);
    const operator = document.getElementById('operator').value;
    const resultDiv = document.getElementById('calcResult');
    
    // Variable to store result
    let result = 0;
    let operationText = '';
    
    // Input validation using conditionals
    if (isNaN(num1) || isNaN(num2)) {
        resultDiv.innerHTML = '⚠️ Please enter valid numbers!';
        resultDiv.style.color = 'red';
        return;
    }
    
    // Switch-like conditional for operations
    if (operator === '+') {
        result = num1 + num2;
        operationText = 'Addition';
    } else if (operator === '-') {
        result = num1 - num2;
        operationText = 'Subtraction';
    } else if (operator === '*') {
        result = num1 * num2;
        operationText = 'Multiplication';
    } else if (operator === '/') {
        // Division with error handling
        if (num2 === 0) {
            resultDiv.innerHTML = '❌ Cannot divide by zero!';
            resultDiv.style.color = 'red';
            return;
        }
        result = num1 / num2;
        operationText = 'Division';
    }
    
    // Display result with formatting
    resultDiv.innerHTML = `<strong>${operationText}:</strong> ${num1} ${operator} ${num2} = <strong>${result.toFixed(2)}</strong>`;
    resultDiv.style.color = '#667eea';
    
    // Console output
    console.log(`Calculation: ${num1} ${operator} ${num2} = ${result}`);
});


// ========================================
// PART 2: JAVASCRIPT FUNCTIONS
// Reusable code blocks for DRY programming
// ========================================

/*
 * This section demonstrates:
 * - Function declarations
 * - Parameters and return values
 * - Function reusability
 * - Arrow functions
 */

// FUNCTION 1: String Formatter - Multiple formatting options
function formatString(text, formatType) {
    // Input validation
    if (!text || typeof text !== 'string') {
        return 'Invalid input!';
    }
    
    // Different formatting based on type
    switch(formatType) {
        case 'uppercase':
            return text.toUpperCase();
        case 'lowercase':
            return text.toLowerCase();
        case 'titlecase':
            // Convert to title case (first letter of each word capitalized)
            return text.toLowerCase().split(' ').map(word => {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }).join(' ');
        default:
            return text;
    }
}

// Event listeners for string formatter
document.getElementById('uppercaseBtn').addEventListener('click', function() {
    const text = document.getElementById('textInput').value;
    const result = formatString(text, 'uppercase');
    document.getElementById('formattedText').innerHTML = `<strong>UPPERCASE:</strong> ${result}`;
});

document.getElementById('lowercaseBtn').addEventListener('click', function() {
    const text = document.getElementById('textInput').value;
    const result = formatString(text, 'lowercase');
    document.getElementById('formattedText').innerHTML = `<strong>lowercase:</strong> ${result}`;
});

document.getElementById('titleCaseBtn').addEventListener('click', function() {
    const text = document.getElementById('textInput').value;
    const result = formatString(text, 'titlecase');
    document.getElementById('formattedText').innerHTML = `<strong>Title Case:</strong> ${result}`;
});

// FUNCTION 2: Shopping Cart Calculator - Demonstrates array manipulation and calculations
const shoppingCart = []; // Array to store cart items

// Function to add item to cart
function addToCart(price, quantity) {
    // Validation
    if (isNaN(price) || isNaN(quantity) || price <= 0 || quantity <= 0) {
        return { success: false, message: 'Invalid price or quantity!' };
    }
    
    // Create item object
    const item = {
        price: parseFloat(price),
        quantity: parseInt(quantity),
        subtotal: parseFloat(price) * parseInt(quantity)
    };
    
    // Add to cart array
    shoppingCart.push(item);
    
    return { success: true, item: item };
}

// Function to calculate cart total
function calculateCartTotal() {
    let total = 0;
    
    // Iterate through cart and sum up subtotals
    for (let i = 0; i < shoppingCart.length; i++) {
        total += shoppingCart[i].subtotal;
    }
    
    return total;
}

// Function to display cart contents
function displayCart() {
    if (shoppingCart.length === 0) {
        return '<em>Cart is empty</em>';
    }
    
    let html = '<ul style="list-style-type: none; padding: 0;">';
    
    for (let i = 0; i < shoppingCart.length; i++) {
        const item = shoppingCart[i];
        html += `<li style="padding: 5px; border-bottom: 1px solid #eee;">
                    Item ${i + 1}: $${item.price.toFixed(2)} × ${item.quantity} = $${item.subtotal.toFixed(2)}
                 </li>`;
    }
    
    html += '</ul>';
    return html;
}

// Event listener for adding items
document.getElementById('addItemBtn').addEventListener('click', function() {
    const price = document.getElementById('itemPrice').value;
    const quantity = document.getElementById('itemQuantity').value;
    
    const result = addToCart(price, quantity);
    
    if (result.success) {
        document.getElementById('cartItems').innerHTML = displayCart();
        document.getElementById('cartTotal').innerHTML = `💰 Total: $${calculateCartTotal().toFixed(2)}`;
        
        // Clear inputs
        document.getElementById('itemPrice').value = '';
        document.getElementById('itemQuantity').value = '1';
    } else {
        alert(result.message);
    }
});

// Event listener for clearing cart
document.getElementById('clearCartBtn').addEventListener('click', function() {
    shoppingCart.length = 0; // Clear array
    document.getElementById('cartItems').innerHTML = '';
    document.getElementById('cartTotal').innerHTML = '';
});


// ========================================
// PART 3: JAVASCRIPT LOOPS
// Mastering repetition and iteration
// ========================================

/*
 * This section demonstrates:
 * - for loops
 * - while loops
 * - forEach loops
 * - Array iteration
 */

// LOOP EXAMPLE 1: Multiplication Table Generator using FOR loop
document.getElementById('generateTableBtn').addEventListener('click', function() {
    const number = parseInt(document.getElementById('tableNumber').value);
    const resultDiv = document.getElementById('multiplicationTable');
    
    // Validation
    if (isNaN(number) || number < 1 || number > 20) {
        resultDiv.innerHTML = '⚠️ Please enter a number between 1 and 20!';
        return;
    }
    
    let tableHTML = `<h4>Multiplication Table for ${number}</h4>`;
    tableHTML += '<table style="width: 100%; border-collapse: collapse;">';
    
    // FOR LOOP - Generate multiplication table
    for (let i = 1; i <= 12; i++) {
        const result = number * i;
        tableHTML += `<tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding: 8px;">${number} × ${i}</td>
                        <td style="padding: 8px; text-align: right;"><strong>${result}</strong></td>
                      </tr>`;
    }
    
    tableHTML += '</table>';
    resultDiv.innerHTML = tableHTML;
    
    // Console log using loop
    console.log(`Multiplication table for ${number}:`);
    for (let i = 1; i <= 12; i++) {
        console.log(`${number} × ${i} = ${number * i}`);
    }
});

// LOOP EXAMPLE 2: Array Iterator & List Builder using FOREACH and WHILE
const myArray = []; // Array to store items

// Add item to array
document.getElementById('addArrayItemBtn').addEventListener('click', function() {
    const item = document.getElementById('arrayItem').value;
    
    if (!item.trim()) {
        alert('Please enter an item!');
        return;
    }
    
    myArray.push(item);
    document.getElementById('arrayItem').value = '';
    document.getElementById('arrayDisplay').innerHTML = `<strong>Array has ${myArray.length} item(s)</strong>`;
});

// Display list using FOREACH loop
document.getElementById('displayListBtn').addEventListener('click', function() {
    const resultDiv = document.getElementById('iteratedList');
    
    if (myArray.length === 0) {
        resultDiv.innerHTML = '<em>Array is empty. Add some items first!</em>';
        return;
    }
    
    let html = '<h4>List Items (using forEach loop):</h4>';
    html += '<ol>';
    
    // FOREACH LOOP - Iterate through array
    myArray.forEach(function(item, index) {
        html += `<li>${item}</li>`;
        console.log(`Item ${index + 1}: ${item}`);
    });
    
    html += '</ol>';
    
    // Bonus: WHILE LOOP demonstration
    html += '<h4>Reversed List (using while loop):</h4>';
    html += '<ol>';
    
    let i = myArray.length - 1;
    // WHILE LOOP - Iterate backwards
    while (i >= 0) {
        html += `<li>${myArray[i]}</li>`;
        i--;
    }
    
    html += '</ol>';
    resultDiv.innerHTML = html;
});

// Clear array
document.getElementById('clearListBtn').addEventListener('click', function() {
    myArray.length = 0;
    document.getElementById('arrayDisplay').innerHTML = '';
    document.getElementById('iteratedList').innerHTML = '';
});


// ========================================
// PART 4: DOM MANIPULATION
// Making pages interactive with JavaScript
// ========================================

/*
 * This section demonstrates:
 * - Element selection (getElementById, querySelector)
 * - Event listeners (click events)
 * - Dynamic content updates
 * - Class manipulation
 * - Creating and removing elements
 * - Changing styles dynamically
 */

// DOM INTERACTION 1: Toggle Content Visibility
let isMessageVisible = false;

document.getElementById('toggleContentBtn').addEventListener('click', function() {
    const secretMessage = document.getElementById('secretMessage');
    
    // Toggle visibility by manipulating classes
    if (isMessageVisible) {
        secretMessage.classList.add('hidden');
        this.textContent = 'Toggle Secret Message';
        isMessageVisible = false;
    } else {
        secretMessage.classList.remove('hidden');
        this.textContent = 'Hide Secret Message';
        isMessageVisible = true;
    }
    
    console.log(`Secret message visible: ${isMessageVisible}`);
});

// DOM INTERACTION 2: Change Theme Color Dynamically
const themes = ['theme-blue', 'theme-green', 'theme-orange', 'theme-pink'];
let currentThemeIndex = 0;

document.getElementById('changeColorBtn').addEventListener('click', function() {
    const header = document.querySelector('header');
    
    // Remove current theme
    header.classList.remove(themes[currentThemeIndex]);
    
    // Move to next theme
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    
    // Add new theme
    header.classList.add(themes[currentThemeIndex]);
    
    console.log(`Theme changed to: ${themes[currentThemeIndex]}`);
});

// DOM INTERACTION 3: Create and Remove Elements Dynamically
let elementCounter = 0;

document.getElementById('createElementBtn').addEventListener('click', function() {
    const text = document.getElementById('newElementText').value;
    
    if (!text.trim()) {
        alert('Please enter some text!');
        return;
    }
    
    // Create new element
    const newElement = document.createElement('div');
    newElement.className = 'dynamic-element';
    newElement.textContent = `${++elementCounter}. ${text}`;
    
    // Add to container
    const container = document.getElementById('dynamicContainer');
    container.appendChild(newElement);
    
    // Clear input
    document.getElementById('newElementText').value = '';
    
    console.log(`Created element ${elementCounter}: ${text}`);
});

// Remove last created element
document.getElementById('removeLastBtn').addEventListener('click', function() {
    const container = document.getElementById('dynamicContainer');
    
    if (container.lastChild) {
        container.removeChild(container.lastChild);
        elementCounter--;
        console.log('Removed last element');
    } else {
        alert('No elements to remove!');
    }
});

// DOM INTERACTION 4: Click Counter (Event Handling)
let clickCount = 0;

document.getElementById('clickMeBtn').addEventListener('click', function() {
    clickCount++;
    
    // Update display
    const countDisplay = document.getElementById('clickCount');
    countDisplay.textContent = `Clicks: ${clickCount}`;
    
    // Change button style based on clicks
    if (clickCount % 5 === 0) {
        this.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    } else if (clickCount % 3 === 0) {
        this.style.background = 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
    } else {
        this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    
    // Log to console
    console.log(`Button clicked ${clickCount} times`);
    
    // Special message at milestones
    if (clickCount === 10) {
        alert('🎉 Congratulations! You reached 10 clicks!');
    } else if (clickCount === 25) {
        alert('🌟 Amazing! 25 clicks!');
    } else if (clickCount === 50) {
        alert('🏆 Incredible! 50 clicks! You are a clicking champion!');
    }
});


// ========================================
// INITIALIZATION & WELCOME MESSAGE
// ========================================

// Log welcome message when page loads
console.log('🚀 JavaScript Fundamentals Project Loaded Successfully!');
console.log('This project demonstrates:');
console.log('✅ Part 1: Variables, Data Types, Operators, and Conditionals');
console.log('✅ Part 2: Custom Reusable Functions');
console.log('✅ Part 3: Loops (for, while, forEach)');
console.log('✅ Part 4: DOM Manipulation and Event Handling');
console.log('Happy coding! 💻');
