'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TopBar() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.dataset.theme === 'dark'), []);
  function toggle() {
    const next = dark ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('tt_theme', next); } catch {}
    setDark(!dark);
  }
  return (
    <header className="topbar">
      <Link href="/" className="brand">
        <span className="logo" aria-hidden="true">✈</span><span className="name">TRIPPASS</span><span className="ver">v4</span>
      </Link>
      <nav className="topnav">
        <Link href="/my">내 기록</Link>
        <button className="theme" onClick={toggle} aria-label="밝은 화면과 어두운 화면 바꾸기">{dark ? '🌙' : '☀️'}</button>
      </nav>
    </header>
  );
}
