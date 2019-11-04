/** Wrapper around array.filter that takes a `predicate` of list element only (`index` and `array` params are omitted). */
export default function some<T, U extends T>(
  list: T[],
  predicate: (input: T) => input is U
): list is U[] {
  return list.some((el): el is U => predicate(el));
}
