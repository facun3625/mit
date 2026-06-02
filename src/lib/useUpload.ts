import { useState } from "react";

export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File): Promise<string | null> {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Error al subir"); return null; }
      return data.url as string;
    } catch {
      setError("Error de red");
      return null;
    } finally {
      setUploading(false);
    }
  }

  return { upload, uploading, error };
}
