import Image from "next/image";
import { Lato } from "next/font/google";
import ResetButton from "@/components/ResetButton";
import TreeAnimation from "@/components/TreeAnimation";
import TechIcon from "@/components/TechIcon";

const latoNormal = Lato({
  weight: '400',
  subsets: ['latin'],
});

const latoLight = Lato({
  weight: '300',
  subsets: ['latin'],
});

export default async function Home() {

  return (
    <main className={`w-full h-full relative bg-gradient-to-b from-gray-100 to-gray-200 ${latoNormal.className}`}>
      <div className="grid grid-rows-[auto_1fr] p-6 lg:p-8 xl:p-16 gap-8 h-full relative z-10">
        <div className="">
          <div className="grid grid-cols-[auto_1fr] gap-6 lg:gap-8 items-center">
            <div className="rounded-full w-16 h-16 overflow-hidden">
              <Image src="/me.jpg" alt="Me" width={128} height={128} />
            </div>

            <div className={`text-2xl uppercase font-thin tracking-widest ${latoLight.className}`}>
              <span className="text-primary-light">Delano</span>
              &nbsp;
              <span className="text-light-gray">Flipse</span>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div>
            <div className={`text-6xl leading-tight tracking-wide font-semibold`}>
              <div className="text-primary">Software Engineer,</div>
              <div className="text-grayish">Web Developer.</div>
            </div>

            <div className="flex flex-wrap mt-6 lg:mt-8 gap-4 xl:gap-6">
                <TechIcon icon="/icons/nodejs.svg" name="Node.js" />
                <TechIcon icon="/icons/react.svg" name="React" />
                <TechIcon icon="/icons/flutter.svg" name="Flutter" />
                <TechIcon icon="/icons/python.svg" name="Python" />
                <TechIcon icon="/icons/c.svg" name="C" />
                <TechIcon icon="/icons/cpp.svg" name="C++" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute z-0 right-0 bottom-0 left-0 top-0">
        <TreeAnimation />
      </div>

    </main>
  );
}
