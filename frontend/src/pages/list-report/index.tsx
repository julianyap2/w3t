import { Box } from "@mantine/core";
import dayjs from "dayjs";
import { type MRT_ColumnDef, MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";
import { LogoutButton, useAuth, useCandidActor, useIdentities } from "@bundly/ares-react";
import { CandidActors } from "@app/canisters";
import { useRouter } from "next/router";
import type { Report } from "../../declarations/w3t/w3t.did";
const listReport = () => {
  const { isAuthenticated, currentIdentity, changeCurrentIdentity } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<Report[] | undefined>(undefined);
  const w3t = useCandidActor<CandidActors>("w3t", currentIdentity, {
    canisterId: process.env.NEXT_PUBLIC_TEST_CANISTER_ID,
  }) as CandidActors["w3t"];

  useEffect(() => {
    getReports();
  }, [currentIdentity]);

  async function getReports() {
    try {
      const response = await w3t.getAllReports();
        console.log("current identity" + currentIdentity)
        console.log(isAuthenticated)
      if ("err" in response) {
        if ("userNotAuthorized" in response.err) console.log("User Not Authorized");
        else console.log("Error fetching Report");
      }

      const reportList = "ok" in response ? response.ok : undefined;
      console.log(reportList);
      setReports(reportList);
    } catch (error) {
      console.error({ error });
    }
  }

  const columns = useMemo<MRT_ColumnDef<Report>[]>(
    () => [
      {
        accessorKey: "licenseNumber", // Access nested data with dot notation
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

  return (
    <Box
      className="centerContainer"
      style={{
        paddingTop: "40px",
      }}
    >
      {reports && reports.length > 0 && (
        <MantineReactTable
          columns={columns}
          data={reports}
        />
      )}
    </Box>
  );
};

export default listReport;
