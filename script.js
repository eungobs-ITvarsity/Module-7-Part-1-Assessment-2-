/* ========================================
   GRAB ALL THE ELEMENTS WE NEED FROM HTML
   ======================================== */

/* The display that shows the previous number and operator */
const previousOperand = document.getElementById('previousOperand');
/* The display that shows the current number */
const currentOperand = document.getElementById('currentOperand');
/* The AC (All Clear) button */
const clearBtn = document.getElementById('clear');
/* The DEL (Delete) button */
const deleteBtn = document.getElementById('delete');
/* The equals button */
const equalsBtn = document.getElementById('equals');
/* The +/- (negate) button */
const negateBtn = document.getElementById('negate');
/* All the number buttons (0-9 and decimal) */
const numberBtns = document.querySelectorAll('[data-number]');
/* All the operator buttons (+, -, ×, ÷, %) */
const operatorBtns = document.querySelectorAll('[data-operator]');


/* ========================================
   SET UP THE CALCULATOR STATE
   ======================================== */

/* This stores the current number being typed */
let currentValue = '0';
/* This stores the previous number before an operator was pressed */
let previousValue = '';
/* This stores which operator was selected (+, -, *, /) */
let operator = null;
/* This tracks if we just got a result (after pressing =) */
let justCalculated = false;


/* ========================================
   FUNCTION: UPDATE THE DISPLAY SCREEN
   ======================================== */
function updateDisplay() {
    /* Show the current number on the screen */
    currentOperand.textContent = currentValue;
    
    /* If the number is really long, shrink the font size */
    if (currentValue.length > 10) {
        currentOperand.classList.add('shrink');
    } else {
        currentOperand.classList.remove('shrink');
    }

    /* Show the previous number and operator above */
    if (operator !== null) {
        /* Pick the right symbol to display */
        let displayOperator = operator;
        if (operator === '*') displayOperator = '×';
        if (operator === '/') displayOperator = '÷';
        if (operator === '-') displayOperator = '−';
        
        /* Show something like "5 +" on the top line */
        previousOperand.textContent = `${previousValue} ${displayOperator}`;
    } else {
        /* If there's no operator, clear the top line */
        previousOperand.textContent = '';
    }
}


/* ========================================
   FUNCTION: HANDLE NUMBER BUTTON CLICKS
   ======================================== */
function inputNumber(number) {
    /* If we just got a result, start a new number */
    if (justCalculated) {
        currentValue = '';
        justCalculated = false;
    }

    /* Don't allow more than one decimal point */
    if (number === '.' && currentValue.includes('.')) return;

    /* Don't let the number get too long */
    if (currentValue.length >= 15) return;

    /* If the screen shows 0, replace it (unless it's a decimal) */
    if (currentValue === '0' && number !== '.') {
        currentValue = number;
    } else {
        /* Otherwise, add the number to the end */
        currentValue += number;
    }

    /* Update the screen */
    updateDisplay();
}


/* ========================================
   FUNCTION: HANDLE OPERATOR BUTTON CLICKS
   ======================================== */
function inputOperator(op) {
    /* Reset the "just calculated" flag */
    justCalculated = false;

    /* If there's already a previous value and operator, calculate first */
    if (operator !== null && previousValue !== '') {
        calculate();
    }

    /* Save the current number as the previous number */
    previousValue = currentValue;
    /* Save which operator was pressed */
    operator = op;
    /* Reset the current number so user can type a new one */
    currentValue = '0';

    /* Highlight the active operator button */
    highlightOperator(op);
    /* Update the screen */
    updateDisplay();
}


/* ========================================
   FUNCTION: DO THE ACTUAL MATH
   ======================================== */
function calculate() {
    /* Turn the strings into real numbers */
    let prev = parseFloat(previousValue);
    let curr = parseFloat(currentValue);
    let result;

    /* If either number is not a valid number, stop here */
    if (isNaN(prev) || isNaN(curr)) return;

    /* Do the math based on which operator was selected */
    switch (operator) {
        case '+':
            result = prev + curr;
            break;
        case '-':
            result = prev - curr;
            break;
        case '*':
            result = prev * curr;
            break;
        case '/':
            /* Check if we're dividing by zero */
            if (curr === 0) {
                currentValue = 'Error';
                previousValue = '';
                operator = null;
                updateDisplay();
                return;
            }
            result = prev / curr;
            break;
        case '%':
            result = prev % curr;
            break;
        default:
            /* If we don't know the operator, do nothing */
            return;
    }

    /* Round the result to avoid weird decimal numbers */
    /* For example, 0.1 + 0.2 should be 0.3, not 0.30000000000000004 */
    result = Math.round(result * 1000000000000) / 1000000000000;

    /* Convert the result to a string and save it */
    currentValue = result.toString();
    /* Clear the previous value and operator */
    previousValue = '';
    operator = null;

    /* Remove the highlight from operator buttons */
    clearOperatorHighlight();
    /* Update the screen */
    updateDisplay();
    /* Mark that we just did a calculation */
    justCalculated = true;
}


/* ========================================
   FUNCTION: CLEAR EVERYTHING (AC BUTTON)
   ======================================== */
function clearAll() {
    /* Reset everything back to the beginning */
    currentValue = '0';
    previousValue = '';
    operator = null;
    justCalculated = false;

    /* Remove operator highlights */
    clearOperatorHighlight();
    /* Update the screen */
    updateDisplay();
}


/* ========================================
   FUNCTION: DELETE LAST DIGIT (DEL BUTTON)
   ======================================== */
function deleteLast() {
    /* If there's an error on screen, clear it */
    if (currentValue === 'Error') {
        clearAll();
        return;
    }

    /* If we just got a result, don't let them delete from it */
    if (justCalculated) return;

    /* Remove the last character from the number */
    currentValue = currentValue.slice(0, -1);

    /* If there's nothing left, show 0 */
    if (currentValue === '' || currentValue === '-') {
        currentValue = '0';
    }

    /* Update the screen */
    updateDisplay();
}


/* ========================================
   FUNCTION: MAKE NUMBER POSITIVE/NEGATIVE
   ======================================== */
function negate() {
    /* Can't negate zero or an error */
    if (currentValue === '0' || currentValue === 'Error') return;

    /* If the number is negative, make it positive */
    if (currentValue.startsWith('-')) {
        currentValue = currentValue.slice(1);
    } 
    /* If the number is positive, make it negative */
    else {
        currentValue = '-' + currentValue;
    }

    /* Update the screen */
    updateDisplay();
}


/* ========================================
   FUNCTION: HIGHLIGHT THE ACTIVE OPERATOR
   ======================================== */
function highlightOperator(op) {
    /* First remove all highlights */
    clearOperatorHighlight();
    
    /* Find the button that matches the operator and highlight it */
    operatorBtns.forEach(btn => {
        if (btn.dataset.operator === op) {
            btn.classList.add('active');
        }
    });
}


/* ========================================
   FUNCTION: REMOVE ALL OPERATOR HIGHLIGHTS
   ======================================== */
function clearOperatorHighlight() {
    /* Go through every operator button and remove the highlight */
    operatorBtns.forEach(btn => {
        btn.classList.remove('active');
    });
}


/* ========================================
   ADD CLICK EVENTS TO ALL BUTTONS
   ======================================== */

/* When a number button is clicked, input that number */
numberBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        inputNumber(btn.dataset.number);
    });
});

/* When an operator button is clicked, set the operator */
operatorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        inputOperator(btn.dataset.operator);
    });
});

/* When the equals button is clicked, do the math */
equalsBtn.addEventListener('click', calculate);

/* When the AC button is clicked, clear everything */
clearBtn.addEventListener('click', clearAll);

/* When the DEL button is clicked, delete the last digit */
deleteBtn.addEventListener('click', deleteLast);

/* When the +/- button is clicked, negate the number */
negateBtn.addEventListener('click', negate);


/* ========================================
   ADD KEYBOARD SUPPORT
   So you can use the calculator with your keyboard
   ======================================== */
document.addEventListener('keydown', (e) => {
    /* If a number key or decimal is pressed */
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        inputNumber(e.key);
    }

    /* If an operator key is pressed */
    if (e.key === '+') inputOperator('+');
    if (e.key === '-') inputOperator('-');
    if (e.key === '*') inputOperator('*');
    if (e.key === '/') {
        /* Prevent the browser from opening the search bar */
        e.preventDefault();
        inputOperator('/');
    }
    if (e.key === '%') inputOperator('%');

    /* If Enter or = is pressed, calculate */
    if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    }

    /* If Backspace is pressed, delete last digit */
    if (e.key === 'Backspace') {
        deleteLast();
    }

    /* If Escape is pressed, clear everything */
    if (e.key === 'Escape') {
        clearAll();
    }
});


/* ========================================
   START THE CALCULATOR
   Show 0 on the screen when the page loads
   ======================================== */
updateDisplay();