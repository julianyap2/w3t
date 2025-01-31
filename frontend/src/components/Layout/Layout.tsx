import { Box } from "@mantine/core"
import { HeaderMegaMenu } from "../HeaderMegaMenu/HeaderMegaMenu"


const Layout = ({children, client} : {children : any, client: any}) => {

    return(
        <Box>
            <HeaderMegaMenu client={client}/>
            {children}
        </Box>
    )
}

export default Layout