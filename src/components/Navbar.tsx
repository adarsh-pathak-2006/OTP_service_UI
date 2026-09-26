'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  Shield,
  LayoutDashboard,
  LogOut,
  Zap,
  Menu,
  X,
} from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { isLoggedIn, logoutUser } = useAuth();
  const { showToast } = useToast();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleLogout = () => {
    logoutUser();
    showToast('Logged out successfully', 'success');
    router.push('/');
  };

  const navLinks = isLoggedIn
    ? [
        { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { href: '/playground', label: 'Playground', icon: <Zap size={18} /> },
      ]
    : [
        { href: '/playground', label: 'Playground', icon: <Zap size={18} /> },
      ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} onClick={() => setMobileOpen(false)}>
          <div className={styles.logoIcon}>
            <Shield size={20} />
          </div>
          <span className={styles.logoText}>OTP Service</span>
        </Link>

        <div className={`${styles.links} ${mobileOpen ? styles.linksOpen : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.link} ${pathname === link.href ? styles.linkActive : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}

          {isLoggedIn ? (
            <button className={`btn btn-ghost btn-sm ${styles.authBtn}`} onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </button>
          ) : (
            <div className={styles.authGroup}>
              <Link
                href="/login"
                className={`btn btn-ghost btn-sm ${styles.authBtn}`}
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className={`btn btn-primary btn-sm ${styles.authBtn}`}
                onClick={() => setMobileOpen(false)}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        <button
          className={styles.mobileToggle}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </nav>
  );
}
