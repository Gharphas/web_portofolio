import { supabase } from "../config/supabase";

export class SkillsService {
  static async getAll() {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      throw { statusCode: 500, code: "DATABASE_ERROR", message: error.message };
    }

    return data;
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw { statusCode: 404, code: "SKILL_NOT_FOUND", message: "Keahlian tidak ditemukan" };
    }

    return data;
  }

  static async create(skillData: any) {
    const { data, error } = await supabase
      .from("skills")
      .insert([skillData])
      .select()
      .single();

    if (error) {
      throw { statusCode: 400, code: "INSERT_FAILED", message: error.message };
    }

    return data;
  }

  static async update(id: string, skillData: any) {
    const { data, error } = await supabase
      .from("skills")
      .update(skillData)
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
      .from("skills")
      .delete()
      .eq("id", id);

    if (error) {
      throw { statusCode: 400, code: "DELETE_FAILED", message: error.message };
    }

    return true;
  }

  static async reorder(orders: Array<{ id: string; sort_order: number }>) {
    // Perform bulk updates. Since Supabase client doesn't support bulk update with different values easily in a single call,
    // we perform multiple queries inside a transaction or sequentially (Promise.all is fine for dashboard reordering).
    const promises = orders.map((item) =>
      supabase
        .from("skills")
        .update({ sort_order: item.sort_order })
        .eq("id", item.id)
    );

    const results = await Promise.all(promises);

    const error = results.find((r) => r.error);
    if (error) {
      throw { statusCode: 400, code: "REORDER_FAILED", message: error.error?.message };
    }

    return true;
  }
}
