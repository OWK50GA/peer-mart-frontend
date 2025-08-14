"use client";

import { useState, useRef, useCallback, SetStateAction, Dispatch } from "react";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";

interface FileUploadWithPreviewProps {
  id: string;
  label: string;
  value?: string; // The IPFS URI
  onChange: (uri: string, fileName: string) => void;
  error?: string;
  required?: boolean;
  accept?: string;
  isUploading?: boolean;
  setIsUploading?: (isUploading: boolean) => void;
  setPreviewUrl?: Dispatch<SetStateAction<string>>
}

interface UploadState {
  uploading: boolean;
  progress: number;
  success: boolean;
  error: string | null;
  fileName: string | null;
  previewUrl: string | null;
}

export const FileUploadWithPreview: React.FC<FileUploadWithPreviewProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  required = false,
  accept = "image/jpeg,image/png,image/jpg",
  isUploading = false,
  setIsUploading = () => { },
  setPreviewUrl
}) => {
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    success: false,
    error: null,
    fileName: null,
    previewUrl: null,
  });

  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetUploadState = useCallback(() => {
    setUploadState({
      uploading: false,
      progress: 0,
      success: false,
      error: null,
      fileName: null,
      previewUrl: null,
    });
  }, []);

  const validateFile = useCallback((file: File): string | null => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return "Please select a valid image file (JPEG, JPG, or PNG)";
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return "File size must be less than 5MB";
    }

    return null;
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setUploadState(prev => ({
        ...prev,
        error: validationError,
        uploading: false,
      }));
      return;
    }

    setUploadState(prev => ({
      ...prev,
      uploading: true,
      error: null,
      progress: 0,
    }));

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      if (previewUrl && setPreviewUrl) {
        setPreviewUrl(previewUrl)
      }

      const response = await fetch("/api/upload-file", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();

      setUploadState({
        uploading: false,
        progress: 100,
        success: true,
        error: null,
        fileName: file.name,
        previewUrl,
      });

      // Call onChange with the IPFS URI
      onChange(result.uri, file.name);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setUploadState(prev => ({ ...prev, success: false }));
      }, 3000);

    } catch (error) {
      console.error("Upload error:", error);
      setUploadState({
        uploading: false,
        progress: 0,
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
        fileName: null,
        previewUrl: null,
      });
    } finally {
      setIsUploading(false);
    }
  }, [validateFile, onChange, setIsUploading]);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    uploadFile(file);
  }, [uploadFile]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemove = useCallback(() => {
    resetUploadState();
    onChange("", "");
    if (uploadState.previewUrl) {
      URL.revokeObjectURL(uploadState.previewUrl);
    }
  }, [resetUploadState, onChange, uploadState.previewUrl]);

  const hasFile = Boolean(value || uploadState.fileName);
  const showPreview = Boolean(uploadState.previewUrl && !uploadState.error);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-white mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Upload Area */}
      {!hasFile && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-all cursor-pointer ${isDragOver
            ? "border-[#FF9B28] bg-[#FF9B281A]"
            : "border-gray-600 bg-[#FFFFFF1A] hover:border-[#FF9B28] hover:bg-[#FF9B281A]"
            }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            id={id}
          />

          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-white mb-2">
              <span className="font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-gray-400">
              JPEG, PNG, JPG up to 5MB
            </p>
          </div>

          {uploadState.uploading && (
            <div className="absolute inset-0 bg-[#00000080] rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF9B28] mx-auto mb-2"></div>
                <p className="text-sm">Uploading...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* File Preview */}
      {hasFile && (
        <div className="border border-gray-600 rounded-lg p-4 bg-[#FFFFFF1A]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showPreview && (
                <img
                  src={uploadState.previewUrl!}
                  alt="Preview"
                  className="w-12 h-12 object-cover rounded border"
                />
              )}
              <div>
                <p className="text-white text-sm font-medium">
                  {uploadState.fileName || "Uploaded file"}
                </p>
                {uploadState.success && (
                  <div className="flex items-center gap-1 text-green-400 text-xs">
                    <CheckCircle className="w-3 h-3" />
                    Upload successful
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="text-gray-400 hover:text-red-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {(uploadState.error || error) && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{uploadState.error || error}</span>
        </div>
      )}

      {/* Success Message */}
      {uploadState.success && (
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>File uploaded successfully to IPFS!</span>
        </div>
      )}
    </div>
  );
};