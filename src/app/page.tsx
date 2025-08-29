import Image from "next/image";
import { Lato } from "next/font/google";
import TreeAnimation from "@/components/TreeAnimation/TreeAnimationComponent";
import TechIcon from "@/components/TechIcon";
import LinkButton from "@/components/LinkButton";

const latoNormal = Lato({
  weight: "400",
  subsets: ["latin"],
});

const latoLight = Lato({
  weight: "300",
  subsets: ["latin"],
});

export default async function Home() {
  return (
    <main
      className={`w-full h-full relative bg-gradient-to-b from-gray-50 to-gray-200 ${latoNormal.className} overflow-auto`}
    >
      <div className="grid grid-rows-[auto_1fr] p-6 lg:p-8 xl:p-16 gap-8 h-full relative z-10">
        <div className="">
          <div className="grid grid-cols-[auto_1fr] gap-6 items-center">
            <div className="rounded-full w-16 h-16 lg:w-24 lg:h-24 overflow-hidden bg-white border-grey border">
              <Image
                src="/me.png"
                alt="Delano"
                width={94 * 2}
                height={94 * 2}
              />
            </div>

            <div
              className={`text-2xl uppercase font-thin tracking-widest ${latoLight.className}`}
            >
              <span className="text-primary-light">Delano</span>
              &nbsp;
              <span className="text-light-gray">Flipse</span>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div>
            <div
              className={`text-6xl leading-tight tracking-wide font-semibold`}
            >
              <div className="text-primary">Software Engineer,</div>
              <div className="text-grayish">Web Developer.</div>
            </div>

            <div className="flex flex-wrap my-6 lg:mt-8 gap-4 xl:gap-6">
              <TechIcon icon="/icons/typescript.svg" name="TypeScript" />
              <TechIcon icon="/icons/react.svg" name="React" />
              <TechIcon icon="/icons/flutter.svg" name="Flutter" />
              <TechIcon icon="/icons/python.svg" name="Python" />
              <TechIcon icon="/icons/c.svg" name="C" />
              {/* <TechIcon icon="/icons/cpp.svg" name="C++" /> */}
              <TechIcon icon="/icons/go.svg" name="Go" />
              <TechIcon icon="/icons/java.svg" name="Java" />
            </div>

            <div className="mt-8">
              <LinkButton href="https://github.com/delanoflipse" variant="primary"
                icon={
                  <Image
                    src="./icons/github_white.svg"
                    alt="github"
                    width={24}
                    height={24}
                    className='object-contain w-full h-full text-white'
                  />}
              >
                GitHub
              </LinkButton>
            </div>
          </div>
        </div>

        <div>
          <span className="text-gray-600">
            &copy; {new Date().getFullYear()} Delano Flipse
          </span>
        </div>
      </div>

      <div className="fixed z-0 right-0 bottom-0 left-0 top-0">
        <TreeAnimation />
      </div>
    </main>
  );
}
