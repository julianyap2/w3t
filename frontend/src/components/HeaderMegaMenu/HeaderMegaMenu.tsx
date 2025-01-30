import {
    IconBook,
    IconBrandChrome,
    IconBrandEdge,
    IconChartPie3,
    IconChevronDown,
    IconCode,
    IconCoin,
    IconFingerprint,
    IconNotification,
  } from '@tabler/icons-react';
  import {
    Anchor,
    Box,
    Burger,
    Button,
    Center,
    Collapse,
    Divider,
    Drawer,
    Group,
    HoverCard,
    ScrollArea,
    SimpleGrid,
    Text,
    ThemeIcon,
    UnstyledButton,
    useMantineTheme,
  } from '@mantine/core';
  import { useDisclosure } from '@mantine/hooks';
  import classes from './HeaderMegaMenu.module.css';
import { InternetIdentityButton } from '@bundly/ares-react';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';
  
  const mockdata = [
    {
      icon: IconCode,
      title: 'Open source',
      description: 'This Pokémon’s cry is very loud and distracting',
    },
    {
      icon: IconCoin,
      title: 'Free for everyone',
      description: 'The fluid of Smeargle’s tail secretions changes',
    },
    {
      icon: IconBook,
      title: 'Documentation',
      description: 'Yanma is capable of seeing 360 degrees without',
    },
    {
      icon: IconFingerprint,
      title: 'Security',
      description: 'The shell’s rounded shape and the grooves on its.',
    },
    {
      icon: IconChartPie3,
      title: 'Analytics',
      description: 'This Pokémon uses its flying ability to quickly chase',
    },
    {
      icon: IconNotification,
      title: 'Notifications',
      description: 'Combusken battles with the intensely hot flames it spews',
    },
  ];
  
  export function HeaderMegaMenu() {
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
    const theme = useMantineTheme();
    const router = useRouter()
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
      if (userAgent.indexOf('chrome') > -1 && userAgent.indexOf('edge') === -1 && userAgent.indexOf('safari') > -1) {
        return 'chrome';
      } else if (userAgent.indexOf('firefox') > -1) {
        return 'firefox';
      } else if (userAgent.indexOf('edge') > -1) {
        return 'edge';
      } else if (userAgent.indexOf('safari') > -1) {
        return 'safari';
      } else {
        return 'other';
      }
    }
    const handleClick = async() => {
      const browser = detectBrowser();
      
      switch (browser) {
        case 'chrome':
        case 'edge':
          // Chrome and Edge extension check
          try {
            // router.reload();
            if(window.ic){
              if(window.ic.infinityWallet.isConnected()){

              }else{
                window.ic.infinityWallet.requestConnect();
              }
            }else{
              window.open("https://chromewebstore.google.com/detail/bitfinity-wallet/jnldfbidonfeldmalbflbmlebbipcnle", "_blank")
            }
            // await chrome.runtime.sendMessage('jnldfbidonfeldmalbflbmlebbipcnle', { type: 'checkExtension' }, (response) => {
            //   if (response && response.exists) {
            //     console.log(`${browser} extension is installed`);
            //   } else {
            //     console.log(`${browser} extension is not installed1`);
            //   }
            // });
          } catch (error) {
            console.log(`${browser} extension is not installed`);
          }
          break;
    
        case 'firefox':
          // Firefox extension check
          notifications.show({
            title: 'Extension Not Available!',
            message: 'Please Use Either Edge or Chrome!',
            color: "transparent",
            icon: <IconBrandChrome/>
          })
          break;
    
        case 'safari':
          // Safari extension check
          notifications.show({
            title: 'Extension Not Available!',
            message: 'Please Use Either Edge or Chrome!',
            color: "transparent",
            icon: <IconBrandChrome/>
          })
          break;
    
        default:
          console.log('Unsupported browser or extension cannot be detected');
      }
      
  }
  
    return (
      <Box 
        style={{
          zIndex:"9000",
          background: "black"
        }}
      >
        <header className={classes.header}>
          <Group justify="space-between" h="100%">
            {/* <MantineLogo size={30} /> */}
                W3T
            <Group h="100%" gap={0} visibleFrom="sm">
              {/* <a href="#" className={classes.link}>
                Home
              </a>
              <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
                <HoverCard.Target>
                  <a href="#" className={classes.link}>
                    <Center inline>
                      <Box component="span" mr={5}>
                        Features
                      </Box>
                      <IconChevronDown size={16} color={theme.colors.blue[6]} />
                    </Center>
                  </a>
                </HoverCard.Target>
  
                <HoverCard.Dropdown style={{ overflow: 'hidden' }}>
                  <Group justify="space-between" px="md">
                    <Text fw={500}>Features</Text>
                    <Anchor href="#" fz="xs">
                      View all
                    </Anchor>
                  </Group>
  
                  <Divider my="sm" />
  
                  <SimpleGrid cols={2} spacing={0}>
                    {links}
                  </SimpleGrid>
  
                  <div className={classes.dropdownFooter}>
                    <Group justify="space-between">
                      <div>
                        <Text fw={500} fz="sm">
                          Get started
                        </Text>
                        <Text size="xs" c="dimmed">
                          Their food sources have decreased, and their numbers
                        </Text>
                      </div>
                      <Button variant="default">Get started</Button>
                    </Group>
                  </div>
                </HoverCard.Dropdown>
              </HoverCard>
              <a href="#" className={classes.link}>
                Learn
              </a>
              <a href="#" className={classes.link}>
                Academy
              </a> */}
            </Group>
  
            <Group visibleFrom="sm">
              {/* <InternetIdentityButton>
                Connect
              </InternetIdentityButton> */}
              <Button
                onClick={handleClick}
                className={classes.buttonConnect}
                w={200}
              >
                Connect
              </Button>
            </Group>
  
            <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
          </Group>
        </header>
  
        <Drawer
          opened={drawerOpened}
          onClose={closeDrawer}
          size="100%"
          padding="md"
          title="Navigation"
          hiddenFrom="sm"
          zIndex={1000000}
        >
          <ScrollArea h="calc(100vh - 80px" mx="-md">
            {/* <Divider my="sm" />
  
            <a href="#" className={classes.link}>
              Home
            </a>
            <UnstyledButton className={classes.link} onClick={toggleLinks}>
              <Center inline>
                <Box component="span" mr={5}>
                  Features
                </Box>
                <IconChevronDown size={16} color={theme.colors.blue[6]} />
              </Center>
            </UnstyledButton>
            <Collapse in={linksOpened}>{links}</Collapse>
            <a href="#" className={classes.link}>
              Learn
            </a>
            <a href="#" className={classes.link}>
              Academy
            </a>
  
            <Divider my="sm" /> */}
  
            <Group justify="center" grow pb="xl" px="md">
              <Button
                onClick={handleClick}
                className={classes.buttonConnect}
              >
                Connect
              </Button>
                {/* <InternetIdentityButton>
                  Connect
                </InternetIdentityButton> */}
            </Group>
          </ScrollArea>
        </Drawer>
      </Box>
    );
  }