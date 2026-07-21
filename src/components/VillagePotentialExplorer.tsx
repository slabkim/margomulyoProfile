'use client';

import { useMemo, useState } from 'react';
import { Landmark, MapPinned, Sprout } from 'lucide-react';
import type { VillagePotential } from '@/lib/village-data';
import './VillagePotentialExplorer.css';

export default function VillagePotentialExplorer({ potentials }: { potentials: VillagePotential[] }) {
  const sections = useMemo(() => Array.from(new Set(potentials.map((item) => item.section))), [potentials]);
  const [activeSection, setActiveSection] = useState(sections[0] || '');
  const items = potentials.filter((item) => item.section === activeSection);
  const maximum = Math.max(...items.filter((item) => item.unit === 'ha' && !item.label.toLowerCase().includes('total')).map((item) => Number(item.numeric_value) || 0), 0);
  const Icon = activeSection === 'Batas Wilayah' ? MapPinned : activeSection === 'Legalitas Wilayah' ? Landmark : Sprout;

  if (!items.length) return null;

  return <div className="potential-explorer">
    <div className="potential-tabs" role="tablist" aria-label="Kategori potensi desa">{sections.map((section) => <button type="button" role="tab" aria-selected={section === activeSection} className={section === activeSection ? 'active' : ''} onClick={() => setActiveSection(section)} key={section}>{section}</button>)}</div>
    <div className="potential-panel">
      <div className="potential-panel-head"><span><Icon size={22} /></span><div><small>Potensi Desa Margo Mulyo</small><h3>{activeSection}</h3></div><strong>Data {items[0].source_year}</strong></div>
      <div className="potential-grid">{items.map((item) => {
        const width = maximum > 0 && item.unit === 'ha' && !item.label.toLowerCase().includes('total') ? Math.max(((Number(item.numeric_value) || 0) / maximum) * 100, 1) : 0;
        return <article className={item.label.toLowerCase().includes('total') ? 'is-total' : ''} key={`${item.section}-${item.label}`}><div><span>{item.label}</span><strong>{item.value_text}</strong></div>{width > 0 && <div className="potential-meter" aria-hidden="true"><span style={{ width: `${width}%` }} /></div>}</article>;
      })}</div>
    </div>
  </div>;
}
