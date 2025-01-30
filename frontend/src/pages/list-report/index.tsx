import { Box } from "@mantine/core"


interface Report {
  'status' : ReportStatus,
  'rewardAmount' : bigint,
  'rewardPaidAt' : [] | [Time],
  'stakeAmount' : bigint,
  'submittedAt' : [] | [Time],
  'policeReportNumber' : [] | [string],
  'licenseNumber' : string,
  'validatedAt' : [] | [Time],
  'reporter' : Principal,
  'violationType' : ViolationType,
  'police' : Principal,
}

const listReport = () => {

    return(
        <Box className="centerContainer">

        </Box>
    )
}

export default listReport