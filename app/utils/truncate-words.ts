/**
 * Truncates a string to a maximum number of words and/or characters.
 * It prioritizes word integrity, returning only whole words that fit the character limit.
 *
 * @param text The input string to truncate.
 * @param maxWords The maximum number of words allowed. Defaults to 10.
 * @param maxChars The maximum number of characters allowed. Defaults to 15.
 * @returns The truncated string.
 */
export function truncateString(
  text: string,
  maxWords: number = 10,
  maxChars: number = 15
): string {
  // 1. Handle edge cases: if text is empty or not a string, return it as is.
  if (typeof text !== "string" || text.trim() === "") {
    return text;
  }

  // 2. Split the string into words.
  const words = text.trim().split(/\s+/);

  let currentWordCount = 0;
  let currentCharCount = 0;
  const resultWords: string[] = [];

  // Iterate through words, checking both word count and character count
  for (const word of words) {
    // Check if adding this word would exceed the word count limit
    if (currentWordCount >= maxWords) {
      break; // Stop if word count limit reached
    }

    // Calculate potential new character count if this word is added
    // +1 for the space that would precede this word (unless it's the very first word)
    const potentialCharCount =
      currentCharCount === 0 ? word.length : currentCharCount + 1 + word.length;

    // Check if adding this word would exceed the character count limit
    // If it's the very first word and already exceeds maxChars, we still return that word.
    // This assumes we want at least one word if possible, even if it's longer than maxChars.
    // If you want to return an empty string in that case, adjust the condition.
    if (potentialCharCount > maxChars && currentWordCount > 0) {
      break; // Stop if character count limit would be exceeded by adding this word (and we already have words)
    }

    // Add the word to the result
    resultWords.push(word);
    currentWordCount++;
    currentCharCount = potentialCharCount; // Update the current character count
  }

  // If no words were added (e.g., first word already too long and maxChars is very small)
  // or if the original string was very short and fit all constraints,
  // return the joined words or the original text depending on context.
  if (resultWords.length === 0 && words.length > 0) {
    // This case handles where the very first word itself exceeds maxChars,
    // and we opted to include at least one word in that scenario.
    // If you want to return "" when the first word > maxChars, change this.
    return words[0].substring(0, maxChars); // Return truncated first word
  }

  // Join the collected words back into a string
  const finalString = resultWords.join(" ");

  // Final check: if the joined string still exceeds maxChars (e.g., due to spaces),
  // or if the last word caused an overflow, we might need to truncate the string itself.
  // This step is crucial for accurate character limit.
  if (finalString.length > maxChars) {
    return `${finalString.substring(0, maxChars).trim()}...`; // Trim in case truncation leaves a trailing space
  }

  return finalString;
}
