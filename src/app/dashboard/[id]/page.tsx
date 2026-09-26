'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getOTPHistory, ApiError, type OTPRecord } from '@/lib/api';
import {
  ArrowLeft,
  Mail,
  Clock,
  Hash,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from 'lucide-react';
import Link from 'next/link';
import styles from './history.module.css';

export default function OTPHistoryPage() {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const params = useParams();
  const projectId = Number(params.id);

  const [records, setRecords] = useState<OTPRecord[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState('');

  const fetchHistory = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const data = await getOTPHistory(projectId, p);
      setRecords(data.results);
      setTotalCount(data.count);
      setHasNext(!!data.next);
      setHasPrev(!!data.previous);
      if (data.results.length > 0) {
        setProjectName(data.results[0].project.project_name);
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.push('/login');
      } else {
        showToast('Failed to load OTP history', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [projectId, router, showToast]);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/login');
      return;
    }
    if (!authLoading && isLoggedIn) {
      fetchHistory(page);
    }
  }, [authLoading, isLoggedIn, page, fetchHistory, router]);

  const totalPages = Math.ceil(totalCount / 10);

  if (authLoading) {
    return (
      <div className={styles.loadingPage}>
        <span className="spinner spinner-lg" />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/dashboard" className={styles.backLink}>
          <ArrowLeft size={18} />
          Back to Projects
        </Link>
        <div>
          <h1 className={styles.title}>
            {projectName || 'Project'} — OTP History
          </h1>
          <p className={styles.subtitle}>
            {totalCount} OTP{totalCount !== 1 ? 's' : ''} sent from this project
          </p>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className={styles.loadingState}>
          <span className="spinner spinner-lg" />
        </div>
      ) : records.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Inbox size={28} />
          </div>
          <h3>No OTPs sent yet</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 360 }}>
            Use the reference ID in your API calls to send OTPs. They will appear here.
          </p>
          <Link href="/playground" className="btn btn-primary">
            Try the Playground
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>
                    <Hash size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    ID
                  </th>
                  <th>
                    <Mail size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    Email
                  </th>
                  <th>OTP</th>
                  <th>
                    <Clock size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    Sent On
                  </th>
                </tr>
              </thead>
              <tbody className="stagger-children">
                {records.map((record) => (
                  <tr key={record.id}>
                    <td className={styles.cellId}>{record.id}</td>
                    <td className={styles.cellEmail}>{record.email}</td>
                    <td>
                      <span className={styles.otpBadge}>{record.otp}</span>
                    </td>
                    <td className={styles.cellDate}>
                      {new Date(record.sent_on).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className={`${styles.mobileCards} stagger-children`}>
            {records.map((record) => (
              <div key={record.id} className={`card ${styles.mobileCard}`}>
                <div className={styles.mobileRow}>
                  <Mail size={14} className={styles.mobileIcon} />
                  <span className={styles.mobileEmail}>{record.email}</span>
                </div>
                <div className={styles.mobileRow}>
                  <span className={styles.mobileLabel}>OTP</span>
                  <span className={styles.otpBadge}>{record.otp}</span>
                </div>
                <div className={styles.mobileRow}>
                  <Clock size={14} className={styles.mobileIcon} />
                  <span className={styles.mobileDate}>
                    {new Date(record.sent_on).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className="btn btn-ghost btn-sm"
            disabled={!hasPrev}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-ghost btn-sm"
            disabled={!hasNext}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
