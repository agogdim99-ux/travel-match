import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/advisories — 홈 화면의 여행금지 국가·지역
export async function GET() {
  try {
    const { data, error } = await db().from('advisories').select('*').order('level', { ascending: false }).order('id');
    if (error) throw error;
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: '여행경보를 불러오지 못했어요.', detail: e.message }, { status: 500 });
  }
}
