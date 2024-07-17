import React from 'react'

const ToggledButton = ({ toggled = false, children,className, ...props }) => {
    return (
        <button
            {...props}
            className={`gradient-border p-5 ${className}`}
        >
            {children}
        </button>
)
}

export default ToggledButton