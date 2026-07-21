'use client';

import Image from 'next/image';
import { ImageUp, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type ImageUploadPreviewProps = {
  currentImage?: string;
  currentAlt?: string;
  required?: boolean;
};

export default function ImageUploadPreview({ currentImage, currentAlt = 'Preview foto kepala desa', required = false }: ImageUploadPreviewProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState(currentImage || '');
  const [selectedName, setSelectedName] = useState('');

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const resetSelection = () => {
    if (inputRef.current) inputRef.current.value = '';
    setPreviewUrl(currentImage || '');
    setSelectedName('');
  };

  return <div className="admin-field-full image-upload-preview">
    <label className="file-field"><span>{currentImage ? 'Ganti foto' : 'Foto kepala desa'}</span><div><ImageUp size={20} /><input ref={inputRef} name="image" type="file" accept="image/jpeg,image/png,image/webp" required={required} onChange={(event) => {
      const file = event.target.files?.[0];
      if (!file) return resetSelection();
      setPreviewUrl(URL.createObjectURL(file));
      setSelectedName(file.name);
    }} /></div><small>JPG, PNG, atau WebP. Maksimal 5 MB; foto tegak disarankan.</small></label>

    {previewUrl && <div className="image-preview-card" aria-live="polite">
      <div className="image-preview-frame"><Image src={previewUrl} alt={selectedName ? `Preview ${selectedName}` : currentAlt} width={240} height={300} unoptimized /></div>
      <div><span>{selectedName ? 'Foto baru dipilih' : 'Foto saat ini'}</span><strong>{selectedName || currentAlt}</strong>{selectedName && <button type="button" onClick={resetSelection}><RotateCcw size={14} />Batalkan pilihan</button>}</div>
    </div>}
  </div>;
}
