import { Logo } from '@/components/atoms/logo';

export function Loading() {
  return (
    <div
      className="fixed inset-0 bg-background/80  flex items-center justify-center"
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
