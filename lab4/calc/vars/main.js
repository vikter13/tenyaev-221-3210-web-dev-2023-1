// Функция priority позволяет получить 
// значение приоритета для оператора.
// Возможные операторы: +, -, *, /.

// var oneButton = document.getElementById('one')
// var twoButton = document.getElementById('two')
// var threeButton = document.getElementById('three')
// var fourButton = document.getElementById('four')
// var fiveButton = document.getElementById('five')
// var sixButton = document.getElementById('six')
// var sevenButton = document.getElementById('seven')
// var eightButton = document.getElementById('eight')
// var nineButton = document.getElementById('nine')

var resultString = document.getElementById('resultString') 
const calculator = document.querySelector('.calc-container'); //берется ссылка на объект и присваивается


function buttonClick(event) {
        if (event.target.matches('.digit, .operation, .bracket, .result, .clear')) {
            clickHandler(event.target); // в clickhandler кидается элемент на котором произошел клик
    }
}

calculator.addEventListener('click', buttonClick); //устанавливает слушатель события клика на элементе


function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    }else if (operation == '*' || operation == '/') {
        return 2;
    }else if (operation == '(' || operation == ')') {
        return 3;
    }
}

// Проверка, является ли строка str числом.
function isNumeric(str) {
    return /^\d+(.\d+){0,1}$/.test(str);
}

// Проверка, является ли строка str цифрой.
function isDigit(str) {
    return /^\d{1}$/.test(str);
}

// Проверка, является ли строка str оператором.
function isOperation(str) {
    return /^[\+\-\*\/]{1}$/.test(str);
}

// Функция tokenize принимает один аргумент -- строку
// с арифметическим выражением и делит его на токены 
// (числа, операторы, скобки). Возвращаемое значение --
// массив токенов.

function tokenize(str) {
    console.log(str)
    let tokens = [];
    let lastNumber = '';
    for (char of str) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if(lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        } 
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        } 
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}
// Функция compile принимает один аргумент -- строку
// с арифметическим выражением, записанным в инфиксной 
// нотации, и преобразует это выражение в обратную 
// польскую нотацию (ОПН). Возвращаемое значение -- 
// результат преобразования в виде строки, в которой 
// операторы и операнды отделены друг от друга пробелами. 
// Выражение может включать действительные числа, операторы 
// +, -, *, /, а также скобки. Все операторы бинарны и левоассоциативны.
// Функция реализует алгоритм сортировочной станции 
// (https://ru.wikipedia.org/wiki/Алгоритм_сортировочной_станции).

function compile(str) {
    let out = [];
    let stack = [];
    console.log(str, ":comaile")
    for (token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 && isOperation(stack[stack.length - 1]) && priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length-1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    return out.join(' ');
}

// Функция evaluate принимает один аргумент -- строку 
// с арифметическим выражением, записанным в обратной 
// польской нотации. Возвращаемое значение -- результат 
// вычисления выражения. Выражение может включать 
// действительные числа и операторы +, -, *, /.
// Вам нужно реализовать эту функцию
// (https://ru.wikipedia.org/wiki/Обратная_польская_запись#Вычисления_на_стеке).

function evaluate(str) {
    const stack = [];

    function add(a, b) {
        return a + b;
    }
    function subtract(a, b) {
        return a - b;
    }
    function multiply(a, b) {
        return a * b;
    }
    function divide(a, b) {
        return a / b;
    }

    const operators = {
        '+': add,
        '-': subtract,
        '*': multiply,
        '/': divide
    };

    const tokens = str.split(' ');

    tokens.forEach(
        function(token) {
            if (!isNaN(parseFloat(token))) {
                stack.push(parseFloat(token));
            } 
            else if (token in operators) {
                var b = stack.pop();
                var a = stack.pop();
                var result = operators[token](a, b);
                stack.push(result);
            } 
    } );    

    return stack[0];
}

// Функция clickHandler предназначена для обработки 
// событий клика по кнопкам калькулятора. 
// По нажатию на кнопки с классами digit, operation и bracket
// на экране (элемент с классом screen) должны появляться 
// соответствующие нажатой кнопке символы.
// По нажатию на кнопку с классом clear содержимое экрана 
// должно очищаться.
// По нажатию на кнопку с классом result на экране 
// должен появиться результат вычисления введённого выражения 
// с точностью до двух знаков после десятичного разделителя (точки).
// Реализуйте эту функцию. Воспользуйтесь механизмом делегирования 
// событий (https://learn.javascript.ru/event-delegation), чтобы 
// не назначать обработчик для каждой кнопки в отдельности.

function clickHandler(event) {
    if(event.className == "key clear"){
        resultString.textContent=""
    }
    else if(event.value == "="){
        var result = evaluate(compile(resultString.textContent))
        if(isNaN(result)){
            resultString.textContent = "Error"
        }
        else
            resultString.textContent = evaluate(compile(resultString.textContent))
    }
    else if(event.className == "key digit"){
        resultString.textContent+=event.value
    }
    else if(event.className == "key operation"){
            resultString.textContent+=event.value
    }
    else if(event.className == "key bracket"){
        resultString.textContent+=event.value
    }
}

