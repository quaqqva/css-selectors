import parseMarkdown from '../utils/parse-markdown';

describe('parse-markdown', () => {
  it('replaces markdown ** with bold tag', () => {
    const markdown = 'this is **bold text**';
    expect(parseMarkdown(markdown)).toBe('this is <b>bold text</b>');
  });
  it('replaces markdown ``` with code tag', () => {
    const markdown = 'this is ```code``` text';
    expect(parseMarkdown(markdown)).toBe('this is <code>code</code> text');
  });
  it('works properly with special symbols', () => {
    const markdown1 = '**Example:** bla bla';
    expect(parseMarkdown(markdown1)).toBe('<b>Example:</b> bla bla');

    const markdown2 = '```Example:``` bla bla';
    expect(parseMarkdown(markdown2)).toBe('<code>Example:</code> bla bla');

    const markdown3 = '**Hey!** How are **you?** It has been a **really long time!!** Nice to meet ```ya!!!```';
    expect(parseMarkdown(markdown3)).toBe(
      '<b>Hey!</b> How are <b>you?</b> It has been a <b>really long time!!</b> Nice to meet <code>ya!!!</code>'
    );
  });
});
