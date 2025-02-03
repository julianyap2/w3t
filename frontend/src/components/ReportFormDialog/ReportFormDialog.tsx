import { Box, Button, FileInput, Grid, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { GREEN_PRIMARY } from "@app/constants/colors";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { Principal } from '@dfinity/principal';
import { ViolationType, Report } from "@app/declarations/w3t/w3t.did";
import { useCanister } from "@app/contexts/CanisterContext";

const ReportFormDialog = () => {    
    const { principalId, w3tActor } = useCanister();
    const [violationTypeStringArray, setViolationTypeStringArray] = useState<string[]>();
    const [violationTypeArray, setViolationTypeArray] = useState<ViolationType[]>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const reportForm = useForm({
        initialValues: {
            licenseNumber: "",
            violationType: "",
            video: null as File | null,
        },
        validate: {
            licenseNumber: (value) => value.trim().length > 0 ? null : "License number is required",
            violationType: (value) => value ? null : "Please select a violation type",
            video: (value) => value ? null : "Please upload a video",
        },
    });

    useEffect(() => {
        loadViolationDescriptions();
    }, []);

    const loadViolationDescriptions = async () => {
        const res = await w3tActor.getViolationDescriptions();
        const violations: ViolationType[] = "ok" in res ? res.ok : [];
        let violationDesc: string[] = violations.map((violation: ViolationType) => violation.briefDescription)
        setViolationTypeStringArray(violationDesc);
        setViolationTypeArray(violations);
    }
    
    let video: File;

    const handleVideo = async (vids : File) => {
        if (vids) {
        const reader = new FileReader();
        reader.onload = (e) => {
            console.log("File content:", e.target?.result);
        };
        console.log(`Typeof: ${typeof vids}`);
        console.log(`Video: ${vids}`)
        video = vids;
        } else {
            console.log("Video is empty");
        }
    };

    const uploadFile = async (uid: any) => {
        const CHUNK_SIZE = 200000; // 0.2MB
        
        const reader = new FileReader();
        video?.arrayBuffer().then((arrayBuffer) => {
            const blob = new Blob([new Uint8Array(arrayBuffer)], {type: video.type });
            reader.readAsArrayBuffer(blob);
            console.log(`Successfully read: ${blob}`);
        });
        reader.onload = async () => {
            const fileBytes = new Uint8Array(reader.result as ArrayBuffer);
            const fileSize: number = fileBytes.length;
            const totalChunks: number = Math.ceil(fileSize / CHUNK_SIZE);

            for (let i = 0; i < totalChunks; i++) {
                const offset: number = i * CHUNK_SIZE;
                const chunk: Uint8Array = new Uint8Array(fileBytes.slice(offset, offset + CHUNK_SIZE));
                const hexChunk: string = Array.from(chunk).map(byte => `0x${byte.toString(16).padStart(2, "0")}`).join(";");
                
                console.log(`Uploading chunk ${i + 1}/${totalChunks}...`);
                
                const response = await w3tActor.uploadVideoByChunk(uid, chunk);
                if("err" in response) break;
                const success = "ok" in response? response.ok : undefined;
                console.log(`Success upload chunk: ${i}, ${success}`)
            }
        
            console.log("Video successfully uploaded!");
            reportForm.reset();
            notifications.show({
                title: "Success!",
                message: "Report Submitted!",
                color: "green",
                icon: <IconCheck/>
            })
            setIsSubmitting(false)
        };
    };

    const handleSubmit = async (values: typeof reportForm.values) => {
        setIsSubmitting(true);
        if(reportForm.values.video){
            try {
                await handleVideo(reportForm.values.video)
                const violationType = violationTypeArray?.find((x) => reportForm.values.violationType == x.briefDescription)!;
                const stakeAmount = BigInt(getStakeAmount());
                const rewardAmount = BigInt(getRewardAmount());
                const submittedAt: [bigint] = [BigInt(Date.now())];
                let report: Report = {
                    "status": {
                        "OnValidationProcess": null
                    },
                    "rewardAmount": rewardAmount,
                    "rewardPaidAt": [],
                    "stakeAmount": stakeAmount,
                    "submittedAt": submittedAt,
                    "policeReportNumber": [],
                    "licenseNumber": reportForm.values.licenseNumber,
                    "validatedAt": [],
                    "reporter": Principal.fromText(principalId),
                    "violationType": violationType,
                    "police": [],
                }
                const res = await w3tActor.submitReport(report);
                const response: string = "ok" in res ? res.ok : "";

                await uploadFile(response)
                
            } catch (error: any) {
                notifications.show({
                    title: "Error!",
                    message: error,
                    color: "red",
                    icon: <IconX/>
                })
                setIsSubmitting(false)
            }
        }
    }

    const getStakeAmount = () => {
        const violationType = violationTypeArray?.find((x) => reportForm.values.violationType == x.briefDescription)!;
        if(!violationType) return 0;
        return (Number(violationType.fine));
    }

    const getRewardAmount = () => {
        const violationType = violationTypeArray?.find((x) => reportForm.values.violationType == x.briefDescription)!;
        if(!violationType) return 0;
        return (Number(violationType.fine) / 2);
    }

    const formatTokenDecimal = (num: number) => {
        if(num === 0) return "-";
        return (num / 100000000).toFixed(8);
    }

    return (
        <Box>
            <form onSubmit={reportForm.onSubmit(handleSubmit)}>
                <TextInput
                    label="License Number"
                    placeholder="Enter license plate number"
                    {...reportForm.getInputProps("licenseNumber")}
                />
                <Select
                    label="Violation Type"
                    placeholder="Select violation"
                    data={violationTypeStringArray}
                    {...reportForm.getInputProps("violationType")}
                />
                <FileInput
                    label="Upload Video Evidence"
                    placeholder="Select a video file"
                    accept="video/*"
                    {...reportForm.getInputProps("video")}
                />
                <Grid mt={"1rem"}>
                    <Grid.Col span={{base: 6}}>
                        <Box>
                            Stake Amount
                        </Box>
                        <Box style={{color: "#888888", fontWeight: "500"}}>
                            {formatTokenDecimal(getStakeAmount()) + " W3T"}
                        </Box>
                    </Grid.Col>
                    <Grid.Col span={{base: 6}}>
                        <Box>
                            Reward Amount
                        </Box>
                        <Box  style={{color: "#888888", fontWeight: "500"}}>
                            {formatTokenDecimal(getRewardAmount()) + " W3T"}
                        </Box>
                    </Grid.Col>
                </Grid>
                <Box style={{height: 50, display: "flex", alignItems: "flex-end", justifyContent: "center"}}>
                    { isSubmitting && "⚠️ Please do not close this page while submitting..."}
                </Box>
                <Button type="submit" fullWidth mt="md" color={GREEN_PRIMARY} loading={isSubmitting}>
                    Submit
                </Button>
            </form>
        </Box>
    );
};

export default ReportFormDialog;