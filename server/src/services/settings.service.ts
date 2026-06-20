import { supabase } from "../config/supabase";

export class SettingsService {
  static async getAll() {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*");

    if (error) {
      throw { statusCode: 500, code: "DATABASE_ERROR", message: error.message };
    }

    return data;
  }

  static async getByKey(key: string) {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("key", key)
      .single();

    if (error) {
      throw { statusCode: 404, code: "SETTING_NOT_FOUND", message: `Pengaturan dengan key ${key} tidak ditemukan` };
    }

    return data;
  }

  static async update(key: string, value: any, category?: string) {
    // Check if exists
    const { data: existing } = await supabase
      .from("site_settings")
      .select("*")
      .eq("key", key)
      .limit(1);

    if (existing && existing.length > 0) {
      const { data, error } = await supabase
        .from("site_settings")
        .update({
          value,
          ...(category ? { category } : {}),
        })
        .eq("key", key)
        .select()
        .single();

      if (error) {
        throw { statusCode: 400, code: "UPDATE_FAILED", message: error.message };
      }
      return data;
    } else {
      const { data, error } = await supabase
        .from("site_settings")
        .insert([{
          key,
          value,
          category: category || "general",
        }])
        .select()
        .single();

      if (error) {
        throw { statusCode: 400, code: "INSERT_FAILED", message: error.message };
      }
      return data;
    }
  }

  static async bulkUpdate(settings: Array<{ key: string; value: any; category?: string }>) {
    const promises = settings.map((item) =>
      this.update(item.key, item.value, item.category)
    );

    await Promise.all(promises);
    return true;
  }
}
