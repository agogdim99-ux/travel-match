// 여행지 상세 콘텐츠(명소·맛집·사진)는 코드에 함께 들어 있고, DB 행과 합쳐서 내려줘요.
import { details } from '@/data/details.mjs';
import { photos } from '@/data/photos.mjs';

export function withDetails(d) {
  if (!d) return d;
  return { ...d, details: { ...(d.details || {}), ...(details[d.id] || {}), photos: photos[d.id] || null } };
}
