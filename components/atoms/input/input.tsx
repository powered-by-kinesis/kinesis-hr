import { Input as InputComponent } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface InputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean; // Added disabled prop
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
export function Input({
  value,
  onChange,
  placeholder,
  className,
  disabled,
  onKeyDown,
}: InputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <InputComponent
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn(
        'flex-1 bg-transparent hover:bg-card/40 border-0 outline-none ring-0 ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 placeholder:text-muted-foreground/50 transition-colors duration-200',
        className,
      )}
      disabled={disabled}
      onKeyDown={handleKeyDown}
    />
  );
}
