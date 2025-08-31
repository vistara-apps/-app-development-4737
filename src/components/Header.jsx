import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Target, BarChart3, Users, Settings, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { isConnected } = useAccount();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Campaigns', href: '/campaigns', icon: Target },
    { name: 'Influencers', href: '/influencers', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-surface shadow-card border-b border-gray-200 relative z-30">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-primary">
              Influent AI
            </Link>
            
            {isConnected && (
              <nav className="hidden md:flex space-x-6">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'text-accent bg-accent/10'
                          : 'text-gray-600 hover:text-primary hover:bg-gray-100'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon size={16} aria-hidden="true" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <ConnectButton />
            
            {isConnected && (
              <button
                type="button"
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent dark:text-gray-300 dark:hover:bg-gray-700"
                aria-expanded={mobileMenuOpen}
                onClick={toggleMobileMenu}
                aria-label="Main menu"
              >
                <span className="sr-only">{mobileMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isConnected && (
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-surface shadow-lg border-t border-gray-200">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-accent bg-accent/10'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-100'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={closeMobileMenu}
                >
                  <Icon size={20} aria-hidden="true" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
