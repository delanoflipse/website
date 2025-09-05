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
import { TurfButton } from "@/components/TurfButton";
import { useTurf } from "@/hooks/useTurf";

dayjs.extend(utc);
dayjs.locale("nl");
dayjs.extend(timezone);
dayjs.extend(relativeTime);

const EVENT_NAME = "despachito";

const comicNeue = Comic_Neue({
  weight: "700",
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
    <main
      className={`w-full h-full bg-wack-1 overflow-auto ${comicNeue.className}`}
    >
      {toggle && (
        <div className="absolute z-30 left-0 top-0 bottom-0 right-0 bg-wack-2 flex p-8 items-center flex-col justify-center gap-8">
          <div className={`text-5xl lg:text-7xl text-center uppercase`}>
            Is het weer zo ver?
          </div>

          <div className="flex gap-4">
            <TurfButton onClick={onClick}>Ja</TurfButton>
            <TurfButton onClick={() => setToggle(false)}>Nee</TurfButton>
          </div>
        </div>
      )}

      {!turf.loading && turf.value != null && (
        <div className="w-full min-h-full flex justify-center flex-col">
          <div
            className={`flex flex-col items-center justify-center text-center gap-4 p-8`}
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
              {now.to(turf.value)}
            </div>
          </div>

          <div className="mx-auto flex justify-center p-8">
            <button
              className="flex justify-center cursor-pointer flex-wrap gap-4"
              onClick={() => setToggle(true)}
              tabIndex={0}
              style={{ outline: "none" }}
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
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
