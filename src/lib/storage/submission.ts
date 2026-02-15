import { supabase } from "../supabase/client";

const BUCKET = "milestone-submissions";
const MAX_FILES = 3;
const MAX_SIZE_BYTES = 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export function validateSubmissionImages(files: File[]): string | null {
  if (files.length > MAX_FILES) return `Maximum ${MAX_FILES} images allowed.`;
  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type))
      return `Invalid type: ${file.name}. Use JPEG, PNG, GIF, or WebP.`;
    if (file.size > MAX_SIZE_BYTES)
      return `${file.name} is over 1MB. Each image must be under 1MB.`;
  }
  return null;
}

export async function uploadSubmissionImages(
  milestoneId: string,
  projectId: string,
  files: File[]
): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${projectId}/${milestoneId}/${Date.now()}-${i}.${ext}`;
    const { data, error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) throw new Error(`Upload failed: ${error.message}`);
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
    urls.push(urlData.publicUrl);
  }
  return urls;
}
