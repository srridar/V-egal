
export const acceptFriendRequest = async (requestId: string) => {
    try {
        const res = await fetch("/api/friendReq/accept", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ requestId }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to accept friend request");
        }

        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const rejectFriendRequest = async (requestId: string) => {
    try {
        const res = await fetch("/api/friendReq/reject", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ requestId }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to reject friend request");
        }
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const AddFriend = async (receiverId: string) => {
    try {
        const res = await fetch("/api/friendReq/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ receiverId }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to send friend request");
        }

        return data;

    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const cancleFriendRequest = async (requestId: string) => {
    try {
        const res = await fetch("/api/friendReq/cancel", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ requestId }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to cancel friend request");
        }

        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const removeFriend = async (friendId: string) => {
    try {
        const res = await fetch("/api/friendReq/remove", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ friendId }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to cancel friend request");
        }

        return data;

    } catch (error) {
        console.error(error);
        throw error;
    }
}