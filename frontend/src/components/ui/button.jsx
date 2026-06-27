import React from 'react'

const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  onClick, 
  disabled = false, 
  type = "button" 
}) => {

  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm",
    outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300",
    ghost: "text-slate-700 hover:bg-slate-100 active:bg-slate-200",
    destructive: "bg-rose-50 text-rose-600 hover:bg-rose-100 active:bg-rose-200",
    link: "text-blue-600 underline-offset-4 hover:underline text-sm",
  }

  const sizes = {
    xs: "h-7 px-2 text-xs rounded-md",
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-11 px-8 text-base",
    icon: "h-10 w-10 p-0",
  }

  const finalClass = `${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md}`

  return (
    <button 
      type={type} 
      className={finalClass} 
      onClick={onClick} 
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button