import { redirect } from 'next/navigation';
// 예전 주소(/test)로 들어와도 새 테스트 첫 화면으로 보내요
export default function OldTest() { redirect('/'); }
