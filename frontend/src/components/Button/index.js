import React from "react"
import classNames from "classnames"
import PropTypes from "prop-types"

import s from "./button.module.scss"

const Button = ({
    htmlType,
    type = "basic",
    size,
    disabled,
    compType = "button",
    width,
    className,
    iconLeft,
    ...props
}) => {
    return (
        <button
            aria-label="button"
            type={htmlType && htmlType}
            className={classNames(s.button, {
                [s.buttonDisabled]: disabled,
                [s.buttonLeftIcon]: iconLeft,
                [s.buttonDark]: type === "dark",
                [s.buttonLight]: type === "light",
                [s.buttonBasic]: size === "basic",
                [s.buttonSmall]: size === "small",
                [s.buttonBig]: size === "big",
                [s.buttonFull]: width === "full",
                [className]: className,
            })}
            {...props}
        >
            {iconLeft ? <span className={s.icon}>{iconLeft}</span> : null}
            {props.children && <span className={s.text}>{props.children}</span>}
        </button>
    )
}

export default Button

Button.propTypes = {
    htmlType: PropTypes.string,
    iconLeft: PropTypes.element,
    type: PropTypes.string,
    size: PropTypes.string,
    disabled: PropTypes.bool,
    compType: PropTypes.string,
    width: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
}
