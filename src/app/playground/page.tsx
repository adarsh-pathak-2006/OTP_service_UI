'use client';

import React, { useState } from 'react';
import { sendOTP, ApiError, type OTPRecord } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import {
  Zap,
  Send,
  Mail,
  Key,
  CheckCircle2,
  Copy,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import styles from './playground.module.css';

export default function PlaygroundPage() {
  const [referenceId, setReferenceId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    data: OTPRecord;
    message: string;
  } | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResponse(null);
    setLoading(true);

    try {
      const data = await sendOTP(referenceId.trim(), email.trim());
      setResponse(data);
      showToast('OTP sent successfully!', 'success');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to send OTP. Check the reference ID and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyOTP = () => {
    if (response?.data?.otp) {
      navigator.clipboard.writeText(response.data.otp);
      setCopied(true);
      showToast('OTP copied!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.glow} />

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerBadge}>
            <Terminal size={14} />
            Public API Endpoint
          </div>
          <h1 className={styles.title}>OTP Playground</h1>
          <p className={styles.subtitle}>
            Test the OTP delivery API right from your browser. No authentication required — just
            enter a valid project reference ID and an email address.
          </p>
        </div>

        {/* Form Card */}
        <div className={`card ${styles.formCard}`}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputRow}>
              <div className={`input-group ${styles.inputFlex}`}>
                <label className="input-label" htmlFor="play-ref">
                  <Key size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  Reference ID
                </label>
                <input
                  id="play-ref"
                  type="text"
                  className="input"
                  placeholder="Paste your project reference ID"
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  required
                />
              </div>
              <div className={`input-group ${styles.inputFlex}`}>
                <label className="input-label" htmlFor="play-email">
                  <Mail size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  Email Address
                </label>
                <input
                  id="play-email"
                  type="email"
                  className="input"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? (
                <span className="spinner" />
              ) : (
                <Send size={18} />
              )}
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className={styles.errorCard}>
            <span className={styles.errorDot} />
            {error}
          </div>
        )}

        {/* Response */}
        {response && (
          <div className={styles.responseCard}>
            <div className={styles.responseHeader}>
              <CheckCircle2 size={20} className={styles.successIcon} />
              <span className={styles.responseTitle}>{response.message}</span>
            </div>

            <div className={styles.responseBody}>
              <div className={styles.responseRow}>
                <span className={styles.responseLabel}>Email</span>
                <span className={styles.responseValue}>{response.data.email}</span>
              </div>
              <div className={styles.responseRow}>
                <span className={styles.responseLabel}>OTP</span>
                <div className={styles.otpRow}>
                  <span className={styles.otpValue}>{response.data.otp}</span>
                  <button className={styles.otpCopy} onClick={copyOTP}>
                    {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
              <div className={styles.responseRow}>
                <span className={styles.responseLabel}>Sent On</span>
                <span className={styles.responseValue}>
                  {new Date(response.data.sent_on).toLocaleString()}
                </span>
              </div>
              {response.data.project && (
                <div className={styles.responseRow}>
                  <span className={styles.responseLabel}>Project</span>
                  <span className={styles.responseValue}>
                    {response.data.project.project_name}
                  </span>
                </div>
              )}
            </div>

            <div className={styles.responseHint}>
              <Zap size={14} />
              The OTP email has been queued for delivery via Celery
              <ArrowRight size={14} />
            </div>
          </div>
        )}

        {/* API Info */}
        <div className={styles.apiInfo}>
          <h3 className={styles.apiInfoTitle}>API Equivalent</h3>
          <div className={styles.apiCodeBlock}>
            <code>
              POST /getotp/{'<'}reference_id{'>'}/ <br />
              <span style={{ color: 'var(--text-muted)' }}>Content-Type: application/json</span>
              <br />
              <br />
              {`{ "email": "user@example.com" }`}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
