/* Utility function for safely getting the first element of an array */
export default function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
