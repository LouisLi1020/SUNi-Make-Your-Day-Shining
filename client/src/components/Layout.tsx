import { type ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  userEmail: string;
  onLogin: () => void;
  onLogout: () => void;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function Layout({
  children,
  currentPage,
  onNavigate,
  isLoggedIn,
  isAdmin,
  userEmail,
  onLogin,
  onLogout,
  showHeader = true,
  showFooter = true
}: LayoutProps) {
  return (
    <div className="min-h-screen">
      {showHeader && (
        <Header
          currentPage={currentPage}
          onNavigate={onNavigate}
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          userEmail={userEmail}
          onLogin={onLogin}
          onLogout={onLogout}
        />
      )}
      {children}
      {showFooter && <Footer />}
    </div>
  );
}

