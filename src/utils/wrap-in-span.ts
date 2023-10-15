export default function wrapInSpan(content: string, className: string): string {
  return `<span class="${className}">${content}</span>`;
}
