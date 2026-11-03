'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TYPES, MOD, NOUN } from '@/lib/quiz';
import AdvisoryBadge from '@/components/AdvisoryBadge';
import { CautionTag } from '@/components/CautionBox';
import Char from '@/components/Char';
import Loading from '@/components/Loading';
import MemoEditor from '@/components/MemoEditor';
import { getOwnerKey } from '@/lib/owner';

export default function MyPage() {
  const [list, setList] = useState(null);
  const [err, setErr] = useState('');
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    fetch(`/api/results?owner=${getOwnerKey() ?? ''}`)
      .then(async (res) => { const data = await res.json(); if (!res.ok) throw new Error(data.error); setList(data); })
      .catch((e) => setErr(e.message || '기록을 불러오지 못했어요.'));
  }, []);

  async function remove(id) {
    const res = await fetch(`/api/results/${id}?owner=${getOwnerKey()}`, { method: 'DELETE' });
    if (res.ok) setList((l) => l.filter((x) => x.id !== id)); else setErr((await res.json()).error);
    setConfirmId(null);
  }

  return (
    <section className="pass">
      <div className="pass-head"><span>🗂️ MY BOARDING PASSES</span><span>{list ? `${list.length}장` : ''}</span></div>
      <div className="pass-body">
        <h2>내 탑승권 기록</h2>
        <p className="muted small">이 브라우저에서 발급한 탑승권만 보여요. 메모를 고치거나 지울 수 있어요.</p>
        {err && <p className="error">{err}</p>}
        {!list && !err && <Loading />}
        {list?.length === 0 && <><p>아직 발급한 탑승권이 없어요.</p><Link href="/" className="btn">첫 탑승권 발급하기</Link></>}
        {list?.map((r) => (
          <div key={r.id} className="box record">
            <div className="record-top">
              {r.type && TYPES[r.type] ? <Char type={r.type} /> : <span style={{ fontSize: 36 }}>{r.top?.emoji}</span>}
              <div style={{ display: 'grid', gap: 2 }}>
                <Link href={`/result/${r.id}`} className="record-title">ICN → {r.top?.emoji} {r.top?.city} <span className="muted small">{r.top?.country}</span></Link>
                <p className="small muted">{r.type && TYPES[r.type] ? `${TYPES[r.type].n} · ` : ''}{new Date(r.created_at).toLocaleString('ko-KR')} · {r.nickname}</p>
              </div>
            </div>
            <div className="row">{r.top?.caution && <CautionTag />}<AdvisoryBadge level={r.top?.advisory_level} /></div>
            <MemoEditor id={r.id} initial={r.memo} />
            {confirmId === r.id ? (
              <div className="row"><span className="small">정말 지울까요?</span>
                <button className="btn small danger" onClick={() => remove(r.id)}>지우기</button>
                <button className="btn small ghost" onClick={() => setConfirmId(null)}>취소</button></div>
            ) : (
              <div className="row"><Link href={`/result/${r.id}`} className="btn small ghost">탑승권 보기</Link><button className="btn small ghost" onClick={() => setConfirmId(r.id)}>🗑 삭제</button></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
