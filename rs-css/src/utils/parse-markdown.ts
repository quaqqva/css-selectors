// This function converts ``` of md to tag <code> and ** to tag <b>
export default function parseMarkdown(md: string): string {
  const codeRegex = /```[^`]+```/g;
  const codeReplacer = (match: string) => `<code>${match.substring(3, match.length - 3)}</code>`;
  let result = md.replace(codeRegex, codeReplacer);

  const boldRegex = /\*\*\w+\*\*/g;
  const boldReplacer = (match: string) => `<b>${match.substring(2, match.length - 2)}</b>`;
  result = result.replace(boldRegex, boldReplacer).replace('\n', '<br>');
  return result;
}
