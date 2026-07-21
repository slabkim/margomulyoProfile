'use client';

import Image from 'next/image';
import { ImageUp, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type ImageUploadPreviewProps = {
  currentImage?: string;
  currentAlt?: string;
  required?: boolean;
  label?: string;
  helperText?: string;
  variant?: 'portrait' | 'landscape';
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export default function ImageUploadPreview({ currentImage, currentAlt = 'Preview gambar', required = false, label, helperText, variant = 'portrait' }: ImageUploadPreviewProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState(currentImage || '');
  const [selectedName, setSelectedName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const resetSelection = () => {
    if (inputRef.current) inputRef.current.value = '';
    setPreviewUrl(currentImage || '');
    setSelectedName('');
    setError('');
  };

  return <div className={`admin-field-full image-upload-preview image-upload-preview--${variant}`}>
    <label className="file-field"><span>{label || (currentImage ? 'Ganti foto' : 'Foto kepala desa')}</span><div><ImageUp size={20} /><input ref={inputRef} name="image" type="file" accept="image/jpeg,image/png,image/webp" required={required} onChange={(event) => {
      const file = event.target.files?.[0];
      if (!file) return resetSelection();
      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        event.target.value = '';
        setPreviewUrl(currentImage || '');
        setSelectedName('');
        setError('Format file tidak didukung. Pilih gambar JPG, PNG, atau WebP.');
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        event.target.value = '';
        setPreviewUrl(currentImage || '');
        setSelectedName('');
        setError(`Ukuran ${file.name} adalah ${(file.size / (1024 * 1024)).toLocaleString('id-ID', { maximumFractionDigits: 2 })} MB. Maksimal 5 MB; silakan pilih foto lain.`);
        return;
      }
      setError('');
      setPreviewUrl(URL.createObjectURL(file));
      setSelectedName(file.name);
    }} /></div><small>{helperText || `JPG, PNG, atau WebP. Maksimal 5 MB${variant === 'portrait' ? '; foto tegak disarankan.' : '.'}`}</small></label>

    {error && <div className="admin-alert admin-alert--error image-upload-error" role="alert">{error}</div>}

    {previewUrl && <div className="image-preview-card" aria-live="polite">
      <div className="image-preview-frame"><Image src={previewUrl} alt={selectedName ? `Preview ${selectedName}` : currentAlt} width={240} height={300} unoptimized /></div>
      <div><span>{selectedName ? 'Foto baru dipilih' : 'Foto saat ini'}</span><strong>{selectedName || currentAlt}</strong>{selectedName && <button type="button" onClick={resetSelection}><RotateCcw size={14} />Batalkan pilihan</button>}</div>
    </div>}
  </div>;
}
