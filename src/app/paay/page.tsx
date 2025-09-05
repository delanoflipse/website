"use client";

import Image from "next/image";
import { Lato } from "next/font/google";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/nl";
import { TurfButton } from "@/components/TurfButton";
import { useTurf } from "@/hooks/useTurf";

dayjs.extend(utc);
dayjs.locale("nl");
dayjs.extend(timezone);
dayjs.extend(relativeTime);

const EVENT_NAME = "paay";

const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function Home() {
  const [toggle, setToggle] = useState(false);

  const turf = useTurf(EVENT_NAME);

  const now = dayjs();

  const onClick = async () => {
    await turf.update();
    setToggle(false);
  };

  return (
    <main className={`w-full h-full overflow-auto ${lato.className}`}>
      {toggle && (
        <div className="absolute z-30 left-0 top-0 bottom-0 right-0 bg-[yellow] flex p-8 items-center flex-col justify-center">
          <div className={`text-3xl md:text-5xl lg:text-7xl mb-8 uppercase`}>
            Is het weer zo ver?
          </div>

          <div className="flex gap-4">
            <TurfButton onClick={onClick}>Ja</TurfButton>
            <TurfButton onClick={() => setToggle(false)}>Nee</TurfButton>
          </div>
        </div>
      )}

      {!turf.loading && turf.value != null && (
        <div className="w-full h-full grid grid-rows-[1fr_auto]">
          <div
            className={`flex-1 flex flex-col items-center justify-center text-center gap-4 p-8`}
          >
            <div className="text-4xl md:text-6xl lg:text-7xl uppercase mb-2 lg:mb-8">
              Het laatste paay incident was:
            </div>
            <div className="text-3xl md:text-5xl lg:text-6xl text-yellow-500">
              {now.to(turf.value)}
            </div>
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
              ></button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
