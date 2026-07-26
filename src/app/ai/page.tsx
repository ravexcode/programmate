//React imports
import {
  useState
} from "react";

//Next imports
import { useRouter } from "next/navigation";

//UI imports
import AiHeader from "@/components/ai/header";
import LoadingScreen from "@/components/screens/loading-screen";

//Functions imports
import {
  toggleComponent,
  useGetData
} from "@/client/ai";

//Type imports
import type { UserData } from "@/types/user.types";

export default function AiPage() {
  //NextJS setup
  const router = useRouter();

  //Values
  const [ user, setUser ] = useState<UserData>();

  //Hooks
  useGetData(setUser, router);

  return (
    user ? <LoadingScreen /> :
    <div
    className="min-h-screen bg-neutral-950 grid grid-rows-[auto_1fr_auto]">
      <AiHeader />

    </div>
  )
}