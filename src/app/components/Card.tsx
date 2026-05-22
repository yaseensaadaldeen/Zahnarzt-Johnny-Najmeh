import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  centered?: boolean;
  icon?: ReactNode;
  title?: string;
  description?: string;
}

export function Card({ children, className = '', hover = false, centered = false, icon, title, description }: CardProps) {
  if (icon && title) {
    return (
      <div
        className={`bg-card rounded-2xl border border-border overflow-hidden p-6 ${
          hover ? 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:scale-102' : ''
        } ${centered ? 'flex flex-col items-center text-center' : ''} ${className}`}
      >
        <div className="w-12 h-12 flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
        <h3 className="font-semibold text-lg mb-3">{title}</h3>
        {description && <p className="text-muted-foreground mb-4">{description}</p>}
        {children}
      </div>
    );
  }

  return (
    <div
      className={`bg-card rounded-2xl border border-border overflow-hidden ${
        hover ? 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1' : ''
      } ${centered ? 'flex flex-col items-center text-center' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
