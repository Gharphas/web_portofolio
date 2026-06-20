import { supabase } from "../config/supabase";

export class ContactService {
  static async sendMessage(messageData: any) {
    const { data, error } = await supabase
      .from("contact_messages")
      .insert([messageData])
      .select()
      .single();

    if (error) {
      throw { statusCode: 400, code: "SEND_FAILED", message: error.message };
    }

    return data;
  }

  static async getAllMessages() {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw { statusCode: 500, code: "DATABASE_ERROR", message: error.message };
    }

    return data;
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw { statusCode: 404, code: "MESSAGE_NOT_FOUND", message: "Pesan tidak ditemukan" };
    }

    return data;
  }

  static async markAsRead(id: string, isRead: boolean) {
    const { data, error } = await supabase
      .from("contact_messages")
      .update({ is_read: isRead })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw { statusCode: 400, code: "UPDATE_FAILED", message: error.message };
    }

    return data;
  }

  static async toggleStar(id: string) {
    // 1. Get current star status
    const message = await this.getById(id);

    // 2. Toggle status
    const { data, error } = await supabase
      .from("contact_messages")
      .update({ is_starred: !message.is_starred })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw { statusCode: 400, code: "UPDATE_FAILED", message: error.message };
    }

    return data;
  }

  static async deleteMessage(id: string) {
    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      throw { statusCode: 400, code: "DELETE_FAILED", message: error.message };
    }

    return true;
  }
}
