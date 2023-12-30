import Image from "next/image";
import { Inter } from "next/font/google";
import ResetButton from "@/components/ResetButton";
import { getLatestTurf } from "@/lib/db/tables/turfs";

// const inter = Inter({ subsets: ["latin"] });

const EVENT_NAME = "camper";

export default async function Home() {
  const lastTimes = await getLatestTurf(EVENT_NAME);
  console.log(lastTimes);

  return (
    <main className="">
      <ResetButton event={EVENT_NAME} />
    </main>
  );
}
