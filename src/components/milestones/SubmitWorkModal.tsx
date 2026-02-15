"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";
import { X, Upload, ImageIcon } from "lucide-react";
import {
  validateSubmissionImages,
  uploadSubmissionImages,
} from "@/lib/storage/submission";

const MAX_IMAGES = 3;
const MAX_SIZE_MB = 1;

interface SubmitWorkModalProps {
  open: boolean;
  milestoneId: string;
  projectId: string;
  milestoneTitle: string;
  onClose: () => void;
  onConfirm: (content: string, imageUrls: string[]) => Promise<void>;
  loading?: boolean;
}

export function SubmitWorkModal({
  open,
  milestoneId,
  projectId,
  milestoneTitle,
  onClose,
  onConfirm,
  loading = false,
}: SubmitWorkModalProps) {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const selected = Array.from(e.target.files || []);
    if (selected.length > MAX_IMAGES) {
      setFileError(`Maximum ${MAX_IMAGES} images allowed.`);
      return;
    }
    const err = validateSubmissionImages(selected);
    if (err) {
      setFileError(err);
      return;
    }
    setFiles(selected);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);
    const err = files.length ? validateSubmissionImages(files) : null;
    if (err) {
      setFileError(err);
      return;
    }
    let imageUrls: string[] = [];
    if (files.length > 0) {
      try {
        imageUrls = await uploadSubmissionImages(milestoneId, projectId, files);
      } catch (e) {
        setUploadError(e instanceof Error ? e.message : "Upload failed");
        return;
      }
    }
    await onConfirm(content.trim(), imageUrls);
    setContent("");
    setFiles([]);
    setFileError(null);
    setUploadError(null);
    onClose();
  };

  const handleClose = () => {
    if (!loading) {
      setContent("");
      setFiles([]);
      setFileError(null);
      setUploadError(null);
      onClose();
    }
  };

  if (!open) return null;

  const contentEl = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold">Submit Work</h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="p-1 rounded-lg text-muted-foreground hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto">
          <p className="text-sm text-muted-foreground">
            Milestone:{" "}
            <span className="font-medium text-foreground">{milestoneTitle}</span>
          </p>
          <div>
            <label
              htmlFor="submission-content"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Description & links
            </label>
            <textarea
              id="submission-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your deliverable, paste GitHub repo links, Figma links, or any relevant URLs..."
              className="w-full min-h-[140px] px-3 py-2 rounded-lg border border-slate-200 bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-y"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Screenshots / images (optional)
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              Max {MAX_IMAGES} images, each under {MAX_SIZE_MB}MB. JPEG, PNG, GIF, WebP.
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={loading || files.length >= MAX_IMAGES}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Add images ({files.length}/{MAX_IMAGES})
            </Button>
            {fileError && (
              <p className="text-xs text-red-600 mt-1">{fileError}</p>
            )}
            {files.length > 0 && (
              <ul className="mt-2 space-y-2">
                {files.map((file, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <ImageIcon className="h-4 w-4 shrink-0" />
                    <span className="truncate flex-1">{file.name}</span>
                    <span className="text-xs">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-700 p-0.5"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {uploadError && (
            <p className="text-sm text-red-600">{uploadError}</p>
          )}
          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Work"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(contentEl, document.body);
}
