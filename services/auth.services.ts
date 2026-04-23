import bcrypt from "bcryptjs";
import User from "@/models/User";
import { generateToken } from "@/lib/auth";


type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type UpdateProfileInput = {
    name?: string;
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
        name: string;
        email: string;
        avatar: string;
    };
    token?: string;
}

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

    const user = await User.findOne({ email });
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
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        },
        token,
    };
}


export const fetchCurrentUser = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw new Error("User not found");
    }
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
        contacts: user.contacts,
        blockedUsers: user.blockedUsers,
    };
}


export const updateProfile = async (
    userId: string,
    data: UpdateProfileInput
) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    //          Prepare safe update object
    const updateData: any = {};

    if (data.name) updateData.name = data.name;
    if (data.bio) updateData.bio = data.bio;
    if (data.avatar) updateData.avatar = data.avatar;
    if (data.avatarPublicId)
        updateData.avatarPublicId = data.avatarPublicId;

    //          Handle password securely
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

    //            Update user
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

  // ❌ Basic validation
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

  // ✅ Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  await user.save();

  return {
    message: "Password updated successfully",
  };
};