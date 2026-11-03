import './globals.css';
import TopBar from '@/components/TopBar';

export const metadata = {
  title: 'TRIPPASS 4.0 — 여행 취향 테스트',
  description: '조건 6개와 질문 16개로 알아보는 나의 여행 유형과 추천 여행지 3곳, 외교부 여행경보까지.',
  openGraph: {
    title: '나한테 맞는 여행지는 어디일까? TRIPPASS 여행 취향 테스트',
    description: '3분이면 끝! 내 여행 유형, 학생 시절 모습, 찰떡 여행 메이트와 추천 여행지 3곳까지.',
  },
};

const themeScript = `try{var t=localStorage.getItem('tt_theme');if(t)document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Do+Hyeon&family=Gothic+A1:wght@400;600;800&family=IBM+Plex+Mono:wght@500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <TopBar />
        <main className="wrap">{children}</main>
        <footer className="foot">
          여행경보는 참고용이에요. 출발 전 꼭{' '}
          <a href="https://www.0404.go.kr" target="_blank" rel="noreferrer">외교부 해외안전여행</a>에서 확인하세요.
          <br />경비는 대략적인 범위이고 시기와 숙소에 따라 달라져요. 사진은 위키미디어 공용·위키백과의 자유 이용 사진이에요.
        </footer>
      </body>
    </html>
  );
}
