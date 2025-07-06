import { Logo } from '@/components/atoms/logo';

export function Loading({ isCustomBg = true }: { isCustomBg?: boolean }) {
  const customBg = isCustomBg ? 'inset-0 bg-background/80' : '';
  return (
    <div
      className={`fixed flex items-center justify-center ${customBg}`}
      style={{
        zIndex: '999',
      }}
    >
      <div className="relative">
        <Logo
          className="animate-spin relative"
          textClassName="hidden"
          logoClassName="h-12 w-12 text-blue-500"
        />
      </div>
    </div>
  );
}
