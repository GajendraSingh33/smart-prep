"use client";

import { useState } from "react";

interface Props {
  onSubmit: (formData: FormData) => void;
}

export default function InputForm({ onSubmit }: Props) {
  const [syllabus, setSyllabus] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("syllabus", syllabus);
    for (const file of files) {
      formData.append("files", file);
    }
    onSubmit(formData);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl space-y-5 border border-purple-200"
    >
      {/* Textarea for syllabus */}
      <textarea
        className="w-full p-4 rounded-xl border-2 border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 
                   placeholder-pink-400 text-gray-800 shadow-sm"
        placeholder="Paste syllabus topics here..."
        value={syllabus}
        onChange={(e) => setSyllabus(e.target.value)}
        rows={4}
      />

      {/* File upload */}
      <input
        type="file"
        multiple
        accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.png,.jpg,.jpeg"
        onChange={onFileChange}
        className="w-full p-3 rounded-xl border-2 border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 
                   placeholder-indigo-400 text-gray-800 shadow-sm cursor-pointer bg-white"
      />

      {/* Selected file list */}
      {files.length > 0 && (
        <div className="text-sm text-gray-700 bg-indigo-50 p-2 rounded-lg">
          📂 Selected: {files.map((f) => f.name).join(", ")}
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        className="w-full py-3 rounded-xl font-semibold text-white 
                   bg-gradient-to-r from-green-400 to-emerald-500 
                   hover:from-emerald-500 hover:to-green-400 
                   shadow-lg transform hover:scale-105 transition"
      >
        🚀 Generate Questions
      </button>
    </form>
  );
}
