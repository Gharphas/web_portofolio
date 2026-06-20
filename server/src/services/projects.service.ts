import { supabase } from "../config/supabase";

export class ProjectsService {
  static async getAll(filters: { category?: string; is_featured?: boolean }) {
    let query = supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (filters.category && filters.category !== "All") {
      query = query.eq("category", filters.category);
    }

    if (filters.is_featured !== undefined) {
      query = query.eq("is_featured", filters.is_featured);
    }

    const { data, error } = await query;

    if (error) {
      throw { statusCode: 500, code: "DATABASE_ERROR", message: error.message };
    }

    return data;
  }

  static async getBySlug(slug: string) {
    // 1. Get project
    const { data: project, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !project) {
      throw { statusCode: 404, code: "PROJECT_NOT_FOUND", message: "Proyek tidak ditemukan" };
    }

    // 2. Get project images
    const { data: images, error: imgError } = await supabase
      .from("project_images")
      .select("*")
      .eq("project_id", project.id)
      .order("sort_order", { ascending: true });

    return {
      ...project,
      images: imgError ? [] : images,
    };
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return null;
    }
    return data;
  }

  static async create(projectData: any) {
    const { data, error } = await supabase
      .from("projects")
      .insert([projectData])
      .select()
      .single();

    if (error) {
      throw { statusCode: 400, code: "INSERT_FAILED", message: error.message };
    }

    return data;
  }

  static async update(id: string, projectData: any) {
    const { data, error } = await supabase
      .from("projects")
      .update(projectData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw { statusCode: 400, code: "UPDATE_FAILED", message: error.message };
    }

    return data;
  }

  static async delete(id: string) {
    const { data, error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw { statusCode: 400, code: "DELETE_FAILED", message: error.message };
    }

    return data;
  }

  static async addImages(projectId: string, images: Array<{ image_url: string; caption?: string; sort_order?: number }>) {
    const rows = images.map((img) => ({
      project_id: projectId,
      image_url: img.image_url,
      caption: img.caption || null,
      sort_order: img.sort_order || 0,
    }));

    const { data, error } = await supabase
      .from("project_images")
      .insert(rows)
      .select();

    if (error) {
      throw { statusCode: 400, code: "INSERT_IMAGES_FAILED", message: error.message };
    }

    return data;
  }

  static async deleteImage(projectId: string, imageId: string) {
    const { error } = await supabase
      .from("project_images")
      .delete()
      .eq("id", imageId)
      .eq("project_id", projectId);

    if (error) {
      throw { statusCode: 400, code: "DELETE_IMAGE_FAILED", message: error.message };
    }

    return true;
  }
}
