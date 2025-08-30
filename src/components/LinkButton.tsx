import { Lato } from "next/font/google";
import Link from "next/link";
import React, { useMemo } from "react";

type LinkButtonProps = {
  href: string;
  variant?: "primary" | "secondary" | "dark" | "light";
  children: React.ReactNode;
  icon?: React.ReactNode;
};

const latoSemiBold = Lato({
  weight: "700",
  subsets: ["latin"],
});

export default function LinkButton({
  href,
  icon = null,
  variant = "light",
  children,
}: Readonly<LinkButtonProps>) {
  const styling = useMemo(() => {
    switch (variant) {
      case "primary":
        return "bg-primary-light text-white hover:bg-primary";
      case "secondary":
        return "bg-gray-200 text-gray-800 hover:bg-gray-300";
      case "dark":
        return "bg-gray-800 text-white hover:bg-gray-700";
      case "light":
        return "bg-white text-gray-800 hover:bg-gray-100";
    }
  }, [variant]);

  return (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      <button
        className={`p-2 pr-6 rounded-full shadow-sm font-semibold ${latoSemiBold.className} text-md ${styling} flex items-center gap-2 transition-colors duration-200`}
      >
        {icon && <span className="w-8 h-8">{icon}</span>}
        {children}
      </button>
    </Link>
  );
}
