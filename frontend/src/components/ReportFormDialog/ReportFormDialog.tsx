import { Box, Button, FileInput, Modal, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useAuth, useCandidActor } from "@bundly/ares-react";
import { CandidActors } from "@app/canisters";
import { GREEN_PRIMARY } from "@app/constants/colors";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { Principal } from '@dfinity/principal';


const ReportFormDialog = () => {
    const { isAuthenticated, currentIdentity, changeCurrentIdentity } = useAuth();
    const w3t = useCandidActor<CandidActors>("w3t", currentIdentity, {
        canisterId: process.env.NEXT_PUBLIC_W3T_CANISTER_ID,
    }) as CandidActors["w3t"];
    const [loadingUpload, setLoadingUpload] = useState<boolean>(false)
    const [violationTypeMap, setViolationTypeMap] = useState<Record<string, string>>({});
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
        const res = await w3t.getViolationDescriptions();
        const violationPairs = "ok" in res ? res.ok : [];

        const violationMap: Record<string, string> = {};
        for (let violationPair of violationPairs) {
            violationMap[violationPair[0]] = violationPair[1];
        }
        setViolationTypeMap(violationMap);
    }

    const getViolationTypeVariantFromDescriptions = async (violation: string) => {
        const violationCodePair =  Object.entries(violationTypeMap)
            .find(([key, value]) => value === violation);
        const violationTypeVariant: Record<string, any> = {};
        if(violationCodePair) {
            const violationCode = violationCodePair[0];
            violationTypeVariant[violationCode] = null;
        }
        
        return violationTypeVariant;
    }
    
  const [video, setVideo] = useState<File>();
  const handleVideo = (vids : File) => {
    if (vids) {
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log("File content:", e.target?.result);
      };
      reader.readAsText(vids); // You can also use readAsArrayBuffer or readAsDataURL
      setVideo(vids);
    }
  };

  const uploadFile = async (uid: any) => {
    setLoadingUpload(true)
    const CHUNK_SIZE = 200000; // 0.2MB

    const reader = new FileReader();
    reader.readAsArrayBuffer(video!);
    reader.onload = async () => {
      const fileBytes = new Uint8Array(reader.result as ArrayBuffer);
      const fileSize: number = fileBytes.length;
      const totalChunks: number = Math.ceil(fileSize / CHUNK_SIZE);

      for (let i = 0; i < totalChunks; i++) {
        const offset: number = i * CHUNK_SIZE;
        const chunk: Uint8Array = new Uint8Array(fileBytes.slice(offset, offset + CHUNK_SIZE));
        const hexChunk: string = Array.from(chunk).map(byte => `0x${byte.toString(16).padStart(2, "0")}`).join(";");
        
        console.log(`Uploading chunk ${i + 1}/${totalChunks}...`);
        
        const response = await w3t.uploadVideoByChunk(uid, chunk);
        if("err" in response) break;
        const success = "ok" in response? response.ok : undefined;
        console.log(`Success upload chunk: ${i}, ${success}`)
      }
  
      console.log("Video successfully uploaded!");
      setLoadingUpload(false)
    };
  };

  // async function reconstructVideo(fileId) {
  //   const chunks = await fetchVideoChunks(fileId);
    
  //   if (chunks.length === 0) {
  //       console.error("No video chunks found.");
  //       return null;
  //   }

  //   // Merge chunks into a single Blob
  //   const mergedBlob = new Blob(chunks, { type: "video/mp4" });

  //   // Create a URL for the Blob
  //   const videoURL = URL.createObjectURL(mergedBlob);

  //   return videoURL;
  // }

  
  // MARK -- DELETE LATER
//   fetchVideoChunks("A");

    const handleSubmit = async (values: typeof reportForm.values) => {
        setIsSubmitting(true);
        if(reportForm.values.video){
            try {
                handleVideo(reportForm.values.video)
                let report: any = {
                    "status": {
                        "OnValidationProcess": null
                    },
                    "rewardAmount": BigInt(0),
                    "rewardPaidAt": [],
                    "stakeAmount": BigInt(0),
                    "submittedAt": [],
                    "policeReportNumber": [""],
                    "licenseNumber": reportForm.values.licenseNumber,
                    "validatedAt": [],
                    "reporter": Principal.fromText('aaaaa-aa'),
                    "violationType": await getViolationTypeVariantFromDescriptions(reportForm.values.violationType),
                    "police": Principal.fromText('aaaaa-aa'),
                }
                const res = await w3t.submitReport(report);
                uploadFile(res)
                setIsSubmitting(false)
                reportForm.reset();
                notifications.show({
                    title: "Success!",
                    message: "Report Submitted!",
                    color: "green",
                    icon: <IconCheck/>
                })
                
            } catch (error: any) {
                notifications.show({
                    title: "Error!",
                    message: error,
                    color: "red",
                    icon: <IconX/>
                })
            }
        }
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
                    data={Object.values(violationTypeMap)}
                    {...reportForm.getInputProps("violationType")}
                />
                <FileInput
                    label="Upload Video Evidence"
                    placeholder="Select a video file"
                    accept="video/*"
                    {...reportForm.getInputProps("video")}
                />
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