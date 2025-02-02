import { Principal } from "@dfinity/principal";
import { Box, Button, Chip, Group, Menu, Stack, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import dayjs from "dayjs";
import { type MRT_ColumnDef, MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import DetailReport from "@app/components/DetailReport/DetailReport";
import { GREEN_PRIMARY } from "@app/constants/colors";
import type { Report, UidReport } from "../../declarations/w3t/w3t.did";
import { useCanister } from "@app/contexts/CanisterContext";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";

const listReport = () => {
  const { w3tActor } = useCanister();
  const router = useRouter();
  const [role, setRole] = useState<string>("police");
  const [reports, setReports] = useState<UidReport[] | undefined>(undefined);
  // const [policeReportNumbers, setPoliceReportNumbers] = useState('');

  useEffect(() => {
    if(w3tActor){
      getReports();
    }
  }, []);

  const openModalDetailPolice = ({ detailDataArray }: { detailDataArray: UidReport }) =>
    modals.openConfirmModal({
      title: "Detail Report",
      children: <DetailReport detailDataArray={detailDataArray} />,
      size: "lg",
      closeOnConfirm: false,
      confirmProps: "GuiltyWaitingForFineToBePaid" in detailDataArray[1].status ? {color: GREEN_PRIMARY} : "OnValidationProcess" in detailDataArray[1].status ? {color: GREEN_PRIMARY} : { display: "none" },
      cancelProps: "OnValidationProcess" in detailDataArray[1].status ? {} : { display: "none" },
      labels: "GuiltyWaitingForFineToBePaid" in detailDataArray[1].status ? { confirm: "Distribute Reward", cancel: "Reject" } : {confirm: "Approve", cancel: "Reject"},
      onCancel: () => rejectFunc({uuid: detailDataArray[0]}),
      onConfirm: () => {
        if("OnValidationProcess" in detailDataArray[1].status){
            modals.openConfirmModal({
              title: "Police Report",
              closeOnConfirm: false,
              children: (
                <PoliceReportModal
                  uuid={detailDataArray[0]}
                />
              ),
              cancelProps: { display: "none" },
              confirmProps: { display: "none" },
              labels: {confirm: "Approve", cancel: "Reject"}
            })
        }else{
          console.log("Confirmed")
        }
      },
    });

    const PoliceReportModal = ({uuid} : {uuid: string}) => {
      const [policeReportNumbers, setPoliceReportNumbers] = useState('');
  
      return (
        <Stack>
          <TextInput 
            label="Police Report Number" 
            onChange={(e) => {
              setPoliceReportNumbers(e.currentTarget.value);
            }} 
            value={policeReportNumbers} 
            withAsterisk 
          />
          <Group justify="flex-end" mt={40}>
            <Button color={GREEN_PRIMARY} onClick={() => {
              if (policeReportNumbers === "") {
                notifications.show({
                  title: "Error!",
                  message: "Please Fill Police Report Number!",
                  color: "red",
                  icon: <IconX />
                });
              } else {
                approveFunc({uuid: uuid})
              }
            }}>Approve</Button>

          </Group>
        </Stack>
      );
    };

    const approveFunc = async({uuid} : {uuid: string}) => {
      try {
        const response = await w3tActor.validateReportStatus([uuid, { "GuiltyWaitingForFineToBePaid" : null}]);
        modals.closeAll();
      } catch (error: any) {
        notifications.show({
          title: "Error!",
          message: error,
          color: "red",
          icon: <IconX />
        })
      }
    }
    const rejectFunc = async({uuid} : {uuid: string}) => {
      try {
        const response = await w3tActor.validateReportStatus([uuid, { "NotGuilty" : null}]);
        modals.closeAll();
      } catch (error: any) {
        notifications.show({
          title: "Error!",
          message: error,
          color: "red",
          icon: <IconX />
        })
      }
    }
  const openModalDetailUser = ({ detailDataArray }: { detailDataArray: UidReport }) =>
    modals.open({
      title: "Detail Report",
      children: <DetailReport detailDataArray={detailDataArray} />,
      size: "lg",
    });

  async function getReports() {
    try {
      const response = await w3tActor.getAllReports();
      if ("err" in response) {
        if ("userNotAuthorized" in response.err) console.log("User Not Authorized");
        else console.log("Error fetching Report");
      }

      const reportList: any = "ok" in response ? response.ok : undefined;
      setReports(reportList);
    } catch (error:any) {
      notifications.show({
        title: "Error!",
        message: error,
        color: "red",
        icon: <IconX />
      })
    }
  }
  // Example Principal instances
  const examplePrincipal1 = Principal.fromText("2vxsx-fae");
  const examplePrincipal2 = Principal.fromText("aaaaa-aa");
  const mockReports: UidReport[] = [
    [
      "iniUId",
      {
        status: { NotGuilty: null },
        rewardAmount: BigInt(1000),
        rewardPaidAt: [],
        stakeAmount: BigInt(500),
        submittedAt: [BigInt(Date.now())],
        policeReportNumber: ["PR12345"],
        licenseNumber: "ABC123",
        validatedAt: [BigInt(Date.now())],
        reporter: examplePrincipal1,
        violationType: {
          chapter: BigInt(283),
          clause: BigInt(1),
          fine: BigInt(750000),
          briefDescription: "Mengemudi Ugal - Ugalan",
          completeDescription:
            "Setiap orang yang mengemudikan Kendaraan Bermotor di Jalan secara tidak wajar dan melakukan kegiatan lain atau dipengaruhi oleh suatu keadaan yang mengakibatkan gangguan konsentrasi dalam mengemudi di Jalan sebagaimana dimaksud dalam Pasal 106 ayat (1) dipidana dengan pidana kurungan paling lama 3 (tiga) bulan atau denda paling banyak Rp750.000,00 (tujuh ratus lima puluh ribu rupiah).",
        },
        police: [examplePrincipal2],
      },
    ],
    [
      "iniuuid2",
      {
        status: { OnValidationProcess: null },
        rewardAmount: BigInt(2000),
        rewardPaidAt: [],
        stakeAmount: BigInt(750),
        submittedAt: [BigInt(Date.now())],
        policeReportNumber: ["PR67890"],
        licenseNumber: "XYZ789",
        validatedAt: [],
        reporter: examplePrincipal2,
        violationType: {
          chapter: BigInt(287),
          clause: BigInt(1),
          fine: BigInt(500000),
          briefDescription: "Melanggar Marka Jalan",
          completeDescription:
            "Setiap orang yang mengemudikan Kendaraan Bermotor di Jalan yang melanggar aturan perintah atau larangan yang dinyatakan dengan Rambu Lalu Lintas sebagaimana dimaksud dalam Pasal 106 ayat (4) huruf a atau Marka Jalan sebagaimana dimaksud dalam Pasal 106 ayat (4) huruf b dipidana dengan pidana kurungan paling lama 2 (dua) bulan atau denda paling banyak Rp500.000,00 (lima ratus ribu rupiah).",
        },
        police: [examplePrincipal1],
      },
    ],
    [
      "iniuuid3",
      {
        status: { GuiltyWaitingForFineToBePaid: null },
        rewardAmount: BigInt(2000),
        rewardPaidAt: [],
        stakeAmount: BigInt(750),
        submittedAt: [BigInt(Date.now())],
        policeReportNumber: ["PR67890"],
        licenseNumber: "XYZ729",
        validatedAt: [],
        reporter: examplePrincipal2,
        violationType: {
          chapter: BigInt(287),
          clause: BigInt(1),
          fine: BigInt(500000),
          briefDescription: "Melanggar Marka Jalan",
          completeDescription:
            "Setiap orang yang mengemudikan Kendaraan Bermotor di Jalan yang melanggar aturan perintah atau larangan yang dinyatakan dengan Rambu Lalu Lintas sebagaimana dimaksud dalam Pasal 106 ayat (4) huruf a atau Marka Jalan sebagaimana dimaksud dalam Pasal 106 ayat (4) huruf b dipidana dengan pidana kurungan paling lama 2 (dua) bulan atau denda paling banyak Rp500.000,00 (lima ratus ribu rupiah).",
        },
        police: [examplePrincipal1],
      },
    ],
  ];

  const columns = useMemo<MRT_ColumnDef<UidReport>[]>(
    () => [
      {
        accessorKey: "1.licenseNumber", // Access nested data with dot notation
        header: "License Number",
        Cell: ({ renderedCellValue, row }: { renderedCellValue: any; row: any }) => (
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}>
            {renderedCellValue}
          </Box>
        ),
      },
      {
        accessorKey: "1.status",
        header: "Status",
        Cell: ({ renderedCellValue, row }: { renderedCellValue: any; row: any }) => {
          if ("GuiltyFinePaid" in renderedCellValue) {
            return (
              <Chip defaultChecked color="green">
                Guilty Fine Paid
              </Chip>
            );
          } else if ("GuiltyWaitingForFineToBePaid" in renderedCellValue) {
            return (
              <Chip defaultChecked color="orange">
                Guilty Waiting For Fine To Be Paid
              </Chip>
            );
          } else if ("OnValidationProcess" in renderedCellValue) {
            return (
              <Chip defaultChecked color="yellow">
                On Validation Process
              </Chip>
            );
          } else {
            return (
              <Chip defaultChecked color="gray">
                Not Guilty
              </Chip>
            );
          }
        },
      },
      {
        accessorKey: "1.violationType",
        header: "Violation Type",
        Cell: ({ renderedCellValue, row }: { renderedCellValue: any; row: any }) => {
          if ("LLAJ222009_283" in renderedCellValue) {
            return <Box color="green">LLAJ222009_283</Box>;
          } else if ("LLAJ222009_287" in renderedCellValue) {
            return <Box color="orange">LLAJ222009_287</Box>;
          } else {
            return <Box color="gray">LLAJ222009_291</Box>;
          }
        },
      },
      {
        accessorKey: "1.submittedAt",
        header: "Submitted At",
        Cell: ({ renderedCellValue, row }: { renderedCellValue: any; row: any }) => (
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}>
            {dayjs.unix(Number(renderedCellValue[0])).format("DD-MM-YYYY HH:mm:ss")}
          </Box>
        ),
      },
      {
        accessorKey: "1.stakeAmount",
        header: "Stake",
        Cell: ({ renderedCellValue, row }: { renderedCellValue: any; row: any }) => (
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}>
            {renderedCellValue.toString()}
          </Box>
        ),
      },
    ],
    []
  );

  const policeTable = useMantineReactTable({
    columns,
    data: mockReports,
    enablePagination: false,
    enableRowActions: true,
    renderRowActionMenuItems: ({ row }: { row: any }) => {
      return (
        <>
          <Menu.Item onClick={() => openModalDetailPolice({ detailDataArray: row.original })}>
            Detail
          </Menu.Item>
        </>
      );
    },
    // enableBottomToolbar: false
  });

  const userTable = useMantineReactTable({
    columns,
    data: mockReports,
    enablePagination: false,
    enableRowActions: true,
    renderRowActionMenuItems: ({ row }: { row: any }) => {
      return (
        <>
          <Menu.Item onClick={() => openModalDetailUser({ detailDataArray: row.original })}>Detail</Menu.Item>
        </>
      );
    },
    // enableBottomToolbar: false
  });

  return (
    <Box>
      <Box className={"bg"}></Box>
      <Box
        className="centerContainer"
        style={{
          paddingTop: "40px",
        }}>
        {/* {reports && reports.length > 0 && (
        <MantineReactTable
          columns={columns}
          data={reports}
        />
      )} */}

        {role === "police" ? (
          <MantineReactTable table={policeTable} />
        ) : (
          <MantineReactTable table={userTable} />
        )}
      </Box>
    </Box>
  );
};

export default listReport;
