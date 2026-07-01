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
