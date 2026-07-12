import { useRouter } from "next/navigation";

export default function RedirectionPage() {
  const router = useRouter();

  return router.push("/auth/signin");
}