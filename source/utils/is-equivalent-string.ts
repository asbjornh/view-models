export default function isEquivalentString(string1 = "") {
  return (string2 = "") => string1.toLowerCase() === string2.toLowerCase();
}
