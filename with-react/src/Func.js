import React from 'react';

function Func(props) {
    const { disabled, children, action } = props;
    let c = 'func';
    if (disabled) c += ' disabled';
    return <div className={c} onClick={action}>{children}</div>;
}

export default Func;
