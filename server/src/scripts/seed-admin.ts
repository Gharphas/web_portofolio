import { supabase } from "../config/supabase";
import { initAuth } from "../config/auth";

export async function seedAdmin() {
  try {
    console.log("🔍 Memeriksa apakah pengguna admin sudah terdaftar di Better Auth...");
    
    // Check if the admin user already exists in the "user" table
    const { data: user, error } = await supabase
      .from("user")
      .select("id")
      .eq("email", "admin@jemiarian.com")
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("❌ Gagal memeriksa database untuk user admin:", error.message);
      return;
    }

    const authInstance = await initAuth();
    if (!authInstance) {
      console.error("❌ Gagal mendapatkan instansi Better Auth untuk seed admin.");
      return;
    }

    if (!user) {
      console.log("👤 Pengguna admin tidak ditemukan. Membuat akun admin default...");
      
      // Create user programmatically via Better Auth API
      const response = await authInstance.api.signUpEmail({
        body: {
          email: "admin@jemiarian.com",
          password: "admin123",
          name: "Jemi Arian Admin",
        }
      });

      if (response && response.user) {
        console.log("✅ Akun admin default berhasil dibuat di Better Auth.");
        
        // Update user role to 'admin'
        const { error: roleError } = await supabase
          .from("user")
          .update({ role: "admin" })
          .eq("id", response.user.id);

        if (roleError) {
          console.error("❌ Gagal menetapkan role admin:", roleError.message);
        } else {
          console.log("👑 Role admin berhasil diterapkan.");
        }
      } else {
        console.error("❌ Gagal mendaftarkan user admin.");
      }
    } else {
      console.log("ℹ️ Pengguna admin sudah terdaftar.");
    }
  } catch (err: any) {
    console.error("❌ Terjadi kesalahan saat menyemai (seed) admin:", err.message || err);
  }
}
