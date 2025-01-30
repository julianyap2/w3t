import "@mantine/core/styles.css";
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css'; //if using mantine date picker features
import 'mantine-react-table/styles.css';
import "../../../styles/global.css";
import type { AppProps } from "next/app";

import { Client, InternetIdentity } from "@bundly/ares-core";
import { IcpConnectContextProvider } from "@bundly/ares-react";

import { candidCanisters } from "@app/canisters";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import { theme } from "../../theme";
import Layout from "../components/Layout/Layout";

export default function MyApp({ Component, pageProps }: AppProps) {
  const client = Client.create({
    agentConfig: {
      host: process.env.NEXT_PUBLIC_IC_HOST_URL!,
    },
    candidCanisters,
    providers: [
      new InternetIdentity({
        providerUrl: process.env.NEXT_PUBLIC_INTERNET_IDENTITY_URL!,
      }),
    ],
  });

  return (
    <IcpConnectContextProvider client={client}>
      <MantineProvider defaultColorScheme="dark" theme={theme}>
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
      </MantineProvider>
    </IcpConnectContextProvider>
  );
}
