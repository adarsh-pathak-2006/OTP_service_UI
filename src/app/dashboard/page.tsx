'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  getProjects,
  createProject,
  ApiError,
  type Project,
} from '@/lib/api';
import {
  Plus,
  FolderOpen,
  Copy,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Search,
  X,
} from 'lucide-react';
import Link from 'next/link';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Create project modal
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProjects = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const data = await getProjects(p);
      setProjects(data.results);
      setTotalCount(data.count);
      setHasNext(!!data.next);
      setHasPrev(!!data.previous);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.push('/login');
      } else {
        showToast('Failed to load projects', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [router, showToast]);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/login');
      return;
    }
    if (!authLoading && isLoggedIn) {
      fetchProjects(page);
    }
  }, [authLoading, isLoggedIn, page, fetchProjects, router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);

    try {
      await createProject(newName.trim(), newDesc.trim());
      showToast('Project created!', 'success');
      setShowCreate(false);
      setNewName('');
      setNewDesc('');
      setPage(1);
      fetchProjects(1);
    } catch (err) {
      if (err instanceof ApiError) {
        showToast(err.message, 'error');
      } else {
        showToast('Failed to create project', 'error');
      }
    } finally {
      setCreating(false);
    }
  };

  const copyRefId = (refId: string) => {
    navigator.clipboard.writeText(refId);
    setCopiedId(refId);
    showToast('Reference ID copied!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalPages = Math.ceil(totalCount / 10);

  const filtered = searchTerm
    ? projects.filter(
        (p) =>
          p.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.reference_id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : projects;

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
        <div>
          <h1 className={styles.title}>Your Projects</h1>
          <p className={styles.subtitle}>
            {totalCount} project{totalCount !== 1 ? 's' : ''} • Each project has a unique reference ID for OTP delivery
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          <Plus size={18} />
          New Project
        </button>
      </div>

      {/* Search / Filter Bar */}
      {projects.length > 0 && (
        <div className={styles.searchBar}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search projects by name or reference ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className={styles.searchClear} onClick={() => setSearchTerm('')}>
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* Project Grid */}
      {loading ? (
        <div className={styles.loadingState}>
          <span className="spinner spinner-lg" />
        </div>
      ) : filtered.length === 0 && !searchTerm ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Layers size={28} />
          </div>
          <h3>No projects yet</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 320 }}>
            Create your first project to get a reference ID and start sending OTPs.
          </p>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={18} />
            Create Project
          </button>
        </div>
      ) : filtered.length === 0 && searchTerm ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Search size={28} />
          </div>
          <h3>No results found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Try a different search term
          </p>
        </div>
      ) : (
        <div className={`${styles.grid} stagger-children`}>
          {filtered.map((project) => (
            <div key={project.id} className={`card card-glow ${styles.projectCard}`}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <FolderOpen size={18} />
                </div>
                <div className={styles.cardMeta}>
                  <h3 className={styles.cardTitle}>{project.project_name}</h3>
                  <time className={styles.cardDate}>
                    {new Date(project.created_on).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                </div>
              </div>

              {project.description && (
                <p className={styles.cardDesc}>{project.description}</p>
              )}

              <div className={styles.refRow}>
                <span className={styles.refLabel}>Reference ID</span>
                <div className={styles.refValue}>
                  <code className={styles.refCode}>{project.reference_id}</code>
                  <button
                    className={styles.refCopy}
                    onClick={() => copyRefId(project.reference_id)}
                    title="Copy reference ID"
                  >
                    {copiedId === project.reference_id ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              </div>

              <Link
                href={`/dashboard/${project.id}`}
                className={`btn btn-secondary btn-sm ${styles.viewBtn}`}
              >
                View OTP History
              </Link>
            </div>
          ))}
        </div>
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

      {/* Create Project Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="heading-md" style={{ marginBottom: 4 }}>
              Create New Project
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 24 }}>
              A unique reference ID will be generated automatically.
            </p>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="input-group">
                <label className="input-label" htmlFor="proj-name">Project Name</label>
                <input
                  id="proj-name"
                  type="text"
                  className="input"
                  placeholder="My Awesome App"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="proj-desc">Description (optional)</label>
                <textarea
                  id="proj-desc"
                  className="input"
                  placeholder="What is this project for?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={creating || !newName.trim()}
                >
                  {creating ? <span className="spinner" /> : <Plus size={18} />}
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
