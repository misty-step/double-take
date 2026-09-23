/**
 * Typographic quotes for display: apostrophes and quotation marks as a
 * typesetter would set them. Display only; stored text keeps what was typed.
 */
export function curly(text: string): string {
  return text
    .replace(/(\w)'(\w)/g, "$1\u2019$2")
    .replace(/'(\d)/g, "\u2019$1")
    .replace(/(^|[\s([{"\u201C])'/g, "$1\u2018")
    .replace(/'/g, "\u2019")
    .replace(/(^|[\s([{\u2018])"/g, "$1\u201C")
    .replace(/"/g, "\u201D");
}
