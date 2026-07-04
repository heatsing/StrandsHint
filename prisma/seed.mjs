import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const today = new Date();
today.setHours(12, 0, 0, 0);

await prisma.puzzle.upsert({
  where: { slug: "sample-strands-helper-puzzle" },
  update: {},
  create: {
    date: today,
    puzzleNumber: 1,
    title: "Sample Strands Helper Puzzle",
    themeHint: "Things you might pack for a sunny picnic.",
    difficulty: "MEDIUM",
    spangram: "PICNICBASKET",
    spangramHint1: "It can hold the whole meal.",
    spangramHint2: "Two words, often carried by a handle.",
    spangramDirection: "left to right",
    words: JSON.stringify(["BLANKET", "LEMONADE", "NAPKINS", "SANDWICH", "SUNSCREEN"]),
    wordHints: JSON.stringify([
      "Something to sit on.",
      "A sweet drink.",
      "Useful for cleanup.",
      "The main bite.",
      "Helpful on a bright day."
    ]),
    spoilerLevelContent:
      "This is fictional seed content for local development. Replace it from the admin area with manually entered puzzle notes.",
    seoTitle: "Sample Strands Hints and Answers",
    seoDescription:
      "A fictional sample puzzle for testing Strands Hint without copying official puzzle content.",
    slug: "sample-strands-helper-puzzle",
    published: true,
  },
});

await prisma.$disconnect();
