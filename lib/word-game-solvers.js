function normalizeLetters(value) {
  return String(value || "").toUpperCase().replace(/[^A-Z?]/g, "");
}

function normalizePattern(value) {
  return String(value || "").toUpperCase().replace(/[^A-Z_?]/g, "").replace(/\?/g, "_");
}

function normalizeWords(words) {
  return Array.from(new Set(words.map((word) => normalizeLetters(word).replace(/\?/g, "")).filter(Boolean)));
}

function letterCounts(value) {
  const counts = new Map();
  for (const letter of normalizeLetters(value).replace(/\?/g, "")) {
    counts.set(letter, (counts.get(letter) || 0) + 1);
  }
  return counts;
}

function hasAtLeastCounts(word, requiredCounts) {
  const counts = letterCounts(word);
  for (const [letter, count] of requiredCounts.entries()) {
    if ((counts.get(letter) || 0) < count) return false;
  }
  return true;
}

export function solveWordle(words, options = {}) {
  const length = Math.min(12, Math.max(3, Number(options.length || 5)));
  const pattern = normalizePattern(options.pattern || "").padEnd(length, "_").slice(0, length);
  const correct = normalizePattern(options.correct || "").padEnd(length, "_").slice(0, length);
  const combinedPattern = correct
    .split("")
    .map((letter, index) => (letter !== "_" ? letter : pattern[index] || "_"))
    .join("");
  const excluded = new Set(normalizeLetters(options.excluded || "").replace(/\?/g, "").split(""));
  const includes = normalizeLetters(options.includes || "").replace(/\?/g, "");
  const misplaced = String(options.misplaced || "")
    .toUpperCase()
    .split(/[\s,;|]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [letter, pos] = item.split(":");
      return { letter: normalizeLetters(letter).replace(/\?/g, "")[0], index: Number(pos) - 1 };
    })
    .filter((item) => item.letter && Number.isInteger(item.index));
  const requiredCounts = letterCounts(includes + misplaced.map((item) => item.letter).join(""));

  return normalizeWords(words)
    .filter((word) => word.length === length)
    .filter((word) => {
      for (let i = 0; i < combinedPattern.length; i++) {
        const letter = combinedPattern[i];
        if (letter !== "_" && word[i] !== letter) return false;
      }
      if (!hasAtLeastCounts(word, requiredCounts)) return false;
      for (const item of misplaced) {
        if (!word.includes(item.letter)) return false;
        if (item.index >= 0 && word[item.index] === item.letter) return false;
      }
      for (const letter of excluded) {
        if (!requiredCounts.has(letter) && word.includes(letter)) return false;
      }
      return true;
    })
    .sort((a, b) => scoreCommonWord(b) - scoreCommonWord(a) || a.localeCompare(b));
}

function scoreCommonWord(word) {
  const common = "ETAOINSHRDLU";
  return word.split("").reduce((score, letter, index) => score + Math.max(1, 12 - common.indexOf(letter)) / (index + 1), 0);
}

export function solveSpellingBee(words, options = {}) {
  const center = normalizeLetters(options.center || "").replace(/\?/g, "")[0] || "";
  const outer = normalizeLetters(options.outer || "").replace(/\?/g, "").slice(0, 6);
  const allowed = new Set((center + outer).split("").filter(Boolean));
  if (!center || allowed.size < 2) return [];

  return normalizeWords(words)
    .filter((word) => word.length >= 4)
    .filter((word) => word.includes(center))
    .filter((word) => word.split("").every((letter) => allowed.has(letter)))
    .map((word) => {
      const unique = new Set(word.split(""));
      const pangram = Array.from(allowed).every((letter) => unique.has(letter));
      const score = pangram ? Math.max(7, word.length) + 7 : word.length === 4 ? 1 : word.length;
      return { word, score, pangram, length: word.length };
    })
    .sort((a, b) => b.score - a.score || b.length - a.length || a.word.localeCompare(b.word));
}

export function solveAnagrams(words, options = {}) {
  const letters = normalizeLetters(options.letters || "");
  const minLength = Number(options.minLength || 2);
  const maxLength = Number(options.maxLength || 20);
  const required = normalizeLetters(options.required || "").replace(/\?/g, "");
  const startsWith = normalizeLetters(options.startsWith || "").replace(/\?/g, "");
  const endsWith = normalizeLetters(options.endsWith || "").replace(/\?/g, "");
  const wildcards = (letters.match(/\?/g) || []).length;
  const availableCounts = letterCounts(letters);

  return normalizeWords(words)
    .filter((word) => word.length >= minLength && word.length <= maxLength)
    .filter((word) => !required || hasAtLeastCounts(word, letterCounts(required)))
    .filter((word) => !startsWith || word.startsWith(startsWith))
    .filter((word) => !endsWith || word.endsWith(endsWith))
    .filter((word) => {
      const needed = letterCounts(word);
      let missing = 0;
      for (const [letter, count] of needed.entries()) {
        missing += Math.max(0, count - (availableCounts.get(letter) || 0));
      }
      return missing <= wildcards;
    })
    .sort((a, b) => b.length - a.length || a.localeCompare(b));
}

export function explainWordleLogic(options = {}) {
  const parts = [];
  if (options.pattern || options.correct) parts.push("matches fixed letter positions");
  if (options.includes || options.misplaced) parts.push("keeps required letters");
  if (options.excluded) parts.push("removes excluded letters unless they are also required");
  return parts.length ? `The solver ${parts.join(", ")}.` : "The solver is ready for a pattern, included letters, and excluded letters.";
}
