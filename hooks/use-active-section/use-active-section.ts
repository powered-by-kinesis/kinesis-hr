'use client';
import { useState, useEffect } from 'react';

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string>('home');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0,
      },
    );
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return activeSection;
}
