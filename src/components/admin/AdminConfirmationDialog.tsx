'use client';

import { AlertTriangle, Save, Trash2, UploadCloud, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type ConfirmationKind = 'delete' | 'save' | 'upload' | 'create';

type PendingConfirmation = {
  form: HTMLFormElement;
  submitter: HTMLButtonElement | HTMLInputElement | null;
  kind: ConfirmationKind;
  title: string;
  message: string;
  confirmLabel: string;
};

function confirmationFor(form: HTMLFormElement, submitter: HTMLElement | null): Omit<PendingConfirmation, 'form' | 'submitter'> {
  const buttonText = `${submitter?.textContent || ''} ${submitter?.getAttribute('aria-label') || ''}`.trim().toLowerCase();
  const rowTitle = form.closest('tr')?.querySelector('td strong')?.textContent?.trim();
  const imageName = form.querySelector<HTMLInputElement>('input[type="file"][name="image"]')?.files?.[0]?.name;

  if (buttonText.includes('hapus')) {
    return {
      kind: 'delete',
      title: 'Hapus data ini?',
      message: rowTitle
        ? `“${rowTitle}” akan dihapus secara permanen dan tidak dapat dipulihkan.`
        : 'Data ini akan dihapus secara permanen dan tidak dapat dipulihkan.',
      confirmLabel: 'Ya, hapus',
    };
  }

  if (buttonText.includes('unggah')) {
    return {
      kind: 'upload',
      title: 'Unggah foto ini?',
      message: imageName
        ? `Pastikan “${imageName}” dan keterangannya sudah benar sebelum ditampilkan di website.`
        : 'Pastikan foto dan keterangannya sudah benar sebelum ditampilkan di website.',
      confirmLabel: 'Ya, unggah',
    };
  }

  if (buttonText.includes('tambah') || buttonText.includes('simpan berita')) {
    return {
      kind: 'create',
      title: buttonText.includes('berita') ? 'Simpan berita baru?' : 'Tambahkan data baru?',
      message: imageName
        ? `Data dan file “${imageName}” akan ditambahkan ke website. Pastikan seluruh isinya sudah benar.`
        : 'Data baru akan ditambahkan ke website. Pastikan seluruh isinya sudah benar.',
      confirmLabel: buttonText.includes('berita') ? 'Ya, simpan berita' : 'Ya, tambahkan',
    };
  }

  return {
    kind: 'save',
    title: 'Simpan perubahan?',
    message: imageName
      ? `Perubahan data beserta file “${imageName}” akan disimpan dan menggantikan informasi sebelumnya.`
      : 'Perubahan akan disimpan dan menggantikan informasi sebelumnya. Pastikan semua data sudah benar.',
    confirmLabel: 'Ya, simpan',
  };
}

export default function AdminConfirmationDialog() {
  const [pending, setPending] = useState<PendingConfirmation | null>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const confirmationBypassRef = useRef(new WeakSet<HTMLFormElement>());

  useEffect(() => {
    const handleSubmit = (event: SubmitEvent) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || !form.closest('.admin-content')) return;
      if (confirmationBypassRef.current.has(form)) {
        confirmationBypassRef.current.delete(form);
        return;
      }

      const submitter = event.submitter instanceof HTMLButtonElement || event.submitter instanceof HTMLInputElement
        ? event.submitter
        : null;
      if (form.dataset.confirmation === 'none' || submitter?.dataset.confirmation === 'none') return;
      if (form.querySelector('.image-conversion-bar')) return;

      event.preventDefault();
      setPending({ form, submitter, ...confirmationFor(form, submitter) });
    };

    document.addEventListener('submit', handleSubmit, true);
    return () => document.removeEventListener('submit', handleSubmit, true);
  }, []);

  useEffect(() => {
    if (!pending) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    cancelButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPending(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pending]);

  const confirm = () => {
    if (!pending) return;
    const { form, submitter } = pending;
    confirmationBypassRef.current.add(form);
    setPending(null);
    window.setTimeout(() => {
      form.requestSubmit(submitter || undefined);
      confirmationBypassRef.current.delete(form);
    }, 0);
  };

  if (!pending) return null;

  const Icon = pending.kind === 'delete' ? Trash2 : pending.kind === 'upload' ? UploadCloud : pending.kind === 'save' ? Save : AlertTriangle;

  return <div className="admin-confirm-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setPending(null); }}>
    <div className={`admin-confirm-dialog admin-confirm-dialog--${pending.kind}`} role="alertdialog" aria-modal="true" aria-labelledby="admin-confirm-title" aria-describedby="admin-confirm-message">
      <button className="admin-confirm-close" type="button" aria-label="Tutup konfirmasi" onClick={() => setPending(null)}><X size={18} /></button>
      <div className="admin-confirm-icon"><Icon size={24} /></div>
      <div className="admin-confirm-copy">
        <span>Konfirmasi tindakan</span>
        <h2 id="admin-confirm-title">{pending.title}</h2>
        <p id="admin-confirm-message">{pending.message}</p>
      </div>
      <div className="admin-confirm-actions">
        <button ref={cancelButtonRef} className="admin-button" type="button" onClick={() => setPending(null)}>Batal</button>
        <button className={`admin-button ${pending.kind === 'delete' ? 'admin-button--danger' : 'admin-button--primary'}`} type="button" onClick={confirm}>{pending.confirmLabel}</button>
      </div>
    </div>
  </div>;
}
