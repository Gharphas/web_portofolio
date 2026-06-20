import { supabase } from "../config/supabase";

export class ExperienceService {
  static async getAll() {
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("start_date", { ascending: false });

    if (error) {
      throw { statusCode: 500, code: "DATABASE_ERROR", message: error.message };
    }

    return data;
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw { statusCode: 404, code: "EXPERIENCE_NOT_FOUND", message: "Pengalaman tidak ditemukan" };
    }

    return data;
  }

  static async create(experienceData: any) {
    const { data, error } = await supabase
      .from("experience")
      .insert([experienceData])
      .select()
      .single();

    if (error) {
      throw { statusCode: 400, code: "INSERT_FAILED", message: error.message };
    }

    return data;
  }

  static async update(id: string, experienceData: any) {
    const { data, error } = await supabase
      .from("experience")
      .update(experienceData)
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
      .from("experience")
      .delete()
      .eq("id", id);

    if (error) {
      throw { statusCode: 400, code: "DELETE_FAILED", message: error.message };
    }

    return true;
  }
}
