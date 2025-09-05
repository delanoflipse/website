import React from "react";
import Image from "next/image";

type TechIconProps = Readonly<{
  icon: string | React.ReactElement;
  name: string;
}>;

export default function TechIcon({ icon, name }: TechIconProps) {
  return (
    <div
      className="select-none w-8 h-8 xl:w-12 xl:h-12 transition-all duration-200 grayscale hover:grayscale-0 flex items-center justify-center"
      title={name}
    >
      {typeof icon === "string" ? (
        <Image
          src={icon}
          alt={name}
          width={48}
          height={48}
          className="object-contain w-full h-full"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          {icon}
        </div>
      )}
    </div>
  );
}
