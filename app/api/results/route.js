import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { compute, COND, DEF, QS } from '@/lib/quiz';
import { withDetails } from '@/lib/details';

export const dynamic = 'force-dynamic';

const validKey = (k) => typeof k === 'string' && /^[a-zA-Z0-9-]{20,64}$/.test(k);

// POST /api/results — 조건·답변을 받아 유형과 여행지를 계산하고 저장 (생성)
export async function POST(req) {
  try {
    const { ownerKey, nickname, answers, cond: rawCond } = await req.json();
    const name = String(nickname || '').trim();
    if (!validKey(ownerKey)) return NextResponse.json({ error: '잘못된 요청이에요.' }, { status: 400 });
    if (!name || name.length > 20) return NextResponse.json({ error: '이름은 1~20자로 적어 주세요.' }, { status: 400 });
    if (!Array.isArray(answers) || answers.length !== QS.length) {
      return NextResponse.json({ error: '모든 질문에 답해 주세요.' }, { status: 400 });
    }
    const cond = {};
    for (const k of Object.keys(COND)) {
      const v = rawCond?.[k];
      cond[k] = COND[k].o.some((x) => x[0] === v) ? v : DEF[k];
    }

    const { data: dests, error: e1 } = await db().from('destinations').select('*');
    if (e1) throw e1;
    const R = compute(answers.map(Number), cond, dests.map(withDetails));
    const ids = R.top.map((r) => r.id);

    const { data, error } = await db()
      .from('results')
      .insert({
        owner_key: ownerKey, nickname: name, answers, cond,
        result: { type: R.type, order: R.order, sc: R.sc, picked: R.picked[R.type].slice(0, 3), top: R.top },
        top_destination_id: ids[0], candidates: ids.slice(1),
      })
      .select('id')
      .single();
    if (error) throw error;
    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: '결과를 저장하지 못했어요.', detail: e.message }, { status: 500 });
  }
}

// GET /api/results?owner=... — 내 결과 목록 (조회)
export async function GET(req) {
  try {
    const owner = new URL(req.url).searchParams.get('owner');
    if (!validKey(owner)) return NextResponse.json({ error: '잘못된 요청이에요.' }, { status: 400 });
    const { data, error } = await db()
      .from('results')
      .select('id, nickname, memo, created_at, result, top:destinations!results_top_destination_id_fkey(id, country, city, emoji, advisory_level, caution)')
      .eq('owner_key', owner)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data.map((r) => ({ ...r, type: r.result?.type || null, result: undefined })));
  } catch (e) {
    return NextResponse.json({ error: '기록을 불러오지 못했어요.', detail: e.message }, { status: 500 });
  }
}
