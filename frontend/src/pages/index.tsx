import React from "react";
import styles from "../../../styles/index.module.css";
import { Box, Button, Grid, Stack, Text } from "@mantine/core";
import Image from "next/image";

import ReportFormDialog from "@app/components/ReportFormDialog/ReportFormDialog";
import { GREEN_PRIMARY } from "@app/constants/colors";
import { modals } from "@mantine/modals";
import { useCanister } from "@app/contexts/CanisterContext";

export default function HomePage() {
  const { w3tActor, requestConnect } = useCanister();

  const openModalForm = () => modals.open({
    title: 'Report Form',
    children: (
      <ReportFormDialog  w3tActor={w3tActor}/>
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
    onConfirm: async () => requestConnect,
    centered: true,
  })
  
  return (
    <Box className={styles.allContainer}>
      <Box className="centerContainer">
        <Grid
          style={{
            paddingTop:"40px"
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
                  W3T
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
                src={"/placeholder.webp"}
                width={400}
                alt="W"
                height={200}
              />
            </Box>
          </Grid.Col>
        </Grid>
        <Grid
          style={{
            marginTop:"40px"
          }}
        >
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <Box className={styles.imageContainer}>
                <Image 
                  src={"/placeholder.webp"}
                  width={400}
                  alt="W"
                  height={200}
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
                    Why W3T
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
