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
  const [reports, setReports] = useState<UidReport[]>([]);
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
  
      const approveFunc = async({uuid} : {uuid: string}) => {
        try {
          const response = await w3tActor.validateReportStatus([uuid, { "GuiltyWaitingForFineToBePaid" : null}, []]);
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
            <Button color={GREEN_PRIMARY} onClick={async() => {
              if (policeReportNumbers === "") {
                notifications.show({
                  title: "Error!",
                  message: "Please Fill Police Report Number!",
                  color: "red",
                  icon: <IconX />
                });
              } else {
                await approveFunc({uuid: uuid})
              }
            }}>Approve</Button>

          </Group>
        </Stack>
      );
    };

    const rejectFunc = async({uuid} : {uuid: string}) => {
      try {
        const response = await w3tActor.validateReportStatus([uuid, { "NotGuilty" : null}, []]);
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
      const reportList: any = "ok" in response ? response.ok : [];
      console.log(reportList);
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
    data: reports!,
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
    data: reports,
    enablePagination: false,
    enableRowActions: true,
    renderRowActionMenuItems: ({ row }: { row: any }) => {
      return (
        <>
          <Menu.Item onClick={() => openModalDetailUser({ detailDataArray: row.original })}>
            Detail
          </Menu.Item>
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
