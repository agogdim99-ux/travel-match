import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { recommend } from '@/lib/recommend';
import { questions } from '@/lib/questions';

export const dynamic = 'force-dynamic';

const validKey = (k) => typeof k === 'string' && /^[a-zA-Z0-9-]{20,64}$/.test(k);

// POST /api/results — 답변을 받아 추천을 계산하고 저장 (생성)
export async function POST(req) {
  try {
    const { ownerKey, nickname, answers } = await req.json();
    const name = String(nickname || '').trim();
    if (!validKey(ownerKey)) return NextResponse.json({ error: '잘못된 요청이에요.' }, { status: 400 });
    if (!name || name.length > 20) return NextResponse.json({ error: '닉네임은 1~20자로 적어 주세요.' }, { status: 400 });
    if (!Array.isArray(answers) || answers.length !== questions.length) {
      return NextResponse.json({ error: '모든 질문에 답해 주세요.' }, { status: 400 });
    }

    const { data: dests, error: e1 } = await db().from('destinations').select('*');
    if (e1) throw e1;
    const { top, candidates } = recommend(answers.map(Number), dests);

    const { data, error } = await db()
      .from('results')
      .insert({ owner_key: ownerKey, nickname: name, answers, top_destination_id: top, candidates })
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
      .select('id, nickname, memo, created_at, top:destinations!results_top_destination_id_fkey(id, country, city, emoji, advisory_level, caution)')
      .eq('owner_key', owner)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: '기록을 불러오지 못했어요.', detail: e.message }, { status: 500 });
  }
}
