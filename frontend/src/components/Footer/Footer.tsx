import { Box, Group, Text } from "@mantine/core";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "./Footer.module.css";


const Footer = () => {

    const router = useRouter();

    return(
        <Box className={`${styles.allContainer}`}>
            <Group justify="space-between" className={styles.insideContainer}>
                <Image src={"/logo.png"} className={styles.imageFooter} width={128} height={40} alt="logoW3T" onClick={() => router.push('/')}/>
                <Text>&copy; Copyright {dayjs().year()}, All Rights Reserved by W3T</Text>
            </Group>
        </Box>
    )

}

export default Footer