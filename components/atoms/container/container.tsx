interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className = '' }: ContainerProps) {
  return <div className={`mx-auto px-6 lg:px-8 ${className}`}>{children}</div>;
}
