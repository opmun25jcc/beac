import * as React from 'react';
import classNames from 'classnames';

var divWithClassName = (className) => React.forwardRef((p, ref) => (React.createElement("div", { ...p, ref: ref, className: classNames(p.className, className) })));

export { divWithClassName as default };
