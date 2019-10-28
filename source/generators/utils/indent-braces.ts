const numberOfOccurrences = (str = "", characters: string[]) =>
  str.split("").filter(char => characters.includes(char)).length;

type Accumulator = { indentationLevel: number; indentedLines: string[] };

// Indents the provided string when opening or closing braces are found.
export default function indentBraces(
  string = "",
  numberOfSpaces = 2,
  openingSymbols = ["{"],
  closingSymbols = ["}"]
) {
  const lines = string.split("\n");
  const baseIndent = " ".repeat(numberOfSpaces);

  const { indentedLines } = lines.reduce(
    ({ indentationLevel, indentedLines }: Accumulator, line) => {
      const newIndentationLevel =
        indentationLevel -
        numberOfOccurrences(line, closingSymbols) +
        numberOfOccurrences(line, openingSymbols);

      // Lines with a '}' should have the new level applied for the current line. Lines with '{' only affect subsequent lines.
      const indent = baseIndent.repeat(
        newIndentationLevel < indentationLevel
          ? newIndentationLevel
          : indentationLevel
      );

      return {
        indentationLevel: newIndentationLevel,
        indentedLines: indentedLines.concat(indent + line)
      };
    },
    { indentationLevel: 0, indentedLines: [] }
  );

  return indentedLines.join("\n");
}
