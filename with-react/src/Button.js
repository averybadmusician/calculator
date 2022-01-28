import React from 'react';

function Button(props) {
    const { type, text, value, shorthand, exp, solved, set } = props;
    function clickHandler() {
        if (type === 'equals') {
            set(solved);
            return;
        }
        if (type === 'delete') {
            set(exp.substring(0, exp.length - 1));
            return;
        }
        if (type === 'negate') {
            set(-solved);
            return;
        }
        if (shorthand !== undefined) {
            switch (shorthand) {
                case 'clear':
                    set('0');
                    break;
                case 'sqrt':
                    set(Math.sqrt(solved));
                    break;
                case 'pow2':
                    set(solved * solved);
                    break;
                case 'fract':
                    if (solved === 0) break;
                    set(1 / solved);
                    break;
                default:
                    break;
            }
            return;
        }
        let char = value || text;
        set(exp + char);
    }
    let c = 'btn';
    if (type != undefined) c += ' ' + type;
    return <div className={c} onClick={clickHandler}>{text}</div>;
}

export default Button;
