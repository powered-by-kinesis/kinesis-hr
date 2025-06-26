import { NavLink } from '@/components/molecules/nav-link';
import { useActiveSection } from '@/hooks/use-active-section/use-active-section';

export function NavMenu() {
  const activeSection = useActiveSection();

  return (
    <div className="flex md:flex-row flex-col items-center gap-8 text-sm whitespace-nowrap">
      <NavLink href="#home" active={activeSection === 'home'}>
        Home
      </NavLink>
      <NavLink href="#how-it-works" active={activeSection === 'how-it-works'}>
        How it Works
      </NavLink>
      <NavLink href="#features" active={activeSection === 'features'}>
        Features
      </NavLink>
    </div>
  );
}
