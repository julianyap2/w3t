import { Box } from "@mantine/core";
import type { Metadata } from "next";
import { Inter, Noto_Sans } from "next/font/google";

import { HeaderMegaMenu } from "../HeaderMegaMenu/HeaderMegaMenu";
import Footer from "../Footer/Footer";

const noto = Noto_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "W3T",
  description: "W3Tilang",
};
const Layout = ({ children }: { children: any }) => {
  return (
        <Box  className={noto.className}>
          <HeaderMegaMenu />
          {children}
          <Footer />
        </Box>
  );
};

export default Layout;
