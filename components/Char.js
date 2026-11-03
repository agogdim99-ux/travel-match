import { charSVG } from '@/lib/char';
export default function Char({ type, className }) {
  return <span className={`char ${className || ''}`} dangerouslySetInnerHTML={{ __html: charSVG(type) }} />;
}
