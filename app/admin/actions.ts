"use server";

import { redirect } from "next/navigation";
import { clearAdminCookie, setAdminCookie } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { normalizePuzzleInput, puzzleSchema } from "@/lib/validation";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") || "");
  if (password !== (process.env.ADMIN_PASSWORD || "change-me")) {
    redirect("/admin/login?error=1");
  }
  setAdminCookie();
  redirect("/admin/puzzles");
}

export async function logoutAction() {
  clearAdminCookie();
  redirect("/admin/login");
}

export async function savePuzzleAction(formData: FormData) {
  const id = String(formData.get("id") || "");
  const raw = {
    date: String(formData.get("date") || ""),
    puzzleNumber: String(formData.get("puzzleNumber") || ""),
    title: String(formData.get("title") || ""),
    themeHint: String(formData.get("themeHint") || ""),
    difficulty: String(formData.get("difficulty") || "MEDIUM"),
    spangram: String(formData.get("spangram") || ""),
    spangramHint1: String(formData.get("spangramHint1") || ""),
    spangramHint2: String(formData.get("spangramHint2") || ""),
    spangramDirection: String(formData.get("spangramDirection") || ""),
    words: String(formData.get("words") || ""),
    wordHints: String(formData.get("wordHints") || ""),
    spoilerLevelContent: String(formData.get("spoilerLevelContent") || ""),
    seoTitle: String(formData.get("seoTitle") || ""),
    seoDescription: String(formData.get("seoDescription") || ""),
    slug: String(formData.get("slug") || ""),
    published: formData.get("published") === "on",
  };

  const parsed = puzzleSchema.parse(raw);
  const data = normalizePuzzleInput(parsed);

  if (id) {
    await prisma.puzzle.update({ where: { id: Number(id) }, data });
  } else {
    await prisma.puzzle.create({ data });
  }
  redirect("/admin/puzzles");
}

export async function togglePublishedAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const published = String(formData.get("published")) === "true";
  await prisma.puzzle.update({ where: { id }, data: { published: !published } });
  redirect("/admin/puzzles");
}
