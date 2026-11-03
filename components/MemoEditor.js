'use client';
import { useState } from 'react';
import { getOwnerKey } from '@/lib/owner';

export default function MemoEditor({ id, initial }) {
  const [memo, setMemo] = useState(initial ?? '');
  const [state, setState] = useState('');
  async function save() {
    setState('saving');
    try {
      const res = await fetch(`/api/results/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerKey: getOwnerKey(), memo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setState('saved');
    } catch (e) { setState(e.message || '저장 실패'); }
  }
  return (
    <div className="memo" style={{ display: 'grid', gap: 8 }}>
      <textarea className="input" maxLength={200} placeholder="예: 내년 4월에 꼭 가자! ✈️" value={memo}
        onChange={(e) => { setMemo(e.target.value); setState(''); }} />
      <div className="row">
        <button className="btn small" onClick={save} disabled={state === 'saving'}>{state === 'saving' ? '저장 중…' : '메모 저장'}</button>
        {state === 'saved' && <span className="small" style={{ color: 'var(--accent)' }}>저장했어요 ✓</span>}
        {state && !['saving', 'saved'].includes(state) && <span className="error">{state}</span>}
      </div>
    </div>
  );
}
