import { supabase } from "../config/supabase";

export class EducationService {
  static async getAll() {
    const { data, error } = await supabase
      .from("education")
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
      .from("education")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw { statusCode: 404, code: "EDUCATION_NOT_FOUND", message: "Riwayat pendidikan tidak ditemukan" };
    }

    return data;
  }

  static async create(educationData: any) {
    const { data, error } = await supabase
      .from("education")
      .insert([educationData])
      .select()
      .single();

    if (error) {
      throw { statusCode: 400, code: "INSERT_FAILED", message: error.message };
    }

    return data;
  }

  static async update(id: string, educationData: any) {
    const { data, error } = await supabase
      .from("education")
      .update(educationData)
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
      .from("education")
      .delete()
      .eq("id", id);

    if (error) {
      throw { statusCode: 400, code: "DELETE_FAILED", message: error.message };
    }

    return true;
  }
}
