import type { Metadata } from "next";
import { loginAction } from "../actions";

export const metadata: Metadata = { title: "Admin Login" };

export default function AdminLoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-950">Admin login</h1>
      <p className="mt-2 text-sm text-slate-600">Enter the password from ADMIN_PASSWORD.</p>
      {searchParams.error ? <p className="mt-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700">Wrong password.</p> : null}
      <form action={loginAction} className="mt-5 space-y-4">
        <input
          name="password"
          type="password"
          className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-800"
          placeholder="Password"
        />
        <button className="w-full rounded-md bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-700">
          Log in
        </button>
      </form>
    </div>
  );
}
