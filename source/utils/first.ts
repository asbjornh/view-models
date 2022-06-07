/* Utility function for safely getting the first element of an array */
export default function first<T>(arr: T[] | undefined): T | undefined {
  return arr ? arr[0] : undefined;
}
