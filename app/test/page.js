'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { questions } from '@/lib/questions';
import { getOwnerKey } from '@/lib/owner';
import Loading from '@/components/Loading';

export default function TestPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  async function submit(final) {
    setSaving(true);
    setErr('');
    try {
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerKey: getOwnerKey(), nickname, answers: final }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push(`/result/${data.id}`);
    } catch (e) {
      setErr(e.message || '결과를 저장하지 못했어요. 다시 시도해 주세요.');
      setSaving(false);
    }
  }

  function choose(i) {
    const next = [...answers.slice(0, step), i];
    setAnswers(next);
    if (step + 1 < questions.length) setStep(step + 1);
    else submit(next);
  }

  if (!started) {
    return (
      <section className="card narrow">
        <h1 className="title">먼저, 뭐라고 불러 드릴까요?</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (nickname.trim()) setStarted(true);
          }}
        >
          <input
            className="input"
            placeholder="닉네임 (20자 이내)"
            maxLength={20}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            autoFocus
          />
          <button className="btn primary full" disabled={!nickname.trim()}>시작하기</button>
        </form>
      </section>
    );
  }

  if (saving) return <Loading text="딱 맞는 여행지를 찾는 중이에요…" />;

  const q = questions[step];
  return (
    <section className="card narrow">
      <div className="progress"><span style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
      <p className="mono small muted">Q{step + 1} / {questions.length}</p>
      <h1 className="title">{q.q}</h1>
      <div className="options">
        {q.options.map((o, i) => (
          <button key={o.label} className={`option ${answers[step] === i ? 'on' : ''}`} onClick={() => choose(i)}>
            {o.label}
          </button>
        ))}
      </div>
      {err && <p className="error">{err}</p>}
      {step > 0 && (
        <button className="btn ghost" onClick={() => setStep(step - 1)}>← 이전 질문</button>
      )}
    </section>
  );
}
