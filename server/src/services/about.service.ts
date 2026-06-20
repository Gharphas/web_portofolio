import { supabase } from "../config/supabase";

export class AboutService {
  static async get() {
    const { data, error } = await supabase
      .from("about")
      .select("*")
      .limit(1);

    if (error) {
      throw { statusCode: 500, code: "DATABASE_ERROR", message: error.message };
    }

    return data && data.length > 0 ? data[0] : null;
  }

  static async update(aboutData: any) {
    // Check if row already exists
    const current = await this.get();

    if (current) {
      const { data, error } = await supabase
        .from("about")
        .update(aboutData)
        .eq("id", current.id)
        .select()
        .single();

      if (error) {
        throw { statusCode: 400, code: "UPDATE_FAILED", message: error.message };
      }
      return data;
    } else {
      const { data, error } = await supabase
        .from("about")
        .insert([aboutData])
        .select()
        .single();

      if (error) {
        throw { statusCode: 400, code: "INSERT_FAILED", message: error.message };
      }
      return data;
    }
  }
}
