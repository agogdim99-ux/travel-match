import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { withDetails } from '@/lib/details';

export const dynamic = 'force-dynamic';

const isUuid = (s) => /^[0-9a-f-]{36}$/i.test(s);

// GET /api/results/:id — 결과 하나 + 추천 여행지 상세 (조회, 링크 공유용)
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    if (!isUuid(id)) return NextResponse.json({ error: '결과를 찾을 수 없어요.' }, { status: 404 });
    const owner = new URL(req.url).searchParams.get('owner');
    const { data: r, error } = await db().from('results').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    if (!r) return NextResponse.json({ error: '결과를 찾을 수 없어요.' }, { status: 404 });

    const ids = [r.top_destination_id, ...r.candidates];
    const { data: dests, error: e2 } = await db().from('destinations').select('*').in('id', ids);
    if (e2) throw e2;
    const pairIds = dests.map((d) => d.pair_id).filter(Boolean);
    let pairs = [];
    if (pairIds.length) {
      const { data: p } = await db().from('destinations').select('id, city, country, emoji, summary, advisory_level, caution').in('id', pairIds);
      pairs = p || [];
    }
    const byId = Object.fromEntries(dests.map((d) => [d.id, withDetails(d)]));
    const pairById = Object.fromEntries(pairs.map((d) => [d.id, d]));
    const top = (r.result?.top || ids.map((x) => ({ id: x, match: null, why: [] })))
      .map((t) => ({ ...t, d: byId[t.id], pair: byId[t.id]?.pair_id ? pairById[byId[t.id].pair_id] : null }))
      .filter((t) => t.d);
    return NextResponse.json({
      id: r.id,
      nickname: r.nickname,
      memo: r.memo,
      created_at: r.created_at,
      isMine: owner === r.owner_key,
      cond: r.cond,
      result: r.result ? { type: r.result.type, order: r.result.order, sc: r.result.sc, picked: r.result.picked } : null,
      top,
    });
  } catch (e) {
    return NextResponse.json({ error: '결과를 불러오지 못했어요.', detail: e.message }, { status: 500 });
  }
}

// PATCH /api/results/:id — 메모 고치기 (수정, 본인만)
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const { ownerKey, memo } = await req.json();
    const text = String(memo ?? '').slice(0, 200);
    const { data, error } = await db()
      .from('results')
      .update({ memo: text })
      .eq('id', id)
      .eq('owner_key', ownerKey ?? '')
      .select('id, memo');
    if (error) throw error;
    if (!data.length) return NextResponse.json({ error: '내 결과만 고칠 수 있어요.' }, { status: 403 });
    return NextResponse.json(data[0]);
  } catch (e) {
    return NextResponse.json({ error: '메모를 저장하지 못했어요.', detail: e.message }, { status: 500 });
  }
}

// DELETE /api/results/:id — 결과 지우기 (삭제, 본인만)
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const owner = new URL(req.url).searchParams.get('owner') ?? '';
    const { data, error } = await db().from('results').delete().eq('id', id).eq('owner_key', owner).select('id');
    if (error) throw error;
    if (!data.length) return NextResponse.json({ error: '내 결과만 지울 수 있어요.' }, { status: 403 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: '삭제하지 못했어요.', detail: e.message }, { status: 500 });
  }
}
