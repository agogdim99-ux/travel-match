import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/destinations — 여행지 전체 (경보 단계 높은 순 정렬 옵션: ?sort=advisory)
export async function GET(req) {
  try {
    const sort = new URL(req.url).searchParams.get('sort');
    let query = db().from('destinations').select('*');
    query = sort === 'advisory' ? query.order('advisory_level', { ascending: false }) : query.order('region').order('country');
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: '여행지를 불러오지 못했어요.', detail: e.message }, { status: 500 });
  }
}
