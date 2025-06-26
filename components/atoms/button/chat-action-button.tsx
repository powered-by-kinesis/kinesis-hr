import { Button } from '@/components/ui/button';
import { TooltipContent, TooltipTrigger, Tooltip, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ChatActionButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  className?: string;
  tooltip?: string;
  disabled?: boolean;
}

export function ChatActionButton({
  icon: Icon,
  onClick,
  className,
  tooltip,
  disabled = false,
}: ChatActionButtonProps) {
  const buttonClassName = cn(
    'hover:bg-blue-500/5 group transition-all duration-200',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent',
    !disabled && 'hover:scale-105 active:scale-95',
    className,
  );

  const iconClassName = cn(
    'h-5 w-5 transition-colors duration-200',
    !disabled && 'group-hover:text-blue-500',
    disabled && 'text-muted-foreground',
  );

  const ButtonComponent = (
    <Button
      type="submit"
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={buttonClassName}
      disabled={disabled}
    >
      <Icon className={iconClassName} />
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{ButtonComponent}</TooltipTrigger>
          <TooltipContent>{disabled ? 'Enter a message to send' : tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return ButtonComponent;
}
