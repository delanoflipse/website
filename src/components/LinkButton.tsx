import Link from "next/link";
import React, { useMemo } from "react";

type LinkButtonProps = Readonly<{
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "dark" | "light";
  icon?: React.ReactNode;
}>;

export default function LinkButton({
  href,
  children,
  variant = "light",
  icon = null,
}: LinkButtonProps) {
  const styling = useMemo(() => {
    switch (variant) {
      case "primary":
        return "bg-primary-light text-white group-hover:bg-primary";
      case "secondary":
        return "bg-gray-200 text-gray-800 group-hover:bg-gray-300";
      case "dark":
        return "bg-gray-800 text-white group-hover:bg-gray-700";
      case "light":
        return "bg-white text-gray-800 group-hover:bg-gray-100";
    }
  }, [variant]);

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block p-4 -m-4 group"
    >
      <button
        className={`p-2 pr-6 rounded-full shadow-sm font-semibold text-md ${styling} flex items-center gap-2 transition-colors duration-200`}
      >
        {icon && <span className="w-8 h-8">{icon}</span>}
        {children}
      </button>
    </Link>
  );
}
