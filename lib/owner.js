'use client';
// 이 브라우저만의 '비밀 열쇠'. 결과를 저장할 때 같이 보내서, 나중에 본인만 보고/고치고/지울 수 있게 해요.
export function getOwnerKey() {
  try {
    let k = localStorage.getItem('owner_key');
    if (!k) {
      k = crypto.randomUUID();
      localStorage.setItem('owner_key', k);
    }
    return k;
  } catch {
    return null;
  }
}
