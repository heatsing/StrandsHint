import Link from "next/link";
import { dailyAnswerGames } from "@/lib/daily-answers";

const switcherItems = [
  { href: "/todays-strands-answer/", label: "Strands", key: "strands" },
  ...dailyAnswerGames.map((game) => ({
    href: `${game.path}/`,
    label: game.name,
    key: game.game,
  })),
];

export function DailyAnswerSwitcher({ active }: { active: string }) {
  return (
    <nav
      className="sticky top-[4.5rem] z-20 -mx-1 overflow-x-auto px-1 py-1"
      aria-label="Switch daily answer game"
    >
      <div className="flex min-w-max justify-center gap-1.5 rounded-2xl border border-[#E5DED3] bg-[#FFFDF9]/95 p-1.5 shadow-sm backdrop-blur">
        {switcherItems.map((item) => {
          const isActive = item.key === active;
          return (
            <Link
              key={item.key}
              prefetch={false}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={[
                "rounded-xl px-3 py-2 text-sm font-bold transition",
                isActive
                  ? "bg-[#315C4C] text-white"
                  : "text-[#68645E] hover:bg-[#EDE6DC] hover:text-[#20201E]",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
