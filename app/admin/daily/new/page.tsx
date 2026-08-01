import type { Metadata } from "next";
import { AdminDailyContentForm } from "@/components/AdminDailyContentForm";

export const metadata: Metadata = {
  title: "New Daily SEO JSON Entry",
  robots: { index: false, follow: false },
};

export default function NewDailyContentPage() {
  return (
    <section className="rounded-2xl bg-[#12172B] text-[#F6F1E6]">
      <h1 className="font-serif text-4xl font-black">Generate a daily SEO JSON entry</h1>
      <p className="mt-4 max-w-3xl leading-7 text-[#F6F1E6]/70">
        This static helper creates one object for <code>data/daily-content.json</code>. It does not
        save data from the browser.
      </p>
      <div className="mt-8">
        <AdminDailyContentForm />
      </div>
    </section>
  );
}
