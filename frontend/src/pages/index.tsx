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
            paddingTop:"80px"
          }}
        >
          <Grid.Col span={{ base: 8 }}>
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
                mr={"3rem"}
              >
                <Box className={styles.title}>
                  Report & Earn !
                </Box>
                <Box className={styles.subTitle}>
                  Our app W3T stands for Web3 Tilang, empowers citizens to report traffic violations securely on-chain. Verified reports approved by law enforcement earn rewards, ensuring a transparent, tamper-proof, and incentivized system for safer roads. Take action, drive change!
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
                mt={"2rem"}
              >
                Upload Your Evidence
              </Button>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 4 }} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end"}}>
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
            <Grid.Col span={{ base: 4 }} style={{ display: "flex", alignItems: "center" }}>
              <Box className={styles.imageContainer}>
                <Image 
                  src={"/home2.webp"}
                  width={300}
                  alt="W"
                  height={337}
                />
              </Box>
            </Grid.Col>
            <Grid.Col span={{ base: 8 }}>
              <Stack
                align="flex-start"
                justify="space-between"
                gap="md"
                
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
                  W3T is our native token built on the ICP blockchain, designed to ensure credible and honest traffic violation reports. Users must stake W3T before submitting a report, preventing spam and false claims. 
                  </Box>
                </Stack>
                <Button
                  variant="filled"
                  color={GREEN_PRIMARY}
                  mt={"2rem"}
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
