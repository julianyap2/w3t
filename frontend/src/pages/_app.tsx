import "@mantine/core/styles.css";
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css'; //if using mantine date picker features
import 'mantine-react-table/styles.css';
import "../../../styles/global.css";
import type { AppProps } from "next/app";

import { ModalsProvider } from '@mantine/modals';
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import { theme } from "../../theme";
import Layout from "../components/Layout/Layout";
import { CanisterProvider } from "@app/contexts/CanisterContext";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CanisterProvider>
      <MantineProvider defaultColorScheme="dark" theme={theme}>
        <ModalsProvider>
          <Head>
            <title>W3Tilang</title>
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
            />
            <link rel="shortcut icon" href="/favicon.svg" />
          </Head>
          <Notifications />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ModalsProvider>
      </MantineProvider>
  </CanisterProvider>
  );
}
