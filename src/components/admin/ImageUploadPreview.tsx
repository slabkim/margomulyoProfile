'use client';

import Image from 'next/image';
import { ImageUp, RotateCcw } from 'lucide-react';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';

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
const HEIC_IMAGE_EXTENSIONS = new Set(['heic', 'heif']);
const BROWSER_PREVIEW_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);

export default function ImageUploadPreview({ currentImage, currentAlt = 'Preview gambar', required = false, label, helperText, variant = 'portrait' }: ImageUploadPreviewProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const conversionIdRef = useRef(0);
  const [previewUrl, setPreviewUrl] = useState(currentImage || '');
  const [selectedName, setSelectedName] = useState('');
  const [error, setError] = useState('');
  const [conversionPending, setConversionPending] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [conversionStage, setConversionStage] = useState('');

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form || !isConverting) return;

    const preventEarlySubmit = (event: SubmitEvent) => {
      event.preventDefault();
      setError('Tunggu hingga konversi HEIC selesai sebelum menyimpan.');
    };

    form.addEventListener('submit', preventEarlySubmit);
    return () => form.removeEventListener('submit', preventEarlySubmit);
  }, [isConverting]);

  const resetSelection = () => {
    conversionIdRef.current += 1;
    if (inputRef.current) inputRef.current.value = '';
    setPreviewUrl(currentImage || '');
    setSelectedName('');
    setError('');
    setConversionPending(false);
    setIsConverting(false);
    setConversionProgress(0);
    setConversionStage('');
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return resetSelection();
    const extension = file.name.split('.').pop()?.toLowerCase() || '';

    if (!ALLOWED_IMAGE_EXTENSIONS.has(extension)) {
      input.value = '';
      setPreviewUrl(currentImage || '');
      setSelectedName('');
      setConversionPending(false);
      setError('Format file tidak didukung. Pilih JPG, PNG, WebP, HEIC/HEIF, AVIF, TIFF, atau GIF.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      input.value = '';
      setPreviewUrl(currentImage || '');
      setSelectedName('');
      setConversionPending(false);
      setError(`Ukuran ${file.name} adalah ${(file.size / (1024 * 1024)).toLocaleString('id-ID', { maximumFractionDigits: 2 })} MB. Maksimal 5 MB; silakan pilih foto lain.`);
      return;
    }

    setError('');
    setSelectedName(file.name);

    if (HEIC_IMAGE_EXTENSIONS.has(extension)) {
      const conversionId = ++conversionIdRef.current;
      setIsConverting(true);
      setConversionPending(true);
      setConversionProgress(6);
      setConversionStage('Menyiapkan mesin konversi...');

      try {
        const { heicTo, isHeic } = await import('heic-to/csp');
        setConversionProgress(18);
        setConversionStage('Memeriksa file HEIC...');
        if (!(await isHeic(file))) throw new Error('Isi file bukan HEIC/HEIF yang valid.');

        setConversionProgress(35);
        setConversionStage('Mengonversi HEIC ke WebP...');
        let convertedBlob = await heicTo({ blob: file, type: 'image/webp', quality: 0.84 });
        setConversionProgress(76);
        if (convertedBlob.size > MAX_IMAGE_SIZE) {
          setConversionProgress(80);
          setConversionStage('Mengoptimalkan ukuran WebP...');
          convertedBlob = await heicTo({ blob: file, type: 'image/webp', quality: 0.68 });
        }
        if (convertedBlob.size > MAX_IMAGE_SIZE) {
          throw new Error('Hasil konversi masih melebihi batas 5 MB.');
        }
        if (conversionId !== conversionIdRef.current) return;

        setConversionProgress(93);
        setConversionStage('Menyiapkan file dan preview...');
        const baseName = file.name.replace(/\.[^.]+$/, '') || 'gambar';
        const convertedExtension = convertedBlob.type === 'image/png' ? 'png' : convertedBlob.type === 'image/jpeg' ? 'jpg' : 'webp';
        const convertedType = convertedBlob.type || 'image/webp';
        const convertedFile = new File([convertedBlob], `${baseName}.${convertedExtension}`, {
          type: convertedType,
          lastModified: file.lastModified,
        });
        const transfer = new DataTransfer();
        transfer.items.add(convertedFile);
        input.files = transfer.files;

        setSelectedName(`${file.name} → ${convertedFile.name}`);
        setPreviewUrl(URL.createObjectURL(convertedFile));
        setConversionProgress(100);
        setConversionStage('Konversi selesai.');
        await new Promise((resolve) => window.setTimeout(resolve, 250));
        if (conversionId !== conversionIdRef.current) return;
        setConversionPending(false);
      } catch (conversionError) {
        if (conversionId !== conversionIdRef.current) return;
        input.value = '';
        setPreviewUrl(currentImage || '');
        setSelectedName('');
        setConversionPending(false);
        const detail = conversionError instanceof Error ? ` ${conversionError.message}` : '';
        setError(`Foto HEIC tidak berhasil dikonversi.${detail} Silakan pilih kembali file HEIC asli dari perangkat.`);
      } finally {
        if (conversionId === conversionIdRef.current) setIsConverting(false);
      }
      return;
    }

    conversionIdRef.current += 1;
    setIsConverting(false);
    if (BROWSER_PREVIEW_TYPES.has(file.type)) {
      setPreviewUrl(URL.createObjectURL(file));
      setConversionPending(false);
    } else {
      setPreviewUrl(currentImage || '');
      setConversionPending(true);
    }
  };

  return <div className={`admin-field-full image-upload-preview image-upload-preview--${variant}`}>
    <label className="file-field"><span>{label || (currentImage ? 'Ganti foto' : 'Foto kepala desa')}</span><div><ImageUp size={20} /><input ref={inputRef} name="image" type="file" accept="image/*,.heic,.heif,.tif,.tiff" required={required} onChange={handleFileChange} /></div><small>{helperText || `JPG, PNG, WebP, HEIC/HEIF, AVIF, TIFF, atau GIF. Maksimal 5 MB${variant === 'portrait' ? '; foto tegak disarankan.' : '.'}`}</small></label>

    {error && <div className="admin-alert admin-alert--error image-upload-error" role="alert">{error}</div>}

    {conversionPending && <div className="image-conversion-note" role="status"><ImageUp size={18} /><div><strong>{selectedName}</strong><span>{isConverting ? conversionStage : 'Format ini akan dikonversi otomatis ke WebP saat disimpan. Preview tersedia setelah konversi.'}</span>{isConverting && <div className="image-conversion-progress"><div className="image-conversion-bar" role="progressbar" aria-label="Proses konversi HEIC" aria-valuemin={0} aria-valuemax={100} aria-valuenow={conversionProgress}><span style={{ width: `${conversionProgress}%` }} /></div><b>{conversionProgress}%</b></div>}</div><button type="button" onClick={resetSelection}><RotateCcw size={14} />Batalkan</button></div>}

    {previewUrl && <div className="image-preview-card" aria-live="polite">
      <div className="image-preview-frame"><Image src={previewUrl} alt={selectedName ? `Preview ${selectedName}` : currentAlt} width={240} height={300} unoptimized /></div>
      <div><span>{selectedName ? 'Foto baru dipilih' : 'Foto saat ini'}</span><strong>{selectedName || currentAlt}</strong>{selectedName && <button type="button" onClick={resetSelection}><RotateCcw size={14} />Batalkan pilihan</button>}</div>
    </div>}
  </div>;
}
