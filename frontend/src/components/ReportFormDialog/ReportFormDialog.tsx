import { Box, Button, FileInput, Modal, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useAuth, useCandidActor } from "@bundly/ares-react";
import { CandidActors } from "@app/canisters";
import { GREEN_PRIMARY } from "@app/constants/colors";



const ReportFormDialog = () => {
    const { isAuthenticated, currentIdentity, changeCurrentIdentity } = useAuth();
    const w3t = useCandidActor<CandidActors>("w3t", currentIdentity, {
        canisterId: process.env.NEXT_PUBLIC_W3T_CANISTER_ID,
    }) as CandidActors["w3t"];

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
        reportForm.reset();
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

    // const getViolationTypeVariantFromDescriptions = async (violation: string) => {
    //     const violationCodePair =  Object.entries(violationTypeMap)
    //         .find(([key, value]) => value === violation);
    //     const violationTypeVariant: Record<string, any> = {};
    //     if(violationCodePair) {
    //         const violationCode = violationCodePair[0];
    //         violationTypeVariant[violationCode] = null;
    //     }
        
    //     return violationTypeVariant;
    // }

    const handleSubmit = async (values: typeof reportForm.values) => {
        setIsSubmitting(true);
        
        // const report = {
        //     "status": {
        //         "OnValidationProcess": null
        //     },
        //     "rewardAmount": BigInt(0),
        //     "rewardPaidAt": BigInt(0),
        //     "stakeAmount": BigInt(0),
        //     "submittedAt": null,
        //     "policeReportNumber": null,
        //     "licenseNumber": reportForm.values.licenseNumber,
        //     "validatedAt": null,
        //     "reporter": null,
        //     "violationType": await getViolationTypeVariantFromDescriptions(reportForm.values.violationType),
        //     "police": null,
        // }
        console.log("YA");
        console.log(process.env);
        // const res = await w3t.submitReport(report);
        // console.log(report);
        // const violationCode: keyof Report = await getViolationCodeFromDescription(reportForm.values.violationType);
        // const report: Report = {
        //     violationType: {
        //         violationCode: null
        //     }
        // }
        // console.log(report);
        setIsSubmitting(false)
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