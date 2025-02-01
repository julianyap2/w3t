import { Box, Chip, Grid } from "@mantine/core"
import type { Report } from "../../declarations/w3t/w3t.did";
import dayjs from "dayjs";



const DetailReport = ({detailData} : {detailData: Report}) => {
    const statusChecker = () => {
        if("GuiltyFinePaid" in detailData.status){
            return(
                <Chip defaultChecked color="green">Guilty Fine Paid</Chip>
            )
        }else if("GuiltyWaitingForFineToBePaid" in detailData.status){
            return(
                <Chip defaultChecked color="orange">Guilty Waiting For Fine To Be Paid</Chip>
            )
        }else if("OnValidationProcess" in detailData.status){
            return(
                <Chip defaultChecked color="yellow">On Validation Process</Chip>
            )
        }else{
            return(
                <Chip defaultChecked color="gray">Not Guilty</Chip>
            )
        }
    }

    const violationTypeChecker = () => {
        if("LLAJ222009_283" in detailData.violationType){
            return(
                <Box color="green">LLAJ222009_283</Box>
            )
        }else if("LLAJ222009_287" in detailData.violationType){
            return(
                <Box color="orange">LLAJ222009_287</Box>
            )
        }else{
            return(
                <Box color="gray">LLAJ222009_291</Box>
            )
        }
    }

    return(
        <Box>
            <Grid>
                <Grid.Col span={{base:12, xs:6}}>
                    Police Report Number
                </Grid.Col>
                <Grid.Col span={{base:12, xs:6}}>
                    {detailData.policeReportNumber.length > 0 ? 
                        detailData.policeReportNumber[0] :
                        "-"
                    }
                </Grid.Col>
                <Grid.Col span={{base:12, xs:6}}>
                    License Number
                </Grid.Col>
                <Grid.Col span={{base:12, xs:6}}>
                    {detailData.licenseNumber}
                </Grid.Col>
                <Grid.Col span={{base:12, xs:6}}>
                    Violation Type
                </Grid.Col>
                <Grid.Col span={{base:12, xs:6}}>
                    {violationTypeChecker()}
                </Grid.Col>
                <Grid.Col span={{base:12, xs:6}}>
                    Status
                </Grid.Col>
                <Grid.Col span={{base:12, xs:6}}>
                    {statusChecker()}
                </Grid.Col>
                <Grid.Col span={{base:12, xs:6}}>
                    Reporter
                </Grid.Col>
                <Grid.Col span={{base:12, xs:6}}>
                    {detailData.reporter && `${detailData.reporter}`}
                </Grid.Col>
                <Grid.Col span={{base:12, xs:6}}>
                    Stake Amount
                </Grid.Col>
                <Grid.Col span={{base:12, xs:6}}>
                    {detailData.stakeAmount}
                </Grid.Col>
                <Grid.Col span={{base:12, xs:6}}>
                    Reward Amount
                </Grid.Col>
                <Grid.Col span={{base:12, xs:6}}>
                    {detailData.rewardAmount}
                </Grid.Col>
                <Grid.Col span={{base:12, xs:6}}>
                    Reward Paid At
                </Grid.Col>
                <Grid.Col span={{base:12, xs:6}}>
                    {detailData.rewardPaidAt.length > 0 ? 
                        dayjs.unix(detailData.rewardPaidAt[0] != undefined ? Number(detailData.rewardPaidAt[0]) : 0).format("DD-MM-YYYY HH:mm:ss") :
                        "-"
                    }
                </Grid.Col>
                <Grid.Col span={{base:12, xs:6}}>
                    Validated At
                </Grid.Col>
                <Grid.Col span={{base:12, xs:6}}>
                    {detailData.validatedAt.length > 0 ? 
                        dayjs.unix(detailData.validatedAt[0] != undefined ? Number(detailData.validatedAt[0]) : 0).format("DD-MM-YYYY HH:mm:ss") :
                        "-"
                    }
                </Grid.Col>
                <Grid.Col span={{base:12, xs:6}}>
                    Submitted At
                </Grid.Col>
                <Grid.Col span={{base:12, xs:6}}>
                    {detailData.submittedAt.length > 0 ? 
                        dayjs.unix(detailData.submittedAt[0] != undefined ? Number(detailData.submittedAt[0]) : 0).format("DD-MM-YYYY HH:mm:ss") :
                        "-"
                    }
                </Grid.Col>
            </Grid>
            
        </Box>
    )
}

export default DetailReport