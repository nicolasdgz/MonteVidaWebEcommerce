import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "icon";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-blue text-white hover:bg-blue-dark focus:outline-2 focus:outline-offset-2 focus:outline-blue/60 disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:
    "bg-green-brand text-white hover:opacity-90 focus:outline-2 focus:outline-offset-2 focus:outline-green-brand/60 disabled:opacity-50 disabled:cursor-not-allowed",
  ghost:
    "bg-gray-2 text-dark hover:text-blue focus:outline-2 focus:outline-offset-2 focus:outline-blue/60 disabled:opacity-50 disabled:cursor-not-allowed",
  icon: "flex items-center justify-center bg-white text-dark shadow-1 hover:text-blue focus:outline-2 focus:outline-offset-2 focus:outline-blue/60 disabled:opacity-50 disabled:cursor-not-allowed",
};

const sizeClasses: Record<Size, string> = {
  sm: "py-2 px-4 text-custom-sm rounded-md",
  md: "py-3 px-7 text-sm font-medium rounded-md",
  lg: "py-3.5 px-8 text-base font-medium rounded-md",
};

const iconSizeClasses: Record<Size, string> = {
  sm: "w-8 h-8 rounded-md",
  md: "w-9 h-9 rounded-md",
  lg: "w-10 h-10 rounded-md",
};

const Button = ({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) => {
  const sizeClass =
    variant === "icon" ? iconSizeClasses[size] : sizeClasses[size];

  return (
    <button
      className={`inline-flex items-center justify-center transition-colors duration-200 ${variantClasses[variant]} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
