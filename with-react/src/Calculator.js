import React from 'react';
import Button from './Button';
import Func from './Func';
import { useState } from 'react';
;

const START_VALUE = '0';

const BUTTONS = [
    {
        text: '(',
        type: 'operation',
    },
    {
        text: ')',
        type: 'operation',
    },
    {
        text: 'C',
        type: 'operation',
        shorthand: 'clear',
    },
    {
        text: '←',
        type: 'delete',
    },
    {
        text: '1/x',
        type: 'operation',
        shorthand: 'fract',
    },
    {
        text: 'x²',
        type: 'operation',
        shorthand: 'pow2',
    },
    {
        text: '√x',
        type: 'operation',
        shorthand: 'sqrt',
    },
    {
        text: '÷',
        type: 'operation',
        value: '/',
    },
    {
        text: '7',
    },
    {
        text: '8',
    },
    {
        text: '9',
    },
    {
        text: '×',
        type: 'operation',
        value: '*',
    },
    {
        text: '4',
    },
    {
        text: '5',
    },
    {
        text: '6',
    },
    {
        text: '−',
        type: 'operation',
        value: '-',
    },
    {
        text: '1',
    },
    {
        text: '2',
    },
    {
        text: '3',
    },
    {
        text: '+',
        type: 'operation',
        value: '+',
    },
    {
        text: '±',
        type: 'negate',
    },
    {
        text: '0',
    },
    {
        text: '.',
    },
    {
        text: '=',
        type: 'equals',
    },
];

function Calculator() {
    const [value, setValue] = useState(START_VALUE);
    const [solved, setSolved] = useState(Number(START_VALUE));
    const [memory, setMemory] = useState(null);

    function change(newVal) {
        newVal = String(newVal);
        if (newVal.startsWith('0') && String(Number(newVal)) !== newVal) newVal = newVal.substring(1);
        newVal = newVal.replace(/[^0-9\+\-\*\/\(\)\.]/, '');
        if (newVal.length < 1) newVal = START_VALUE;
        setValue(newVal);
        solve(false, newVal);
    }
    function solve(ignoreNan = false, valueOverride = undefined) {
        const val = eval_by_hand(valueOverride === undefined ? value : valueOverride);
        if (!ignoreNan && isNaN(val)) {
            setSolved(null);
            return;
        }
        setSolved(val);
    }


    return (
        <div className="calculator">
            <div className="display">
                <input className='input' type='text' value={value} onInput={e => change(e.target.value)} />
                <span className='preview'>{solved != null ? solved : ''}</span>
            </div>
            <div className="control">
                <div className="functions">
                    <Func disabled={memory == null} action={() => setMemory(null)}>MC</Func>
                    <Func disabled={memory == null} action={() => setValue(memory)}>MR</Func>
                    <Func disabled={memory == null || solved == null} action={() => setMemory(memory + solved)}>M+</Func>
                    <Func disabled={memory == null || solved == null} action={() => setMemory(memory - solved)}>M-</Func>
                    <Func action={() => setMemory(solved)}>MS</Func>
                </div>
                <div className="buttons">
                    {BUTTONS.map((x, i) => <Button {...x} key={i} exp={value} solved={solved} set={(v) => change(v)}/>)}
                </div>
            </div>
        </div>
    );
}

export default Calculator;


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