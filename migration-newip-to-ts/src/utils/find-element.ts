type FindElementArgument<T> = {
  parent: HTMLElement | Document;
  selector: string;
  callback: FindElementCallback<T>;
};

type FindElementCallback<T> = {
  (arg: T): void;
};

export default function findElement<T extends HTMLElement>({
  parent,
  selector,
  callback,
}: FindElementArgument<T>): void {
  const searched: T | null = parent.querySelector<T>(selector);
  if (searched) callback(searched);
}
