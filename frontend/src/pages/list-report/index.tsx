import { Box, Chip, Menu } from "@mantine/core";
import dayjs from "dayjs";
import { type MRT_ColumnDef, MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";
import { LogoutButton, useAuth, useCandidActor, useIdentities } from "@bundly/ares-react";
import { CandidActors } from "@app/canisters";
import { useRouter } from "next/router";
import type { Report } from "../../declarations/w3t/w3t.did";
import { Principal } from '@dfinity/principal';
import { modals } from '@mantine/modals';
import DetailReport from "@app/components/DetailReport/DetailReport";

const listReport = () => {
  const { isAuthenticated, currentIdentity, changeCurrentIdentity } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<string>("police")
  const [reports, setReports] = useState<Report[] | undefined>(undefined);
  const w3t = useCandidActor<CandidActors>("w3t", currentIdentity, {
    canisterId: process.env.NEXT_PUBLIC_TEST_CANISTER_ID,
  }) as CandidActors["w3t"];

  useEffect(() => {
    getReports();
  }, [currentIdentity]);

  const openModalDetail = ({detailData} : {detailData : Report}) => modals.openConfirmModal({
    title: 'Detail Report',
    children: (
      <DetailReport detailData={detailData} />
    ),
    size: 'lg',
    labels: { confirm: 'Approve', cancel: 'Reject' },
    onCancel: () => console.log('Cancel'),
    onConfirm: () => console.log('Confirmed'),
  });

  async function getReports() {
    try {
      const response = await w3t.getAllReports();
      console.log(currentIdentity)
      if ("err" in response) {
        if ("userNotAuthorized" in response.err) console.log("User Not Authorized");
        else console.log("Error fetching Report");
      }

      const reportList: any = "ok" in response ? response.ok : undefined;
      console.log(reportList);
      setReports(reportList);
    } catch (error) {
      console.error({ error });
    }
  }
// Example Principal instances
const examplePrincipal1 = Principal.fromText('2vxsx-fae');
const examplePrincipal2 = Principal.fromText('aaaaa-aa');
  const mockReports: Report[] = [
    {
      status: { NotGuilty: null },
      rewardAmount: BigInt(1000),
      rewardPaidAt: [],
      stakeAmount: BigInt(500),
      submittedAt: [BigInt(Date.now())],
      policeReportNumber: ['PR12345'],
      licenseNumber: 'ABC123',
      validatedAt: [BigInt(Date.now())],
      reporter: examplePrincipal1,
      violationType: { LLAJ222009_283: null },
      police: examplePrincipal2,
    },
    {
      status: { OnValidationProcess: null },
      rewardAmount: BigInt(2000),
      rewardPaidAt: [],
      stakeAmount: BigInt(750),
      submittedAt: [BigInt(Date.now())],
      policeReportNumber: ['PR67890'],
      licenseNumber: 'XYZ789',
      validatedAt: [],
      reporter: examplePrincipal2,
      violationType: { LLAJ222009_287: null },
      police: examplePrincipal1,
    }
  ];

  const columns = useMemo<MRT_ColumnDef<Report>[]>(
    () => [
      {
        accessorKey: "licenseNumber", // Access nested data with dot notation
        header: "License Number",
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ renderedCellValue, row } : {renderedCellValue : any, row: any}) => {
            if("GuiltyFinePaid" in renderedCellValue){
                return(
                    <Chip defaultChecked color="green">Guilty Fine Paid</Chip>
                )
            }else if("GuiltyWaitingForFineToBePaid" in renderedCellValue){
                return(
                    <Chip defaultChecked color="orange">Guilty Waiting For Fine To Be Paid</Chip>
                )
            }else if("OnValidationProcess" in renderedCellValue){
                return(
                    <Chip defaultChecked color="yellow">On Validation Process</Chip>
                )
            }else{
                return(
                    <Chip defaultChecked color="gray">Not Guilty</Chip>
                )
            }
        },
      },
      {
        accessorKey: "violationType",
        header: "Violation Type",
        Cell: ({ renderedCellValue, row } : {renderedCellValue : any, row: any}) => {
            if("LLAJ222009_283" in renderedCellValue){
                return(
                    <Box color="green">LLAJ222009_283</Box>
                )
            }else if("LLAJ222009_287" in renderedCellValue){
                return(
                    <Box color="orange">LLAJ222009_287</Box>
                )
            }else{
                return(
                    <Box color="gray">LLAJ222009_291</Box>
                )
            }
        },
      },
      {
        accessorKey: "submittedAt",
        header: "Submitted At",
        Cell: ({ renderedCellValue, row } : {renderedCellValue : any, row: any}) => (
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}>
            {dayjs.unix(renderedCellValue).format("DD-MM-YYYY HH:mm:ss")}
          </Box>
        ),
      },
      {
        accessorKey: "stakeAmount",
        header: "Stake",
      },
    ],
    []
  );

  const policeTable = useMantineReactTable({
    columns,
    data: mockReports,
    enablePagination: false,
    enableRowActions: true,
    renderRowActionMenuItems: ({ row } : {row: any}) => {
      console.log(row.original)
      return(
        <>
          <Menu.Item onClick={() => openModalDetail({detailData: row.original})}>Detail</Menu.Item>
        </>
    )},
    // enableBottomToolbar: false
  });

  
  const userTable = useMantineReactTable({
    columns,
    data: mockReports,
    enablePagination: false,
    // enableBottomToolbar: false
  });

  return (
    <Box
      className="centerContainer"
      style={{
        paddingTop: "40px",
      }}
    >
      {/* {reports && reports.length > 0 && (
        <MantineReactTable
          columns={columns}
          data={reports}
        />
      )} */}

      {role === "police" ?
        <MantineReactTable
            table={policeTable}
        />
        :
        <MantineReactTable
            table={userTable}
        />
      }
    </Box>
  );
};

export default listReport;
