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

  return compareLists(userSelect, solutionSelect);
}

function compareLists(list1: NodeListOf<Element>, list2: NodeListOf<Element>): boolean {
  const array1 = Array.from(list1);
  const array2 = Array.from(list2);

  if (array1.length !== array2.length) return false;
  for (let i = 0; i < array1.length; i++) if (array1[i] !== array2[i]) return false;
  return true;
}
