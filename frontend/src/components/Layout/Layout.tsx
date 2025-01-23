import { Box } from "@mantine/core"
import { HeaderMegaMenu } from "../HeaderMegaMenu/HeaderMegaMenu"


const Layout = ({children} : {children : any}) => {

    return(
        <Box>
            <HeaderMegaMenu/>
            {children}
        </Box>
    )
}

export default Layout