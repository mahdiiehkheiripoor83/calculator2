const hourEl = document.querySelector('.hour');
const minuteEl = document.querySelector('.minute');
const valueEL = document.querySelector('.value');
const acEl = document.querySelector('.ac');
const pmEl = document.querySelector('.pm');
const percentEl = document.querySelector('.percent');
const divisionEl = document.querySelector('.division');
const multiplicationEl = document.querySelector('.multiplication');
const subtractionEl = document.querySelector('.subtraction');
const additionEl = document.querySelector('.addition');
const equalEl = document.querySelector('.equal');
const historyEl = document.querySelector('.history');

const number0El = document.querySelector('.number_0');
const number1El = document.querySelector('.number_1');
const number2El = document.querySelector('.number_2');
const number3El = document.querySelector('.number_3');
const number4El = document.querySelector('.number_4');
const number5El = document.querySelector('.number_5');
const number6El = document.querySelector('.number_6');
const number7El = document.querySelector('.number_7');
const number8El = document.querySelector('.number_8');
const number9El = document.querySelector('.number_9');
const decimalEl = document.querySelector('.decimal');

const numberElArray = [
    number0El, number1El, number2El, number3El, number4El, number5El,
    number6El, number7El, number8El, number9El
];

let valueStrInMemory = null;
let operatorInMemory = null;
let operationStr = '';

const historyDisplay = document.querySelector('.history-display');

// Function to save history
const saveToHistory = (operation) => {
    let history = JSON.parse(localStorage.getItem('calculatorHistory')) || [];
    history.push(operation);
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
};

// Function to display history
const displayHistory = () => {
    let history = JSON.parse(localStorage.getItem('calculatorHistory')) || [];
    historyDisplay.innerHTML = history.join('<br>');
    historyDisplay.style.display = 'block';
};

const getValueAsStr = () => valueEL.textContent.split(',').join('');

const getValueAsNum = () => {
    return parseFloat(getValueAsStr());
};

const setStrAsValue = (valueStr) => {
    if (valueStr[valueStr.length - 1] === '.') {
        valueEL.textContent += '.';
        return;
    }
    const [wholeNumStr, decimalStr] = valueStr.split('.');
    if (decimalStr) {
        valueEL.textContent = parseFloat(wholeNumStr).toLocaleString() + '.' + decimalStr;
    } else {
        valueEL.textContent = parseFloat(wholeNumStr).toLocaleString();
    }
};

const handleNumberClick = (numStr) => {
    const currentValueStr = getValueAsStr();
    if (currentValueStr === '0') {
        setStrAsValue(numStr);
    } else {
        setStrAsValue(currentValueStr + numStr);
    }
    operationStr += numStr;
};

const getResultOfOperationAsStr = () => {
    const currentValueNum = getValueAsNum();
    const valueNumInMemory = parseFloat(valueStrInMemory);
    let newValueNum;
    if (operatorInMemory === '+') {
        newValueNum = valueNumInMemory + currentValueNum;
    } else if (operatorInMemory === '-') {
        newValueNum = valueNumInMemory - currentValueNum;
    } else if (operatorInMemory === '×') {
        newValueNum = valueNumInMemory * currentValueNum;
    } else if (operatorInMemory === '÷') {
        if (currentValueNum === 0) {
            alert('Division by zero is not allowed!');
            return '0';
        }
        newValueNum = valueNumInMemory / currentValueNum;
    }
    return newValueNum.toString();
};

const handleOperatorClick = (operation) => {
    const currentValueStr = getValueAsStr();
    if (!valueStrInMemory) {
        valueStrInMemory = currentValueStr;
        operatorInMemory = operation;
        setStrAsValue('0');
    } else {
        valueStrInMemory = getResultOfOperationAsStr();
        operatorInMemory = operation;
        setStrAsValue('0');
    }
    operationStr += ' ' + operation + ' ';
};
acEl.addEventListener('click', () => {
    setStrAsValue('0');
    valueStrInMemory = null;
    operatorInMemory = null;
    operationStr = '';
});

pmEl.addEventListener('click', () => {
    const currentValueNum = getValueAsNum();
    const currentValueAsStr = getValueAsStr();
    if (currentValueNum >= 0) {
        setStrAsValue('-' + currentValueAsStr);
    } else {
        setStrAsValue(currentValueAsStr.substring(1));
    }
});

percentEl.addEventListener('click', () => {
    const currentValueNum = getValueAsNum();
    const newValueNum = currentValueNum / 100;
    setStrAsValue(newValueNum.toString());
    valueStrInMemory = null;
    operatorInMemory = null;
});

for (let i = 0; i < numberElArray.length; i++) {
    const numberEl = numberElArray[i];
    numberEl.addEventListener('click', () => {
        handleNumberClick(i.toString());
    });
}

decimalEl.addEventListener('click', () => {
    const currentValueStr = getValueAsStr();
    if (!currentValueStr.includes('.')) {
        setStrAsValue(currentValueStr + '.');
        operationStr += '.';
    }
});

additionEl.addEventListener('click', () => {
    handleOperatorClick('+');
});

subtractionEl.addEventListener('click', () => {
    handleOperatorClick('-');
});

multiplicationEl.addEventListener('click', () => {
    handleOperatorClick('×');
});

divisionEl.addEventListener('click', () => {
    handleOperatorClick('÷');
});

equalEl.addEventListener('click', () => {
    if (valueStrInMemory) {
        const result = getResultOfOperationAsStr();
        setStrAsValue(result);
        operationStr += ' = ' + result;

        // Save operation to history
        saveToHistory(operationStr);

        // Send operation to backend (commented out)
        /*
        fetch('https://example.com/api/save-operation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ operation: operationStr }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Operation saved:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
        */

        valueStrInMemory = null;
        operatorInMemory = null;
        operationStr = '';
    }
});

// Display history when clicking the history button
historyEl.addEventListener('click', () => {
    displayHistory();

    // Fetch history from backend (commented out)
    /*
    fetch('https://example.com/api/get-history')
    .then(response => response.json())
    .then(data => {
        console.log('History:', data);
        alert(JSON.stringify(data));
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    */
});