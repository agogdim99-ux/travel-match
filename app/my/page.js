'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdvisoryBadge from '@/components/AdvisoryBadge';
import Loading from '@/components/Loading';
import MemoEditor from '@/components/MemoEditor';
import { CautionTag } from '@/components/CautionBox';
import { getOwnerKey } from '@/lib/owner';

export default function MyPage() {
  const [list, setList] = useState(null);
  const [err, setErr] = useState('');
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    fetch(`/api/results?owner=${getOwnerKey() ?? ''}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setList(data);
      })
      .catch((e) => setErr(e.message || '기록을 불러오지 못했어요.'));
  }, []);

  async function remove(id) {
    const res = await fetch(`/api/results/${id}?owner=${getOwnerKey()}`, { method: 'DELETE' });
    if (res.ok) setList((l) => l.filter((x) => x.id !== id));
    else setErr((await res.json()).error);
    setConfirmId(null);
  }

  return (
    <>
      <h1 className="title">🗂️ 내 여행 기록</h1>
      <p className="muted small">이 브라우저에서 저장한 결과만 보여요.</p>
      {err && <p className="error">{err}</p>}
      {!list && !err && <Loading />}
      {list?.length === 0 && (
        <section className="card narrow center">
          <p>아직 저장한 결과가 없어요.</p>
          <Link href="/test" className="btn primary">첫 테스트 하러 가기</Link>
        </section>
      )}
      {list?.map((r) => (
        <section key={r.id} className="card record">
          <div className="card-head">
            <Link href={`/result/${r.id}`} className="record-title">
              {r.top?.emoji} {r.top?.city} <span className="muted small">{r.top?.country}</span>
            </Link>
            <div className="row" style={{ marginTop: 0 }}>
              {r.top?.caution && <CautionTag />}
              <AdvisoryBadge level={r.top?.advisory_level} />
            </div>
          </div>
          <p className="mono tiny muted">{new Date(r.created_at).toLocaleString('ko-KR')} · {r.nickname}</p>
          <MemoEditor id={r.id} initial={r.memo} />
          {confirmId === r.id ? (
            <div className="row">
              <span className="small">정말 지울까요?</span>
              <button className="btn small danger" onClick={() => remove(r.id)}>지우기</button>
              <button className="btn small ghost" onClick={() => setConfirmId(null)}>취소</button>
            </div>
          ) : (
            <button className="btn small ghost" onClick={() => setConfirmId(r.id)}>🗑 삭제</button>
          )}
        </section>
      ))}
    </>
  );
}
