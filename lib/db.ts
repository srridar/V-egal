
import mongoose from "mongoose";

const getMongoDBUri = (): string => {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error(
            "MONGODB_URI environment variable is not defined"
        );
    }

    return uri;
};

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = {
        conn: null,
        promise: null,
    };
}

export async function connectToDatabase() {
    // Return existing connection
    if (cached.conn) {
        return cached.conn;
    }

    // Create connection
    if (!cached.promise) {
        const MONGODB_URI = getMongoDBUri();

        cached.promise = mongoose.connect(MONGODB_URI, {
            dbName: "v-egal",
            bufferCommands: false,
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}

