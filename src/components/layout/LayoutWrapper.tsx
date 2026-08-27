'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import InitClientScripts from '@/components/InitClientScripts';

const Newsletter = dynamic(() => import('@/components/Newsletter'), { ssr: false });
const AIFlooringChatbot = dynamic(() => import('@/components/ai/AIFlooringChatbot'), { ssr: false });

interface LayoutWrapperProps {
  children: React.ReactNode;
  header: React.ReactNode;
  mobileMenu: React.ReactNode;
  stickyHeader: React.ReactNode;
  headerSearch: React.ReactNode;
  sidebar: React.ReactNode;
  footer: React.ReactNode;
  newsletter?: React.ReactNode;
}

export default function LayoutWrapper({ 
  children,
  header,
  mobileMenu,
  stickyHeader,
  headerSearch,
  sidebar,
  footer,
}: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/admin-login.php');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <InitClientScripts />
      {header}
      {mobileMenu}
      {stickyHeader}
      {headerSearch}
      {sidebar}
      {children}
      <Newsletter />
      <AIFlooringChatbot />
      {footer}
    </>
  );
}
