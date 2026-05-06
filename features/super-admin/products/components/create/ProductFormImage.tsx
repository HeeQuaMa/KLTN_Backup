"use client";

import { useCallback } from "react";

export type ProductFormImageProps = {
  files: File[];
  onFilesChange: (files: File[]) => void;
  previewUrls: string[];
};

export function ProductFormImage({
  files,
  onFilesChange,
  previewUrls,
}: ProductFormImageProps) {
  const mergeFiles = useCallback(
    (incoming: File[]) => {
      const next = [...files, ...incoming].slice(0, 15);
      onFilesChange(next);
    },
    [files, onFilesChange],
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list?.length) return;
    mergeFiles(Array.from(list));
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const list = e.dataTransfer.files;
    if (!list?.length) return;
    mergeFiles(Array.from(list).filter((f) => f.type.startsWith("image/")));
  };

  const removeAt = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-bold text-slate-800">4. Hình ảnh</h2>

      <label className="block cursor-pointer">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="sr-only"
          onChange={onInputChange}
        />
        <div
          role="presentation"
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={onDrop}
          className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/30 py-12 px-6 text-center transition-colors hover:bg-blue-50/50"
        >
          <p className="text-sm font-semibold text-blue-600">
            Kéo thả ảnh vào đây
          </p>
          <p className="mt-1 text-xs text-slate-500">
            hoặc nhấn để chọn (tối đa 15 ảnh, mỗi ảnh tối đa 5MB)
          </p>
        </div>
      </label>

      {previewUrls.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {previewUrls.map((url, i) => (
            <li
              key={`${files[i]?.name ?? "f"}-${files[i]?.lastModified ?? i}-${i}`}
              className="relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="size-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute right-1 top-1 rounded bg-black/60 px-2 py-0.5 text-xs text-white hover:bg-black/80"
              >
                Xóa
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
