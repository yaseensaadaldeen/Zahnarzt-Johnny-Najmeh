import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  children: ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-xl transition-all duration-200 font-medium';

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:opacity-90 shadow-md hover:shadow-lg',
    secondary: 'border-2 border-primary text-primary bg-transparent hover:bg-primary/5',
    tertiary: 'text-primary hover:underline'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
