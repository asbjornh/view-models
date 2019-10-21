/** Wrapper around array.filter that takes a `predicate` of list element only (`index` and `array` params are omitted). */
export default function filter<T, U extends T>(
  list: T[],
  predicate: (input: T) => input is U
) {
  return list.filter((el): el is U => predicate(el));
}
