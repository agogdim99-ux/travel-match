export default function Loading({ text = '불러오는 중이에요…' }) {
  return (
    <div className="loading" role="status">
      <span className="plane">✈️</span>
      <p>{text}</p>
    </div>
  );
}
