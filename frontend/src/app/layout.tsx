import type { Metadata } from "next";
import { Inter,Noto_Sans } from "next/font/google";


const noto = Noto_Sans({ 
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "W3T",
  description: "W3Tilang",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={noto.className}>{children}</body>
    </html>
  );
}
