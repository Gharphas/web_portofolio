import { supabase } from "../config/supabase";

export class AchievementsService {
  static async getAll() {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("date_received", { ascending: false });

    if (error) {
      throw { statusCode: 500, code: "DATABASE_ERROR", message: error.message };
    }

    return data;
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      throw { statusCode: 404, code: "ACHIEVEMENT_NOT_FOUND", message: "Prestasi/sertifikasi tidak ditemukan" };
    }

    return data;
  }

  static async create(achievementData: any) {
    const { data, error } = await supabase
      .from("achievements")
      .insert([achievementData])
      .select()
      .single();

    if (error) {
      throw { statusCode: 400, code: "INSERT_FAILED", message: error.message };
    }

    return data;
  }

  static async update(id: string, achievementData: any) {
    const { data, error } = await supabase
      .from("achievements")
      .update(achievementData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw { statusCode: 400, code: "UPDATE_FAILED", message: error.message };
    }

    return data;
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from("achievements")
      .delete()
      .eq("id", id);

    if (error) {
      throw { statusCode: 400, code: "DELETE_FAILED", message: error.message };
    }

    return true;
  }
}
