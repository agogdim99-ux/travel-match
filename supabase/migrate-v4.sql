-- TRIPPASS 4.0: 여행지 상세 콘텐츠와 결과 정보 칸 추가
alter table destinations add column if not exists details jsonb not null default '{}'::jsonb;
alter table results add column if not exists cond jsonb;
alter table results add column if not exists result jsonb;
