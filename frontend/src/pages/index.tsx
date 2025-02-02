import React from "react";
import styles from "../../styles/index.module.css";
import { Box, Button, Grid, Stack, Text } from "@mantine/core";
import Image from "next/image";

import ReportFormDialog from "@app/components/ReportFormDialog/ReportFormDialog";
import { GREEN_PRIMARY } from "@app/constants/colors";
import { modals } from "@mantine/modals";
import { useCanister } from "@app/contexts/CanisterContext";
import { notifications } from "@mantine/notifications";
import { IconBrandChrome } from "@tabler/icons-react";

export default function HomePage() {
  const { w3tActor, requestConnect, principalId } = useCanister();
  console.log(principalId)
  const DetectBrowser = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (
      userAgent.indexOf("chrome") > -1 &&
      userAgent.indexOf("edge") === -1 &&
      userAgent.indexOf("safari") > -1
    ) {
      return "chrome";
    } else if (userAgent.indexOf("firefox") > -1) {
      return "firefox";
    } else if (userAgent.indexOf("edge") > -1) {
      return "edge";
    } else if (userAgent.indexOf("safari") > -1) {
      return "safari";
    } else {
      return "other";
    }
  }

  const checkConnect = async () => {
    const browser = DetectBrowser();

    switch (browser) {
      case "chrome":
      case "edge":
        // Chrome and Edge extension check
        try {
          requestConnect();
        } catch (error) {
          console.log("Failed to connect to canister:", error);
        }
        break;

      case "firefox":
        // Firefox extension check
        notifications.show({
          title: "Extension Not Available!",
          message: "Please Use Either Edge or Chrome!",
          color: "transparent",
          icon: <IconBrandChrome />,
        });
        break;

      case "safari":
        // Safari extension check
        notifications.show({
          title: "Extension Not Available!",
          message: "Please Use Either Edge or Chrome!",
          color: "transparent",
          icon: <IconBrandChrome />,
        });
        break;

      default:
        console.log("Unsupported browser or extension cannot be detected");
    }
  };

  const openModalForm = () => modals.open({
    title: 'Report Form',
    children: (
      <ReportFormDialog />
    ),
    size: 'lg',
    centered: true,
  });

  const openModalConfirmation = () => modals.openConfirmModal({
    title: 'Connect Wallet',
    children: (
      <Text size="sm" mb={40}>
        You Need to Connect Your Wallet First!
      </Text>
    ),
    labels: { confirm: 'Connect', cancel: 'Cancel' },
    confirmProps: { fullWidth: true, color: GREEN_PRIMARY },
    cancelProps: { display: "none" },
    onConfirm: async () => checkConnect,
    centered: true,
  })
  
  return (
    <Box className={styles.allContainer}>
      <Box className={"bg"}></Box>
      <Box className="centerContainer">
        <Grid
          style={{
            paddingTop:"100px"
          }}
        >
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <Stack
              align="flex-start"
              justify="space-between"
              gap="md"
              h={"100%"}
            >
              <Stack
                align="stretch"
                justify="flex-start"
                gap="md"
              >
                <Box className={styles.title}>
                  Web3 Tilang
                </Box>
                <Box className={styles.subTitle}>
                  Project Description
                </Box>
              </Stack>
              <Button
                variant="filled"
                color={GREEN_PRIMARY}
                onClick={() => { 
                  if(w3tActor){
                    openModalForm()
                  }else{
                    openModalConfirmation()
                  }
                }}
              >
                Upload Your Evidence
              </Button>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <Box className={styles.imageContainer}>
              <Image 
                src={"/home1.webp"}
                width={300}
                alt="home1"
                style={{
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2),0 6px 20px rgba(0, 0, 0, 0.19)",
                  borderRadius: "10px"
                }}
                height={300}
              />
            </Box>
          </Grid.Col>
        </Grid>
        <Grid
          style={{
            marginTop:"100px"
          }}
        >
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Box className={styles.imageContainer}>
                <Image 
                  src={"/home2.webp"}
                  width={300}
                  alt="W"
                  height={337}
                />
              </Box>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Stack
                align="flex-start"
                justify="space-between"
                gap="md"
                h={"100%"}
              >
                <Stack
                  align="stretch"
                  justify="flex-start"
                  gap="md"
                >
                  <Box className={styles.title}>
                    W3T Token
                  </Box>
                  <Box  className={styles.subTitle}>
                    Why W3T Description
                  </Box>
                </Stack>
                <Button
                  variant="filled"
                  color={GREEN_PRIMARY}
                >
                  Get Yours
                </Button>
              </Stack>
            </Grid.Col>
        </Grid>
      </Box>
    </Box>
  );
}
