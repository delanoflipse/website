import React from 'react';
import Image from 'next/image';

interface TechIconProps {
  icon: string | React.ReactElement;
  name: string;
}

export default function TechIcon({ icon, name }: TechIconProps) {
  return (
    <div className="select-none w-8 h-8 xl:w-12 xl:h-12 transition-all grayscale hover:grayscale-0" title={name}>
      {typeof icon === 'string' ? (
        <Image src={icon} alt={name}  width={48} height={48} />
      ) : (
        <div className="w-full">{icon}</div>
      )}
    </div>
  );
};
