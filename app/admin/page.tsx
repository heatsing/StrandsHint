import { redirect } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/auth";

export default function AdminPage() {
  redirect(isAdminLoggedIn() ? "/admin/puzzles" : "/admin/login");
}
