"use client";

import { useState } from "react";

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/report-gen", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch image");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "report.png";
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Free memory
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Error downloading:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Download Report Example</h1>

        <button
          onClick={handleFetch}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Downloading..." : "Download Report (PNG)"}
        </button>
      </div>
    </div>
  );
}
