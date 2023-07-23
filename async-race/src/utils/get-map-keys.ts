export default function getMapKeys<T>(map: Map<T, unknown>): T[] {
  const keys: T[] = [];
  map.forEach((_, key) => {
    keys.push(key);
  });
  return keys;
}
