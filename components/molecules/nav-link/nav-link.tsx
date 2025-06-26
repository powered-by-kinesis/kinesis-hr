interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}

export function NavLink({ href, children, active }: NavLinkProps) {
  return (
    <a
      href={href}
      className={`
        relative px-4 py-2 rounded-full
        font-medium text-sm
        ${
          active
            ? 'text-white bg-background/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]'
            : 'text-foreground/70 hover:text-white/90'
        }
        hover:bg-background/10
        group
      `}
    >
      <span
        className={`
        absolute inset-0 rounded-full opacity-0 
        bg-gradient-to-tr from-white/5 to-white/[0.02]
        group-hover:opacity-100
      `}
      />

      <span className="relative z-10">{children}</span>

      {active && <span className="absolute inset-0 rounded-full bg-white/10" />}
    </a>
  );
}
