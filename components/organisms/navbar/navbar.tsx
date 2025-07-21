'use client';
import { Logo } from '@/components/atoms/logo';
import { NavMenu } from '@/components/molecules/nav-menu';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface NavbarProps {
  login: (callbackUrl: string) => void;
  isAuthLoading: boolean;
}

export function Navbar({ login, isAuthLoading }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-300 ease-in-out px-4">
      <div
        className={`mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between 
                    transition-all duration-300 ease-in-out h-16 rounded-2xl  backdrop-blur-md bg-background/10
                    ${scrolled ? 'max-w-3xl mt-4 border border-primary/10' : 'bg-transparent border-none'}`}
      >
        <div>
          <a href="#">
            <Logo />
          </a>
        </div>

        <div className="hidden md:flex justify-center">
          <NavMenu />
        </div>

        <div className="hidden md:flex justify-end">
          <Button
            className="px-6 text-sm cursor-pointer rounded-full bg-gradient-to-br from-primary to-primary/80 text-white hover:bg-gradient-to-br hover:from-primary hover:to-primary/90"
            disabled={isAuthLoading}
            onClick={() => {
              login('/hiring');
              setIsMenuOpen(false);
            }}
          >
            Get Started
          </Button>
        </div>

        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div className="md:hidden fixed top-0 left-0 right-0 bg-white z-50 px-4 py-3">
              <motion.div
                className="flex flex-col h-[50%] rounded-t-2xl"
                initial={{ y: '100%' }}
                animate={{
                  y: 0,
                  transition: {
                    type: 'spring',
                    damping: 15,
                    stiffness: 200,
                    bounce: 0.25,
                  },
                }}
                exit={{
                  opacity: 0,
                  transition: {
                    duration: 0,
                  },
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-2">
                    <Logo />
                  </div>
                  <button onClick={() => setIsMenuOpen(false)}>
                    <X className="h-6 w-6 text-gray-400" />
                  </button>
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto">
                  <div className="flex flex-col">
                    <NavMenu />
                  </div>
                </div>

                {/* Bottom Button */}
                <div className="p-4 flex flex-col gap-4">
                  <Button
                    className="w-full py-6 text-[15px] font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isAuthLoading}
                    onClick={() => {
                      login('/hiring');
                      setIsMenuOpen(false);
                    }}
                  >
                    Get Started
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
