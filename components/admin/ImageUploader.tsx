"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
  className?: string;
}

export function ImageUploader({
  value,
  onChange,
  bucket = "photos",
  folder = "",
  className = "",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", bucket);
    formData.append("folder", folder);

    const token = localStorage.getItem("rianpedia_admin_token");

    try {
      const response = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error?.message || "Gagal mengunggah gambar");
      }

      onChange(resData.data.url);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Gagal mengunggah file. Pastikan server aktif.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 font-sans ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {value ? (
        <div className="relative group w-full max-w-[200px] h-[150px] rounded-xl overflow-hidden border border-border/40 bg-secondary/10">
          <Image
            src={value}
            alt="Uploaded file"
            fill
            sizes="200px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={triggerSelect}
              className="p-1.5 rounded-lg bg-background/80 hover:bg-background text-foreground text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              Ganti
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 rounded-lg bg-destructive/90 hover:bg-destructive text-destructive-foreground hover:scale-105 transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={triggerSelect}
          className="border border-dashed border-border/60 hover:border-primary/50 bg-secondary/15 hover:bg-secondary/25 transition-all rounded-xl p-6 text-center cursor-pointer flex flex-col items-center justify-center gap-2 max-w-[200px] min-h-[150px]"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">Mengunggah...</span>
            </div>
          ) : (
            <>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-foreground">Unggah Gambar</p>
                <p className="text-[9px] text-muted-foreground mt-0.5">PNG, JPG, WebP s.d. 5MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-[10px] font-medium text-destructive font-sans">
          {error}
        </p>
      )}
    </div>
  );
}
