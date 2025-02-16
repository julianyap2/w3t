import { Box, Chip, Grid } from "@mantine/core";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { useCanister } from "@app/contexts/CanisterContext";

import type { Report, UidReport } from "../../declarations/w3t/w3t.did";
import { error } from "console";

const DetailReport = ({ detailDataArray }: { detailDataArray: UidReport }) => {
  const { w3tActor, principalId } = useCanister();
  const [videoURL, setVideoURL] = useState<any>();
  const [videoChunks, setVideoChunks] = useState<Blob[]>([]);
  const [chunksCount, setChunksCount] = useState(0);

  let detailData: Report = detailDataArray[1];

  const statusChecker = () => {
    if ("GuiltyFinePaid" in detailData.status) {
      return (
        <Chip defaultChecked color="green">
          Guilty Fine Paid
        </Chip>
      );
    } else if ("GuiltyWaitingForFineToBePaid" in detailData.status) {
      return (
        <Chip defaultChecked color="orange">
          Guilty Waiting For Fine To Be Paid
        </Chip>
      );
    } else if ("OnValidationProcess" in detailData.status) {
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
  };

  const violationTypeChecker = () => {
    return <Box>{detailData.violationType.briefDescription}</Box>;
  };

  const fetchVideoChunks = async (fileId: string) => {
    console.log(`Entering fetch video chunks`);
    let chunks: Blob[] = [];
    let index: bigint = BigInt(0);

    while (true) {
      console.log(`Entering loop: ${index}`);
      const response = await w3tActor.getVideoChunk(fileId, index);
      if ("err" in response) {
        console.log(`Error: ${response.err}`);
        break;
      };
      const chunk = "ok" in response ? response.ok : undefined;
      console.log(`Ok.`);
      chunks.push(chunk);
      setVideoChunks(chunks);
      const videoBlob = new Blob(chunks, { type: "video/mp4" });
      console.log(`Success creating video blob`);
      setVideoURL(URL.createObjectURL(videoBlob));
      console.log(`video url: ${videoURL}`);
      index++;
    }
    console.log(`Ended fetch video chunks. Length: ${chunks.length}`);
    return chunks;
  };

  useEffect(() => {
    console.log(`Uid: ${detailDataArray[0]}`)
    fetchVideoChunks(detailDataArray[0]);
  }, []);

  const formatTokenDecimal = (num: number) => {
    if(num === 0) return "-";
    return (num / 100000000).toFixed(8);
  }

  return (
    <Box>
      <Grid>
        <Grid.Col span={{ base: 12, xs: 6 }}>Police Report Number</Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6 }}>
          {detailData.policeReportNumber?.length > 0 ? detailData.policeReportNumber[0] : "-"}
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6 }}>License Number</Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6 }}>{detailData.licenseNumber}</Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6 }}>Violation Type</Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6 }}>{violationTypeChecker()}</Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6 }}>Status</Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6 }}>{statusChecker()}</Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6 }}>Reporter</Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6 }}>{detailData.reporter && `${detailData.reporter}`}</Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6 }}>Stake Amount</Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6 }}>{formatTokenDecimal(Number(detailData.stakeAmount)) + " W3T"}</Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6 }}>Reward Amount</Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6 }}>{formatTokenDecimal(Number(detailData.rewardAmount)) + " W3T"}</Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6 }}>Reward Paid At</Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6 }}>
          {detailData.rewardPaidAt?.length > 0
            ? dayjs
                .unix(detailData.rewardPaidAt[0] != undefined ? Number(detailData.rewardPaidAt[0]) : 0)
                .format("DD-MM-YYYY HH:mm:ss")
            : "-"}
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6 }}>Validated At</Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6 }}>
          {detailData.validatedAt?.length > 0
            ? dayjs
                .unix(detailData.validatedAt[0] != undefined ? Number(detailData.validatedAt[0]) : 0)
                .format("DD-MM-YYYY HH:mm:ss")
            : "-"}
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6 }}>Submitted At</Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6 }}>
          {detailData.submittedAt?.length > 0
            ? dayjs
                .unix(detailData.submittedAt[0] != undefined ? Number(detailData.submittedAt[0]) : 0)
                .format("DD-MM-YYYY HH:mm:ss")
            : "-"}
        </Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6 }}>UUID</Grid.Col>
        <Grid.Col span={{ base: 12, xs: 6 }}>{detailDataArray[0]}</Grid.Col>
        {videoURL && (
          <video
            width="320"
            height="240"
            controls
            src={videoURL}
            style={{
              width: "100%",
            }}></video>
        )}
      </Grid>
    </Box>
  );
};

export default DetailReport;
