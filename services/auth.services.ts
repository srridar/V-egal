import bcrypt from "bcryptjs";
import User from "@/models/User";
import { generateToken } from "@/lib/auth";
import PasswordResetToken from "@/models/PasswordResetToken";
import crypto from "crypto";
import nodemailer from "nodemailer";

type ChangePasswordInput = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

type UpdateProfileInput = {
    username?: string;
    bio?: string;
    avatar?: string;
    avatarPublicId?: string;
    password?: string;
};

interface AuthResponse {
    message: string;
    status: number;
    user: {
        id: string;
        username: string;
        email: string;
        avatar: string;
    };
    token?: string;
}

export interface UserResponse {
    success: boolean;
    status: number;
    message: string;
    user?: any;
    users?: any[];
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const registerUser = async (data: { name: string; email: string; password: string }): Promise<AuthResponse> => {

    const { name, email, password } = data;

    if (!name || !email || !password) {
        throw new Error("All fields are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = generateToken(newUser._id.toString());

    return {
        message: "User registered successfully",
        status: 201,
        user: { id: newUser._id, name: newUser.name, email: newUser.email },
        token,
    };
}

export const loginUser = async (data: { email: string; password: string }): Promise<AuthResponse> => {

    const { email, password } = data;

    if (!email || !password) {
        throw new Error("All fields are required");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new Error("Invalid credentials");
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    const token = generateToken(user._id.toString());

    return {
        message: "Login successful",
        status: 200,
        user: {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            avatar: user.avatar,
        },
        token,
    };
}

export const getUserProfile = async (userId: string): Promise<UserResponse> => {
    if (!userId) {
        throw new Error("User ID is required");
    }
    const user = await User.findById(userId)
        .select("-password -__v")
        .lean();

    if (!user) {
        throw new Error("User not found");
    }

    return {
        success: true,
        status: 200,
        message: "Profile fetched successfully",
        user,
    };

}

export const updateProfile = async (userId: string, data: UpdateProfileInput) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    const updateData: any = {};
    if (data.username) updateData.username = data.username;
    if (data.bio) updateData.bio = data.bio;
    if (data.avatar) updateData.avatar = data.avatar;
    if (data.avatarPublicId)
        updateData.avatarPublicId = data.avatarPublicId;


    if (data.password) {
        if (data.password.length < 6) {
            throw new Error("Password must be at least 6 characters");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        updateData.password = hashedPassword;
    }

    //             Prevent empty update
    if (Object.keys(updateData).length === 0) {
        throw new Error("No data provided to update");
    }

    //         Update user
    const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
        throw new Error("User not found");
    }


    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        avatarPublicId: user.avatarPublicId,
        bio: user.bio,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
        contacts: user.contacts,
        blockedUsers: user.blockedUsers,
    };
};

export const changePassword = async (userId: string, data: ChangePasswordInput) => {
    const { currentPassword, newPassword, confirmPassword } = data;

    if (!userId) {
        throw new Error("User ID is required");
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error("All fields are required");
    }

    if (newPassword !== confirmPassword) {
        throw new Error("New password and confirm password do not match");
    }

    if (newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
        throw new Error("Current password is incorrect");
    }

    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
        throw new Error("New password must be different from old password");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword;
    await user.save();

    return {
        message: "Password updated successfully",
    };
};

export const sendResetPasswordEmail = async (email: string, resetToken: string, name: string) => {


    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({

        from: `"Chat App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Reset Your Password",
        html: `
            <h2>Hello ${name},</h2>
            <p>
                You requested to reset your password.
            </p>
            <p>
                Click the button below.
            </p>
            <a
                href="${resetLink}"
                style="
                    padding:12px 20px;
                    background:#2563eb;
                    color:white;
                    text-decoration:none;
                    border-radius:5px;
                    display:inline-block;
                "
            >
                Reset Password
            </a>

            <br><br>
            <p> This link will expire in 15 minutes. </p>
            <p>  If you didn't request this, ignore this email. </p>
        `,
    });

}

export const forgotPassword = async (email: string) => {
    if (!email) {
        throw new Error("Email is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        return {
            message: "If an account with that email exists, a password reset link has been sent.",
            status: 200,
        };
    }
    await PasswordResetToken.deleteMany({ user: user._id, });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await PasswordResetToken.create({
        user: user._id,
        token: hashedToken,
        expiresAt,
    });

    await sendResetPasswordEmail(
        user.email,
        resetToken,
        user.name
    );

    return {
        message: "Password reset link has been sent to your email.",
        status: 200,
    };

}

export const resetPassword = async (data: {
    token: string;
    password: string;
    confirmPassword: string;
}) => {

    const { token, password, confirmPassword } = data;

    if (!token || !password || !confirmPassword) {
        throw new Error("All fields are required");
    }

    if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
    }

    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const reset = await PasswordResetToken.findOne({
        token: hashedToken,
    });

    if (!reset) {
        throw new Error("Invalid reset link");
    }

    if (reset.expiresAt < new Date()) {
        throw new Error("Reset link has expired");
    }

    const user = await User.findById(reset.user);

    if (!user) {
        throw new Error("User not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();

    await PasswordResetToken.deleteOne({
        _id: reset._id,
    });

    return {
        message: "Password updated successfully",
        status: 200,
    };

}






