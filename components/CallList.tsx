// @ts-nocheck
"use client";
import {useGetCalls} from "@/hooks/useGetCalls";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {CallRecording} from "@stream-io/video-client";
import {Call} from "@stream-io/video-react-sdk";
import MeetingCard from "@/components/MeetingCard";
import Loader from "@/components/Loader";
import {useToast} from "@/hooks/use-toast";

const CallList = ({type}: {type: "ended" | "upcoming" | "recordings"}) => {
    const {endedCalls, upcomingCalls, callRecordings, isLoading} = useGetCalls();
    const router = useRouter();

    const [recordings, setRecordings] = useState<CallRecording[]>();
    const {toast} = useToast();
    const getCalls = () => {
        switch (type) {
            case "ended":
                return endedCalls;
            case "upcoming":
                return upcomingCalls;
            case "recordings":
                return recordings;
            default:
                return [];
        }
    }

    const getNoCallsMessage = () => {
        switch (type) {
            case "ended":
                return "No Previous Calls";
            case "upcoming":
                return "No Upcoming Calls";
            case "recordings":
                return "No Recordings";
            default:
                return [];
        }
    }

    useEffect(() => {
        const fetchRecordings = async () => {
            try {
                const callData = await Promise.all(
                    callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [],
                );

                const recordings = callData
                    .filter((call) => call.recordings.length > 0)
                    .flatMap((call) => call.recordings);

                setRecordings(recordings);
            }catch (error) {
                toast({
                    title: "Try again later"
                })
            }
        };

        if (type === 'recordings') {
            fetchRecordings();
        }
    }, [type, callRecordings]);

    const calls = getCalls();
    const noCallsMessage = getNoCallsMessage();

    if(isLoading){
       return <Loader />;
    }
    return (
        <div className="grid grid-cols-1 gap-5 xl:grid-col-2">
            {calls && calls.length> 0? calls.map((meeting: Call | CallRecording) => (
                <MeetingCard
                    key={(meeting as Call).id}
                    icon={
                        type === "ended"? "/icons/previous.svg": type === "upcoming"? "/icons/upcoming.svg": "/icons/recordings.svg"
                    }
                    title={(meeting as Call).state?.custom?.description
                        || meeting.filename.substring(0,20)
                        || "No Description"}
                    date={meeting.state?.startsAt.toLocaleString() || meeting.start_time.toLocaleString()}
                    isPreviousMeeting={type === "ended"}
                    buttonIcon1={type === "recordings"? "/icons/play.svg" : undefined}
                    handleClick={type === "recordings"? ()=> router.push(`${meeting.url}`): ()=> router.push(`/meeting/${meeting.id}`)}
                    link={type === "recordings"? meeting.url : `${process.env.NEXT_PUBLIC_BAS_URL}/meeting/${meeting.id}`}
                    buttonText={type === "recordings"? "Play" : "Start"}
                />
                )
            ) : (
                  <h1>{noCallsMessage}</h1>
            )}
        </div>
    );
};

export default CallList;
