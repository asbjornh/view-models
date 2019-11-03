// Creates a dot-notation string, skipping any undefined values
export default (...strings: (string | undefined)[]) =>
  strings.filter(string => string).join(".");
