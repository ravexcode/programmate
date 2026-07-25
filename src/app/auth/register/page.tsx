import { redirect } from "next/navigation";

export default function RedirectionPage() {
  redirect("/auth/signup");
}
