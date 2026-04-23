import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import MotionRoot from "@/components/motion/MotionRoot";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BHEARD | Kinetic AI-Powered Agency",
  description:
    "We help businesses get more customers through smart marketing, better branding, and high-performing ads.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${manrope.variable}`}>
      <body className="bg-surface text-on-surface font-body">
        <MotionRoot>{children}</MotionRoot>
      </body>
    </html>
  );
}
