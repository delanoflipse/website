"use client";

import "./global.css";

import Image from "next/image";
import { Comic_Neue } from "next/font/google";
import { createTurfForEvent, getLatestTurfForEvent } from "@/lib/turf";
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

const EVENT_NAME = "despachito";

const comicNeue = Comic_Neue({
  weight: "700",
  subsets: ["latin"],
});

const Button = ({ children, onClick }: any) => {
  return (
    <button
      className={`p-2 px-8 shadow-sm font-bold ${comicNeue.className} border-black border-[3px]  hover:bg-black hover:text-white text-xl`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

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
    <main className="w-full h-full bg-wack-1 overflow-auto">
      {toggle && (
        <div className="absolute z-30 left-0 top-0 bottom-0 right-0 bg-wack-2 flex p-8 items-center flex-col justify-center gap-8">
          <div
            className={`text-5xl lg:text-7xl ${comicNeue.className} text-center uppercase`}
          >
            Is het weer zo ver?
          </div>

          <div className="flex gap-4">
            <Button onClick={onClick}>Ja</Button>
            <Button onClick={() => setToggle(false)}>Nee</Button>
          </div>
        </div>
      )}

      {!loading && lastTimes != null && (
        <div className="w-full min-h-full flex justify-center flex-col">
          <div
            className={`flex flex-col items-center justify-center text-center gap-4 p-8 ${comicNeue.className}`}
          >
            <div>
              <div className="text-4xl md:text-6xl lg:text-7xl uppercase mb-8 h-full bg-[green] border-[yellow] border-4">
                <div className="p-10">
                  <div className="wack-text block">
                    Het laatste despacito incident was:
                  </div>
                </div>
              </div>
            </div>

            <div className="text-3xl p-8 px-16 bg-[blue] text-[yellow]">
              {now.to(lastTimes)}
            </div>
          </div>

          <div className="mx-auto flex justify-center p-8">
            <div
              className="flex justify-center cursor-pointer flex-wrap gap-4"
              onClick={() => setToggle(true)}
            >
              <div className="flex-shrink-1 max-w-[160px] md:max-w-[320px] w-full">
                <Image
                  alt="zocool"
                  src="/meuk/zocool.gif"
                  width={320}
                  height={267}
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "auto",
                  }}
                  className="select-none"
                />
              </div>
              <div className="flex-shrink-1 max-w-[175px] md:max-w-[271px] w-full">
                <Image
                  alt="genieton"
                  src="/meuk/genieton.gif"
                  width={271}
                  height={350}
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "auto",
                  }}
                  className="select-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
