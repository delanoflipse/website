"use client";
import Image from "next/image";
import { Inter, Lato } from "next/font/google";
import ResetButton from "@/components/ResetButton";
import { TurfEvent, createTurfForEvent, getLatestTurfForEvent } from "@/lib/turf";
import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/nl";

dayjs.extend(utc);
dayjs.locale("nl");
dayjs.extend(timezone);
dayjs.extend(relativeTime);

// const inter = Inter({ subsets: ["latin"] });

const EVENT_NAME = "paay";


const latoSemiBold = Lato({
  weight: "700",
  subsets: ["latin"],
});

const Button = ({ children, onClick }: any) => {
  return <button className={`p-2 px-8 rounded-full shadow-sm font-bold ${latoSemiBold.className} text-lg border-black border-4 hover:bg-black hover:text-white`} onClick={onClick}>
    {children}
  </button>
}

export default function Home() {
  const [lastTimes, setLastTimes] = useState<dayjs.Dayjs | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggle, setToggle] = useState(false);

  const updateLastTimes = useCallback(async () => {
    setLoading(true);
    const turf = await getLatestTurfForEvent(EVENT_NAME);
    setLastTimes(dayjs(turf?.time));
    setLoading(false);
  }, []);

  // Fetch initial value on mount
  useEffect(() => {
    updateLastTimes();
  }, [updateLastTimes]);

  const onClick = async () => {
    await createTurfForEvent(EVENT_NAME);
    setLastTimes(dayjs());
    setToggle(false);
  };

  const now = dayjs();

  return (
    <main className="w-full h-full">
      {toggle && <div className="absolute z-30 left-0 top-0 bottom-0 right-0 bg-[yellow] flex p-8 items-center flex-col justify-center">
        <div className={`text-3xl md:text-5xl lg:text-6xl ${latoSemiBold.className} mb-8`}>Is het weer zo ver?</div>
        <div className="flex gap-4">
          <Button onClick={onClick}>Ja</Button>
          <Button onClick={() => setToggle(false)}>Nee</Button>
        </div>
      </div>}

      {!loading && lastTimes != null && (
        <div className="w-full h-full grid grid-rows-[1fr_auto]">
          <div className={`flex-1 flex flex-col items-center justify-center text-center gap-4 p-8 ${latoSemiBold.className}`}>
            <div className="text-4xl md:text-6xl lg:text-7xl uppercase mb-2 lg:mb-8">Het laatste paay incident was:</div>
            <div className="text-3xl md:text-5xl lg:text-6xl text-yellow-500">{now.to(lastTimes)}</div>
          </div>
          <div className="w-full flex justify-center px-4">
            <div className="w-full max-w-[500px] aspect-[500/379] relative">
              <Image
                alt="paay"
                src="/meuk/paay.png"
                fill
                style={{ objectFit: "contain" }}
                sizes="(max-width: 500px) 100vw, 500px"
              />

              <button
                type="button"
                className="absolute left-[35%] right-[35%] top-[5%] bottom-[45%] cursor-pointer bg-transparent border-none p-0"
                onClick={() => setToggle(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setToggle(true);
                  }
                }}
                tabIndex={0}
                style={{ outline: "none" }}
              >
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
