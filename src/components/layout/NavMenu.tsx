'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavMenuProps {
  className?: string;
  suppressHydrationWarning?: boolean;
}

export default function NavMenu({ className = 'navigation', suppressHydrationWarning }: NavMenuProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' || pathname === '';
    }
    if (path === '/projects' || path === '/portfolio') {
      return (
        pathname === '/projects' ||
        pathname.startsWith('/projects/') ||
        pathname === '/portfolio' ||
        pathname.startsWith('/portfolio/')
      );
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Projects', href: '/projects' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <ul className={className} suppressHydrationWarning={suppressHydrationWarning}>
      {navItems.map((item) => (
        <li key={item.href} className={isActive(item.href) ? 'active' : undefined}>
          <Link href={item.href}>{item.label}</Link>
        </li>
      ))}
    </ul>
  );
}
