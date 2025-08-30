import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nobel Paaycounter",
  description: "",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
