import assert from "node:assert/strict";
import test from "node:test";
import { solveAnagrams, solveSpellingBee, solveWordle } from "../lib/word-game-solvers.js";

const words = ["APPLE", "AMPLE", "ALLEY", "BELLE", "ELECT", "ELEGANT", "ENABLE", "CABLE", "TABLE", "TRACE", "REACT", "CATER"];

test("Wordle filters by pattern and excluded letters", () => {
  const result = solveWordle(words, { length: 5, pattern: "A__LE", excluded: "M" });
  assert.deepEqual(result, ["APPLE"]);
});

test("Wordle handles repeated required letters", () => {
  const result = solveWordle(words, { length: 5, includes: "LL", excluded: "Y" });
  assert.deepEqual(result, ["BELLE"]);
});

test("Wordle does not double-count yellow letters passed as includes and misplaced", () => {
  const result = solveWordle(["DAB", "DAD", "DAY", "DCA", "CAB"], {
    length: 3,
    pattern: "D__",
    includes: "A",
    misplaced: "A:1",
    excluded: "C",
  });
  assert.deepEqual(result, ["DAB", "DAD", "DAY"]);
});

test("Spelling Bee requires the center letter", () => {
  const result = solveSpellingBee([...words, "BATCH"], { center: "E", outer: "ABLTCN" }).map((item) => item.word);
  assert.ok(result.includes("ELECT"));
  assert.ok(!result.includes("BATCH"));
});

test("Spelling Bee detects pangrams and scoring", () => {
  const result = solveSpellingBee(["ABCDEFG"], { center: "A", outer: "BCDEFG" });
  assert.equal(result[0].pangram, true);
  assert.equal(result[0].score, 14);
});

test("Anagram solver supports wildcards and required letters", () => {
  const result = solveAnagrams(words, { letters: "REACT?", minLength: 5, maxLength: 5, required: "A" });
  assert.ok(result.includes("TRACE"));
  assert.ok(result.includes("CATER"));
});

test("Anagram solver returns empty results for impossible input", () => {
  const result = solveAnagrams(words, { letters: "ZZZ", minLength: 4, maxLength: 8 });
  assert.deepEqual(result, []);
});
