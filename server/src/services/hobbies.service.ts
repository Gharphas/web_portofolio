import { supabase } from "../config/supabase";

export class HobbiesService {
  static async getAll() {
    const { data, error } = await supabase
      .from("hobbies")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      throw { statusCode: 500, code: "DATABASE_ERROR", message: error.message };
    }

    return data;
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from("hobbies")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw { statusCode: 404, code: "HOBBY_NOT_FOUND", message: "Hobi tidak ditemukan" };
    }

    return data;
  }

  static async create(hobbyData: any) {
    const { data, error } = await supabase
      .from("hobbies")
      .insert([hobbyData])
      .select()
      .single();

    if (error) {
      throw { statusCode: 400, code: "INSERT_FAILED", message: error.message };
    }

    return data;
  }

  static async update(id: string, hobbyData: any) {
    const { data, error } = await supabase
      .from("hobbies")
      .update(hobbyData)
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
      .from("hobbies")
      .delete()
      .eq("id", id);

    if (error) {
      throw { statusCode: 400, code: "DELETE_FAILED", message: error.message };
    }

    return true;
  }
}
