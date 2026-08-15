
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import MobileMenu from '@/components/layout/MobileMenu';
import StickyHeader from '@/components/layout/StickyHeader';
import HeaderSearch from '@/components/layout/HeaderSearch';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import Newsletter from '@/components/Newsletter';

import InitClientScripts from '@/components/InitClientScripts';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/admin-login.php');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <InitClientScripts />
      <Header />
      <MobileMenu />
      <StickyHeader />
      <HeaderSearch />
      <Sidebar />
      {children}
      <Newsletter />
      <Footer />
    </>
  );
}
