import { supabase } from "../config/supabase";

export class PhotosService {
  static async getAll(category?: string) {
    let query = supabase
      .from("photos")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (category && category !== "All") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      throw { statusCode: 500, code: "DATABASE_ERROR", message: error.message };
    }

    return data;
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw { statusCode: 404, code: "PHOTO_NOT_FOUND", message: "Foto tidak ditemukan" };
    }

    return data;
  }

  static async create(photoData: any) {
    const { data, error } = await supabase
      .from("photos")
      .insert([photoData])
      .select()
      .single();

    if (error) {
      throw { statusCode: 400, code: "INSERT_FAILED", message: error.message };
    }

    return data;
  }

  static async update(id: string, photoData: any) {
    const { data, error } = await supabase
      .from("photos")
      .update(photoData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw { statusCode: 400, code: "UPDATE_FAILED", message: error.message };
    }

    return data;
  }

  static async delete(id: string) {
    // 1. Get photo to retrieve its URL (to delete from storage)
    const photo = await this.getById(id);
    
    // 2. Delete photo from database
    const { error } = await supabase
      .from("photos")
      .delete()
      .eq("id", id);

    if (error) {
      throw { statusCode: 400, code: "DELETE_FAILED", message: error.message };
    }

    // 3. Try to clean up storage if it was stored in Supabase Storage
    if (photo.url && photo.url.includes("/storage/v1/object/public/photos/")) {
      try {
        const filePath = photo.url.split("/storage/v1/object/public/photos/")[1];
        if (filePath) {
          await supabase.storage.from("photos").remove([filePath]);
        }
      } catch (err) {
        console.error("Failed to clean up photo from storage:", err);
      }
    }

    return true;
  }
}
