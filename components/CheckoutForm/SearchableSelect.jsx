'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const labelStyle = {
  fontSize: 11, fontWeight: 500, color: 'var(--muted)',
  textTransform: 'uppercase', letterSpacing: '0.5px',
};

const SearchableSelect = ({ value, onChange, options, label, required }) => {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState('');
  const containerRef        = useRef(null);
  const searchRef           = useRef(null);
  const listRef             = useRef(null);

  const filtered = options.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase())
  );
  const selected = options.find((o) => o.code === value);

  // Auto-focus search when dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 10);
    else setSearch('');
  }, [open]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Keyboard: escape closes
  const onKeyDown = (e) => {
    if (e.key === 'Escape') setOpen(false);
  };

  const select = (code) => {
    onChange(code);
    setOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <label style={{ ...labelStyle, display: 'block', marginBottom: 6 }}>
        {label}
        {required && <span style={{ color: '#e11d48', marginLeft: 3 }}>*</span>}
      </label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="form-input"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ color: selected ? 'var(--foreground)' : 'var(--muted)' }}>
          {selected?.name ?? 'Select country'}
        </span>
        <ChevronDownIcon style={{
          width: 14, height: 14, color: 'var(--muted)', flexShrink: 0,
          transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 200ms',
        }} />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          onKeyDown={onKeyDown}
          style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 200,
            background: 'var(--background)', border: '1px solid var(--border-color)',
            borderRadius: 0, overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
          }}
        >
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderBottom: '1px solid var(--border-color)' }}>
            <MagnifyingGlassIcon style={{ width: 14, height: 14, color: 'var(--muted)', flexShrink: 0 }} />
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search countries…"
              style={{
                border: 'none', outline: 'none', background: 'transparent',
                color: 'var(--foreground)', fontSize: 13, width: '100%', fontFamily: 'inherit',
              }}
            />
          </div>

          {/* List */}
          <div ref={listRef} style={{ maxHeight: 220, overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '12px 14px', fontSize: 13, color: 'var(--muted)' }}>No results</div>
            ) : filtered.map((o) => (
              <button
                key={o.code}
                type="button"
                onClick={() => select(o.code)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '9px 14px', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: 13, color: 'var(--foreground)',
                  background: o.code === value ? 'var(--surface)' : 'transparent',
                  fontWeight: o.code === value ? 500 : 400,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = o.code === value ? 'var(--surface)' : 'transparent')}
              >
                {o.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
