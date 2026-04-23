import Call from "@/models/CallModel";
import { v4 as uuidv4 } from "uuid";


export const createCall = async (caller: string, receiver: string, type: "audio" | "video") => {                     //  to create a call

    try {
        if (!caller || !receiver) {
            throw new Error("Caller and receiver are required");
        }

        const roomId = uuidv4();

        const call = await Call.create({
            roomId,
            participants: [caller, receiver],                       //   participants instead of receiver field
            caller,
            callType: type,
            callStatus: "ringing",
            isGroupCall: false,
        });

        return call;
    } catch (error) {
        console.error("Create call failed:", error);
        throw new Error("Failed to create call");
    }

}


export const joinCall = async (roomId: string) => {
    try {
        if (!roomId) {
            throw new Error("Room ID is required");
        }

        const call = await Call.findOne({ roomId });

        if (!call) {
            throw new Error("Call not found");
        }

        //    Prevent joining already ended calls
        if (call.callStatus === "ended") {
            throw new Error("Call has already ended");
        }

        //    Prevent re-joining if already ongoing
        if (call.callStatus === "ongoing") {
            return call;
        }

        //    Update call state
        call.callStatus = "ongoing";
        call.startTime = new Date();

        await call.save();

        return call;
    } catch (error: any) {
        console.error("Join call error:", error.message);
        throw new Error(error.message || "Failed to join call");
    }
};


export const endCall = async (roomId: string, endedBy?: string) => {
    try {
        if (!roomId) {
            throw new Error("Room ID is required");
        }

        const call = await Call.findOne({ roomId });

        if (!call) {
            throw new Error("Call not found");
        }

        //     Prevent double ending
        if (call.callStatus === "ended") {
            return call;
        }

        //     Set end time
        call.endTime = new Date();
        call.callStatus = "ended";

        // (optional) track who ended call
        if (endedBy) {
            call.endedBy = endedBy;
        }

        //    Calculate duration safely
        if (call.startTime && call.endTime) {
            call.duration = Math.floor(
                (call.endTime.getTime() - call.startTime.getTime()) / 1000
            );
        }

        await call.save();

        return call;
    } catch (error: any) {
        console.error("End call error:", error.message);
        throw new Error(error.message || "Failed to end call");
    }
};


export const getCallHistory = async (userId: string) => {
    try {
        if (!userId) {
            throw new Error("User ID is required");
        }

        const calls = await Call.find({
            participants: { $in: [userId] },
        })
            .populate("caller", "name avatar")
            .populate("participants", "name avatar")
            .sort({ createdAt: -1 });

        return calls;
    } catch (error: any) {
        console.error("Get call history error:", error.message);
        throw new Error(error.message || "Failed to fetch call history");
    }
};


export const rejectCall = async (roomId: string, rejectedBy: string) => {
  try {
    const call = await Call.findOne({ roomId });

    if (!call) {
      throw new Error("Call not found");
    }

    //  Prevent rejecting ended calls
    if (call.callStatus === "ended") {
      return call;
    }

    call.callStatus = "rejected";
    call.rejectedBy = rejectedBy;
    call.endTime = new Date();

    await call.save();

    return call;
  } catch (error: any) {
    console.error("Reject call error:", error.message);
    throw new Error(error.message || "Failed to reject call");
  }
};