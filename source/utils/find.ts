/** Wrapper around array.find that takes a `predicate` of list element only (`index` and `array` params are omitted). */
export default function find<T, U extends T>(
  list: T[],
  predicate: (input: T) => input is U
) {
  return list.find((el): el is U => predicate(el));
}
