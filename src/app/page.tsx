'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Shield,
  Zap,
  Mail,
  Lock,
  ArrowRight,
  Code2,
  Server,
  Clock,
  CheckCircle2,
  Copy,
} from 'lucide-react';
import styles from './page.module.css';
import React from 'react';

export default function HomePage() {
  const { isLoggedIn } = useAuth();
  const [copied, setCopied] = React.useState(false);

  const curlExample = `curl -X POST http://localhost:8000/getotp/YOUR_REF_ID/ \\
  -H "Content-Type: application/json" \\
  -d '{"email": "user@example.com"}'`;

  const handleCopy = () => {
    navigator.clipboard.writeText(curlExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <Zap size={14} />
            Production-Grade OTP Microservice
          </div>
          <h1 className={styles.heroTitle}>
            Send OTPs to <span className="text-gradient">any email</span>
            <br />
            with a single API call
          </h1>
          <p className={styles.heroSubtitle}>
            Register a project, get a unique reference ID, and start delivering
            OTPs instantly — no email infrastructure needed on your end.
          </p>
          <div className={styles.heroCTA}>
            {isLoggedIn ? (
              <Link href="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard
                <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link href="/register" className="btn btn-primary btn-lg">
                  Get Started Free
                  <ArrowRight size={18} />
                </Link>
                <Link href="/playground" className="btn btn-secondary btn-lg">
                  Try Playground
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Code example */}
        <div className={styles.codeBlock}>
          <div className={styles.codeHeader}>
            <div className={styles.codeDots}>
              <span />
              <span />
              <span />
            </div>
            <span className={styles.codeTitle}>Send OTP — cURL</span>
            <button className={styles.copyBtn} onClick={handleCopy}>
              {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className={styles.codeContent}>
            <code>{curlExample}</code>
          </pre>
          <div className={styles.codeResponse}>
            <span className={styles.codeResponseLabel}>Response →</span>
            <code>{`{ "otp": "482913", "message": "otp sent on the entered address" }`}</code>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className={styles.section}>
        <h2 className={`heading-lg ${styles.sectionTitle}`}>How It Works</h2>
        <p className={styles.sectionSubtitle}>Three simple steps to integrate OTP into any app</p>
        <div className={styles.stepsGrid}>
          {[
            {
              step: '01',
              icon: <Lock size={24} />,
              title: 'Register & Create a Project',
              desc: 'Sign up, then create a project. You\'ll receive a cryptographically secure reference ID.',
            },
            {
              step: '02',
              icon: <Code2 size={24} />,
              title: 'Hit the API',
              desc: 'POST to /getotp/<ref_id>/ with an email address. The OTP is generated and queued instantly.',
            },
            {
              step: '03',
              icon: <Mail size={24} />,
              title: 'OTP Delivered',
              desc: 'Celery workers dispatch the email asynchronously — your app never blocks on SMTP.',
            },
          ].map((item) => (
            <div key={item.step} className={`card card-glow ${styles.stepCard}`}>
              <div className={styles.stepNumber}>{item.step}</div>
              <div className={styles.stepIcon}>{item.icon}</div>
              <h3 className={styles.stepTitle}>{item.title}</h3>
              <p className={styles.stepDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className={styles.section}>
        <h2 className={`heading-lg ${styles.sectionTitle}`}>Built for Production</h2>
        <p className={styles.sectionSubtitle}>Enterprise-grade architecture from day one</p>
        <div className={styles.featuresGrid}>
          {[
            {
              icon: <Zap size={20} />,
              title: 'Async Delivery',
              desc: 'Celery + Redis ensures sub-50ms API response times regardless of SMTP latency.',
            },
            {
              icon: <Shield size={20} />,
              title: 'IDOR Protection',
              desc: 'All queries are scoped to the authenticated user — zero cross-tenant data leaks.',
            },
            {
              icon: <Server size={20} />,
              title: 'Redis Caching',
              desc: 'Signal-based cache invalidation guarantees fresh reads without sacrificing performance.',
            },
            {
              icon: <Lock size={20} />,
              title: 'JWT Authentication',
              desc: 'Stateless token-based auth with automatic refresh and secure password validation.',
            },
            {
              icon: <Code2 size={20} />,
              title: 'RESTful API',
              desc: 'Clean, documented endpoints with DRF serializers, pagination, and proper error handling.',
            },
            {
              icon: <Clock size={20} />,
              title: 'Secure Ref IDs',
              desc: 'Project references use secrets.token_urlsafe — no sequential IDs to enumerate.',
            },
          ].map((feat, i) => (
            <div key={i} className={`card ${styles.featureCard}`}>
              <div className={styles.featureIcon}>{feat.icon}</div>
              <h3 className={styles.featureTitle}>{feat.title}</h3>
              <p className={styles.featureDesc}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaGlow} />
        <h2 className="heading-lg">Ready to integrate?</h2>
        <p className={styles.ctaDesc}>
          Start sending OTPs in under 5 minutes. No credit card, no complex setup.
        </p>
        {isLoggedIn ? (
          <Link href="/dashboard" className="btn btn-primary btn-lg">
            Go to Dashboard
            <ArrowRight size={18} />
          </Link>
        ) : (
          <Link href="/register" className="btn btn-primary btn-lg">
            Create Free Account
            <ArrowRight size={18} />
          </Link>
        )}
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLogo}>
            <Shield size={18} />
            <span>OTP Service</span>
          </div>
          <p className={styles.footerText}>
            Built with Django, DRF, Celery & Redis — by Adarsh Pathak
          </p>
        </div>
      </footer>
    </div>
  );
}
