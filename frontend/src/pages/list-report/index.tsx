import { Box } from "@mantine/core";
import dayjs from "dayjs";
import { type MRT_ColumnDef, MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";

import { LogoutButton, useAuth, useCandidActor, useIdentities } from "@bundly/ares-react";

import { CandidActors } from "@app/canisters";
import { useRouter } from "next/router";

type ViolationType = { LLAJ222009_283: null } | { LLAJ222009_287: null } | { LLAJ222009_291: null };

type ReportStatus =
  | { GuiltyFinePaid: null }
  | { GuiltyWaitingForFineToBePaid: null }
  | { OnValidationProcess: null }
  | { NotGuilty: null };

interface Report {
  status: ReportStatus;
  rewardAmount: bigint;
  rewardPaidAt: [] | [bigint];
  stakeAmount: bigint;
  submittedAt: [] | [bigint];
  policeReportNumber: [] | [string];
  licenseNumber: string;
  validatedAt: [] | [bigint];
  reporter: string;
  violationType: ViolationType;
  police: string;
}

// const data: Report[] =[
//     {
//         // status: 'NotGuilty',

//     }
// ]

const listReport = () => {
  const { isAuthenticated, currentIdentity, changeCurrentIdentity } = useAuth();
    const router = useRouter();
  const [report, setReport] = useState<any>();
  const w3t = useCandidActor<CandidActors>("w3t", currentIdentity, {
    canisterId: process.env.NEXT_PUBLIC_TEST_CANISTER_ID,
  }) as CandidActors["w3t"];

  useEffect(() => {
    getReports();
  }, [currentIdentity]);

  async function getReports() {
    try {
      const response = await w3t.getAllReports();

      if ("err" in response) {
        if ("userNotAuthorized" in response.err) router.push("/");
        else console.log("Error fetching Report");
      }

      const Report = "ok" in response ? response.ok : undefined;
      console.log(Report);
      setReport(Report);
    } catch (error) {
      console.error({ error });
    }
  }

  const columns = useMemo<MRT_ColumnDef<Report>[]>(
    () => [
      {
        accessorKey: "licenseNumber", //access nested data with dot notation
        header: "License Number",
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        accessorKey: "violationType",
        header: "Violation Type",
      },
      {
        accessorKey: "submittedAt",
        header: "Submitted At",
        // Cell: ({ renderedCellValue, row }) => (
        //   <Box
        //     style={{
        //       display: "flex",
        //       alignItems: "center",
        //       gap: "16px",
        //     }}>
        //     {dayjs.unix(renderedCellValue).format("DD-MM-YYYY HH:mm:ss")}
        //   </Box>
        // ),
      },
      {
        accessorKey: "stakeAmount",
        header: "Stake",
      },
    ],
    []
  );
//   const table = useMantineReactTable({
//     columns,
//     report,
//   });
    return (
        <Box 
            className="centerContainer"
            style={{
                paddingTop: "40px"
            }}
        >
            {/* {report.length > 0 && <MantineReactTable table={table} />} */}
        </Box>
    );
};

export default listReport;
