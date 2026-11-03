import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: '어디로 떠날까? — 여행 취향 테스트',
  description: '8개 질문으로 찾는 내 취향 해외 여행지, 여행경보까지 한눈에',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@700&family=IBM+Plex+Mono:wght@500;600&family=Noto+Sans+KR:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header className="topbar">
          <Link href="/" className="logo">✈ 어디로 떠날까?</Link>
          <nav>
            <Link href="/test">테스트</Link>
            <Link href="/my">내 기록</Link>
          </nav>
        </header>
        <main className="wrap">{children}</main>
        <footer className="foot">
          여행경보는 참고용이에요. 출발 전 꼭{' '}
          <a href="https://www.0404.go.kr" target="_blank" rel="noreferrer">외교부 해외안전여행</a>에서 확인하세요.
        </footer>
      </body>
    </html>
  );
}
