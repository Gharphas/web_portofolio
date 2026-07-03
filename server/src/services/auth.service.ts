import { supabase } from "../config/supabase";

export class AuthService {
  static async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw { statusCode: 400, code: "AUTH_FAILED", message: error.message };
    }

    // Verify if the user has admin role in profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user?.id)
      .single();

    if (profileError || !profile || profile.role !== "admin") {
      // Sign out since user is not authorized
      await supabase.auth.signOut();
      throw { statusCode: 403, code: "FORBIDDEN", message: "Akses ditolak. Anda bukan administrator." };
    }

    return {
      session: data.session,
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        role: profile.role,
      },
    };
  }

  static async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw { statusCode: 400, code: "LOGOUT_FAILED", message: error.message };
    }
    return true;
  }

  static async getProfile(userId: string) {
    const { data: profile, error } = await supabase
      .from("user")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      throw { statusCode: 404, code: "PROFILE_NOT_FOUND", message: "Profil tidak ditemukan" };
    }

    return profile;
  }

  static async updateProfile(userId: string, fullName: string, avatarUrl?: string) {
    const { data: profile, error } = await supabase
      .from("user")
      .update({
        name: fullName,
        image: avatarUrl,
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      throw { statusCode: 400, code: "UPDATE_FAILED", message: error.message };
    }

    return profile;
  }

  static async changePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw { statusCode: 400, code: "PASSWORD_CHANGE_FAILED", message: error.message };
    }

    return true;
  }

  static async changeEmail(userId: string, newEmail: string, currentPassword: string) {
    // 1. Validate new email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      throw { statusCode: 400, code: "INVALID_EMAIL", message: "Format email baru tidak valid." };
    }

    // 2. Get the current user's account to verify password
    const { data: account, error: accountError } = await supabase
      .from("account")
      .select("id, password")
      .eq("userId", userId)
      .eq("providerId", "credential")
      .single();

    if (accountError || !account || !account.password) {
      throw { statusCode: 400, code: "ACCOUNT_NOT_FOUND", message: "Akun kredensial tidak ditemukan." };
    }

    // 3. Verify the current password using Better Auth's password utility
    const importESM = new Function("specifier", "return import(specifier)");
    const { verifyPassword } = await importESM("@better-auth/utils/password");
    const isPasswordValid = await verifyPassword(account.password, currentPassword);

    if (!isPasswordValid) {
      throw { statusCode: 400, code: "INVALID_PASSWORD", message: "Password saat ini salah." };
    }

    // 4. Check if the new email is already taken
    const { data: existingUser } = await supabase
      .from("user")
      .select("id")
      .eq("email", newEmail)
      .single();

    if (existingUser) {
      throw { statusCode: 400, code: "EMAIL_TAKEN", message: "Email ini sudah digunakan oleh pengguna lain." };
    }

    // 5. Update email in 'user' table
    const { error: updateUserError } = await supabase
      .from("user")
      .update({ email: newEmail, updatedAt: new Date().toISOString() })
      .eq("id", userId);

    if (updateUserError) {
      throw { statusCode: 400, code: "UPDATE_FAILED", message: `Gagal memperbarui email: ${updateUserError.message}` };
    }

    return true;
  }

  static async refreshSession(refreshToken: string) {
    const { data, error } = await supabase.auth.setSession({
      access_token: "",
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      throw { statusCode: 400, code: "REFRESH_FAILED", message: "Gagal memperbarui sesi. Sesi mungkin telah berakhir." };
    }

    return data.session;
  }
}
