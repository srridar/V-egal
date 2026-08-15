import jwt from "jsonwebtoken";
import { Socket } from "socket.io";

interface JwtPayload {
  userId: string;
}

export const authenticateSocket = ( socket: Socket, next: (err?: Error) => void
) => {
  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET is not configured");
      return next(
        new Error("Authentication service unavailable")
      );
    }

    const token = socket.handshake.auth?.token;

    if (!token || typeof token !== "string") {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    if (!decoded.userId) {
      return next(
        new Error("Invalid authentication token")
      );
    }

    socket.data.user = {
      id: decoded.userId,
    };

    console.log(`Authenticated: ${decoded.userId}`);

    next();
  } catch (err) {
    console.error("Socket authentication failed:", err);

    next(new Error("Invalid or expired token"));
  }
};