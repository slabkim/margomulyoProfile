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
const ALLOWED_IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif', 'avif', 'tif', 'tiff', 'gif']);
const BROWSER_PREVIEW_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);

export default function ImageUploadPreview({ currentImage, currentAlt = 'Preview gambar', required = false, label, helperText, variant = 'portrait' }: ImageUploadPreviewProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState(currentImage || '');
  const [selectedName, setSelectedName] = useState('');
  const [error, setError] = useState('');
  const [conversionPending, setConversionPending] = useState(false);

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
    setConversionPending(false);
  };

  return <div className={`admin-field-full image-upload-preview image-upload-preview--${variant}`}>
    <label className="file-field"><span>{label || (currentImage ? 'Ganti foto' : 'Foto kepala desa')}</span><div><ImageUp size={20} /><input ref={inputRef} name="image" type="file" accept="image/*,.heic,.heif,.tif,.tiff" required={required} onChange={(event) => {
      const file = event.target.files?.[0];
      if (!file) return resetSelection();
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      if (!ALLOWED_IMAGE_EXTENSIONS.has(extension)) {
        event.target.value = '';
        setPreviewUrl(currentImage || '');
        setSelectedName('');
        setConversionPending(false);
        setError('Format file tidak didukung. Pilih JPG, PNG, WebP, HEIC/HEIF, AVIF, TIFF, atau GIF.');
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        event.target.value = '';
        setPreviewUrl(currentImage || '');
        setSelectedName('');
        setConversionPending(false);
        setError(`Ukuran ${file.name} adalah ${(file.size / (1024 * 1024)).toLocaleString('id-ID', { maximumFractionDigits: 2 })} MB. Maksimal 5 MB; silakan pilih foto lain.`);
        return;
      }
      setError('');
      setSelectedName(file.name);
      if (BROWSER_PREVIEW_TYPES.has(file.type)) {
        setPreviewUrl(URL.createObjectURL(file));
        setConversionPending(false);
      } else {
        setPreviewUrl(currentImage || '');
        setConversionPending(true);
      }
    }} /></div><small>{helperText || `JPG, PNG, WebP, HEIC/HEIF, AVIF, TIFF, atau GIF. Maksimal 5 MB${variant === 'portrait' ? '; foto tegak disarankan.' : '.'}`}</small></label>

    {error && <div className="admin-alert admin-alert--error image-upload-error" role="alert">{error}</div>}

    {conversionPending && <div className="image-conversion-note" role="status"><ImageUp size={18} /><div><strong>{selectedName}</strong><span>Format ini akan dikonversi otomatis ke WebP saat disimpan. Preview tersedia setelah konversi.</span></div><button type="button" onClick={resetSelection}><RotateCcw size={14} />Batalkan</button></div>}

    {previewUrl && <div className="image-preview-card" aria-live="polite">
      <div className="image-preview-frame"><Image src={previewUrl} alt={selectedName ? `Preview ${selectedName}` : currentAlt} width={240} height={300} unoptimized /></div>
      <div><span>{selectedName ? 'Foto baru dipilih' : 'Foto saat ini'}</span><strong>{selectedName || currentAlt}</strong>{selectedName && <button type="button" onClick={resetSelection}><RotateCcw size={14} />Batalkan pilihan</button>}</div>
    </div>}
  </div>;
}
