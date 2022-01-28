const START_VALUE = '0';
let CURRENT = START_VALUE;
let SOLVED = null;
let MEMORY = null;

//#region Elements

const app = document.getElementById('app');
const calc = el('div', 'calculator');

const display = el('div', 'display');
const control = el('div', 'control');

const input = el('input', 'input', { type: 'text', value: CURRENT });
const preview = el('span', 'preview');
const functions = el('div', 'functions');
const buttons = el('div', 'buttons');

app.appendChild(calc);
calc.appendChild(display);
calc.appendChild(control);
display.appendChild(input);
display.appendChild(preview);
control.appendChild(functions);
control.appendChild(buttons);

const func_mc = func('MC', () => {
    MEMORY == null;
    memory_changed();
});
const func_mr = func('MR', () => {
    CURRENT = MEMORY;
    solve();
    change(SOLVED);
    memory_changed();
});
const func_madd = func('M+', () => {
    solve();
    if (SOLVED == null) return;
    MEMORY += SOLVED;
    memory_changed();
});
const func_msub = func('M-', () => {
    solve();
    if (SOLVED == null) return;
    MEMORY -= SOLVED;
    memory_changed();
});
const func_ms = func('MS', () => {
    solve();
    if (SOLVED == null) return;
    MEMORY = SOLVED;
    memory_changed();
});

const btn_openp = btn('(', () => change(CURRENT + '('), true);
const btn_closep = btn(')', () => change(CURRENT + ')'), true);
const btn_c = btn('C', () => change(START_VALUE), true);
const btn_del = btn('←', () => change(CURRENT.substring(0, CURRENT.length - 1)), true);
const btn_fraction = btn(
    '1/x',
    () => {
        solve();
        if (SOLVED == null) return;
        if (SOLVED == 0) {
            alert("Can't divide by zezo");
            return;
        }
        change(1.0 / SOLVED);
    },
    true
);
const btn_sqr = btn(
    'x²',
    () => {
        solve();
        if (SOLVED == null) return;
        change(SOLVED * SOLVED);
    },
    true
);
const btn_sqrt = btn(
    '√x',
    () => {
        solve();
        change(Math.sqrt(SOLVED));
    },
    true
);
const btn_divide = btn('÷', () => change(CURRENT + '/'), true);
const btn_7 = btn('7', () => change(CURRENT + '7'));
const btn_8 = btn('8', () => change(CURRENT + '8'));
const btn_9 = btn('9', () => change(CURRENT + '9'));
const btn_multiply = btn('×', () => change(CURRENT + '*'), true);
const btn_4 = btn('4', () => change(CURRENT + '4'));
const btn_5 = btn('5', () => change(CURRENT + '5'));
const btn_6 = btn('6', () => change(CURRENT + '6'));
const btn_subtract = btn('−', () => change(CURRENT + '-'), true);
const btn_1 = btn('1', () => change(CURRENT + '1'));
const btn_2 = btn('2', () => change(CURRENT + '2'));
const btn_3 = btn('3', () => change(CURRENT + '3'));
const btn_add = btn('+', () => change(CURRENT + '+'), true);
const btn_negate = btn('±', () => {
    solve();
    change(-SOLVED);
});
const btn_0 = btn('0', () => change(CURRENT + '0'));
const btn_point = btn('.', () => change(CURRENT + '.'));
const btn_equals = btn(
    '=',
    () => {
        solve();
        if (SOLVED == null) return;
        change(SOLVED);
    },
    false,
    true
);

//#endregion

//#region Functions

function btn(text, onClick, isOperation, isEquals) {
    const x = el('div', 'btn' + (isOperation ? ' operation' : '') + (isEquals ? ' equals' : ''), undefined, onClick, text);
    buttons.appendChild(x);
    return x;
}
function func(text, onClick) {
    const x = el('div', 'func', undefined, onClick, text);
    functions.appendChild(x);
    return x;
}
function memory_changed() {
    func_mc.classList.toggle('disabled', MEMORY == null);
    func_mr.classList.toggle('disabled', MEMORY == null);
    func_madd.classList.toggle('disabled', MEMORY == null);
    func_msub.classList.toggle('disabled', MEMORY == null);
}
function solve(ignoreNan = false) {
    const val = eval_by_hand(CURRENT);
    if (!ignoreNan && isNaN(val)) {
        alert("Can't divide by zezo");
        SOLVED = null;
        return;
    }
    SOLVED = val;
    return SOLVED;
}
function change(newVal) {
    newVal = String(newVal);
    if (newVal.startsWith('0') && String(Number(newVal)) !== newVal) newVal = newVal.substring(1);
    SOLVED = null;
    CURRENT = newVal.replace(/[^0-9\+\-\*\/\(\)\.]/, '');
    if (CURRENT.length < 1) CURRENT = START_VALUE;
    input.value = CURRENT;
    preview.textContent = solve(true);
}

//#endregion

input.addEventListener('input', () => {
    change(input.value);
});

memory_changed();

//#region Helpers

/**
 * Creates a new HTMLElement.
 * @param {string} name - The name of the element.
 * @param {string} className - The class of the element.
 * @param {object} props - The attributes of the element.
 * @param {function} onClick - Listener to the click event.
 * @param {string|HTMLElement} content - Children of the element.
 */
function el(name, className, props, onClick, ...content) {
    const x = document.createElement(name);
    if (className && typeof className == 'string') {
        x.setAttribute('class', className);
    }
    if (props && typeof props == 'object') {
        for (const propName in props) {
            if (Object.hasOwnProperty.call(props, propName)) {
                x.setAttribute(propName, props[propName]);
            }
        }
    }
    if (content.length > 0) {
        content.forEach(c => {
            if (c instanceof HTMLElement) x.appendChild(c);
            else if (typeof c == 'string') x.innerHTML += c;
        });
    }
    if (onClick && typeof onClick == 'function') {
        x.addEventListener('click', onClick);
    }
    return x;
}

let eval_parens = /\(([0-9+\-*/\^ .]+)\)/;
let eval_exp = /(\d+(?:\.\d+)?) ?\^ ?(\d+(?:\.\d+)?)/;
let eval_multiply = /(\d+(?:\.\d+)?) ?\* ?(\d+(?:\.\d+)?)/;
let eval_divide = /(\d+(?:\.\d+)?) ?\/ ?(\d+(?:\.\d+)?)/;
let eval_add = /(\d+(?:\.\d+)?) ?\+ ?(\d+(?:\.\d+)?)/;
let eval_substract = /(\d+(?:\.\d+)?) ?- ?(\d+(?:\.\d+)?)/;
function eval_by_hand(expr) {
    if (isNaN(Number(expr))) {
        if (eval_parens.test(expr)) {
            let newExpr = expr.replace(eval_parens, function (match, subExpr) {
                return eval_by_hand(subExpr);
            });
            return eval_by_hand(newExpr);
        } else if (eval_exp.test(expr)) {
            let newExpr = expr.replace(eval_exp, function (match, base, pow) {
                return Math.pow(Number(base), Number(pow));
            });
            return eval_by_hand(newExpr);
        } else if (eval_multiply.test(expr)) {
            let newExpr = expr.replace(eval_multiply, function (match, a, b) {
                return Number(a) * Number(b);
            });
            return eval_by_hand(newExpr);
        } else if (eval_divide.test(expr)) {
            let newExpr = expr.replace(eval_divide, function (match, a, b) {
                if (b != 0) return Number(a) / Number(b);
                return NaN; //div by 0
            });
            return eval_by_hand(newExpr);
        } else if (eval_add.test(expr)) {
            let newExpr = expr.replace(eval_add, function (match, a, b) {
                return Number(a) + Number(b);
            });
            return eval_by_hand(newExpr);
        } else if (eval_substract.test(expr)) {
            let newExpr = expr.replace(eval_substract, function (match, a, b) {
                return Number(a) - Number(b);
            });
            return eval_by_hand(newExpr);
        } else {
            return expr;
        }
    }
    return Number(expr);
}

//#endregion
