import {
  Anchor,
  Avatar,
  Box,
  Burger,
  Button,
  Center,
  Collapse,
  Divider,
  Drawer,
  Group,
  HoverCard,
  Menu,
  Popover,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconBook,
  IconBrandChrome,
  IconBrandEdge,
  IconChartPie3,
  IconChevronDown,
  IconCode,
  IconCoin,
  IconCoins,
  IconFingerprint,
  IconLogout2,
  IconNotification,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { InternetIdentityButton } from "@bundly/ares-react";

import { GREEN_PRIMARY } from "@app/constants/colors";
import { useCanister } from "@app/contexts/CanisterContext";

import classes from "./HeaderMegaMenu.module.css";

const mockdata = [
  {
    icon: IconCode,
    title: "Open source",
    description: "This Pokémon’s cry is very loud and distracting",
  },
  {
    icon: IconCoin,
    title: "Free for everyone",
    description: "The fluid of Smeargle’s tail secretions changes",
  },
  {
    icon: IconBook,
    title: "Documentation",
    description: "Yanma is capable of seeing 360 degrees without",
  },
  {
    icon: IconFingerprint,
    title: "Security",
    description: "The shell’s rounded shape and the grooves on its.",
  },
  {
    icon: IconChartPie3,
    title: "Analytics",
    description: "This Pokémon uses its flying ability to quickly chase",
  },
  {
    icon: IconNotification,
    title: "Notifications",
    description: "Combusken battles with the intensely hot flames it spews",
  },
];

export function HeaderMegaMenu({ client }: { client: any }) {
  const { requestConnect, principalId, w3tActor } = useCanister();
  const [menuOpen, setMenuOpen] = useState(false);

  const [opened, { close, open }] = useDisclosure(false);
  const theme = useMantineTheme();
  const router = useRouter();
  const links = mockdata.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={22} color={theme.colors.blue[6]} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  function detectBrowser() {
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

  const handleClick = async () => {
    const browser = detectBrowser();

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

  const handleClickReportList = () => {
    if (w3tActor) {
      router.push("/list-report");
    } else {
      openModalConfirmation();
    }
  };

  return (
    <Box
      style={{
        zIndex: "9000",
        background: "black",
      }}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          {/* <MantineLogo size={30} /> */}
          W3T
          <Group h="100%" gap={0} visibleFrom="sm"></Group>
          <Group>
            <Text 
              onClick={handleClickReportList}
              style={{
                cursor: "pointer"
              }}
            >
              Report List
            </Text>
            {principalId === "" ? 
            <Button 
              onClick={handleClick} 
              className={classes.buttonConnect} 
              w={200}
            >
              Connect
            </Button> :

            <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: 'pop-top-right' }}
            onClose={() => setMenuOpen(false)}
            onOpen={() => setMenuOpen(true)}
            withinPortal
            trigger="click-hover"
          >
            <Menu.Target>
              <Button
                  className={classes.buttonConnect} 
                  w={200}
              >
                {principalId.slice(0, 5)}...{principalId.slice(-5)}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>
                <Stack
                  align="stretch"
                  justify="center"
                  gap="md"
                  h={100}
                >
                  <Text ta={"center"}>My W3T</Text>
                  <Group gap={6} justify="center">
                    <Text fw={500} fz={"2rem"} lh={1} mr={3}>
                      000 
                    </Text>
                    <Avatar 
                      src={"/placeholder.webp"}
                      alt="w3t-icon"
                      radius={"xl"}
                      size={40}
                    />
                  </Group>
                </Stack>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<IconCoins size={16} stroke={1.5} />}>
                Deposit
              </Menu.Item>
              <Menu.Item leftSection={<IconLogout2 size={16} stroke={1.5} />}>
                Disconnect
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
            }
            
          </Group>
        </Group>
      </header>
    </Box>
  );
}
