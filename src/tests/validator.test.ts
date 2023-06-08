import validateSelector from '../utils/validator';

describe('validator', () => {
  const markup = `
    <div class = "super-div">
      <span class = "super-div__name>It's my name</span>
      <img class = "super-div__image>
    </div>
    <section></section>
  `;
  describe('when selector is equal to provided solution', () => {
    it('returns true', () => {
      expect(validateSelector({ markup, selector: 'div', solution: 'div' })).toBe(true);
    });
  });
  describe('when list of matched elements with provided selector is equal to the list of matched elements with solution', () => {
    it('returns true', () => {
      expect(validateSelector({ markup, selector: '.super-div', solution: 'div' })).toBe(true);
    });
  });
  describe('when list of matched elements with provided selector is not equal to the list of matched elements with solution', () => {
    it('returns false', () => {
      expect(validateSelector({ markup, selector: 'section', solution: 'div' })).toBe(false);
    });
  });
  describe('when selector is considered non-valid', () => {
    it('returns false', () => {
      expect(validateSelector({ markup, selector: '', solution: 'div' })).toBe(false);
      expect(validateSelector({ markup, selector: '=-', solution: 'div' })).toBe(false);
      expect(validateSelector({ markup, selector: '+///////', solution: 'div' })).toBe(false);
      expect(validateSelector({ markup, selector: '-,.,.,.,', solution: 'div' })).toBe(false);
    });
  });
});
