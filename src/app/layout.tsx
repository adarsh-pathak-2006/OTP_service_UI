import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'OTP Service — Plug-and-Play OTP Delivery',
  description:
    'A production-grade OTP delivery microservice. Register a project, get a unique reference ID, and start sending OTPs to any email instantly.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            <div className="bg-pattern" />
            <Navbar />
            <main style={{ paddingTop: 64, minHeight: '100vh', position: 'relative', zIndex: 1 }}>
              {children}
            </main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
