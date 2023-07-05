type InputParams = {
  markup: string;
  selector: string;
  solution: string;
};

export default function validateSelector({ markup, selector, solution }: InputParams): boolean {
  if (selector === solution) return true;
  const template = document.createElement('template');
  template.insertAdjacentHTML('afterbegin', markup);

  const userSelect = template.querySelectorAll(selector);
  const solutionSelect = template.querySelectorAll(solution);

  console.log(userSelect, solutionSelect);
  return userSelect === solutionSelect;
}
