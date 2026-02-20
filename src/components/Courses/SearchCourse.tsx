"use client";

import { useMemo, useState } from "react";
import SingleCourseSearchCard from "@/components/Courses/SingleCourse";

const SearchCoursePage = () => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = useMemo(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResults([]);

    if (!token) {
      setError("You must sign in first.");
      return;
    }

    if (!keyword.trim()) {
      setError("Please enter a search keyword.");
      return;
    }

    setLoading(true);
    try {
      const url = `https://localhost:7145/api/courses/SearchCourse?keyword=${encodeURIComponent(
        keyword.trim()
      )}`;

      const res = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || `Failed (${res.status})`);
      }

      const data = await res.json();
      const arr = Array.isArray(data) ? data : data?.items ?? [];
      if (!Array.isArray(arr)) throw new Error("API did not return an array");

      setResults(arr);
    } catch (e: any) {
      setError(e?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Search Courses</h1>
        <p className="text-body-color dark:text-body-color-dark mt-1 text-sm">
          Find courses by keyword.
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="shadow-three dark:bg-dark mb-10 rounded-sm bg-white p-6"
      >
        {error && (
          <div className="mb-5 rounded-xs border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Type a keyword (e.g., React, .NET, UI/UX)"
            className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-none transition-all duration-300 dark:border-transparent dark:bg-[#2C303B]"
          />

          <button
            type="submit"
            disabled={loading}
            className="shadow-submit dark:shadow-submit-dark bg-primary hover:bg-primary/90 rounded-xs px-8 py-3 text-base font-medium text-white duration-300 disabled:opacity-60"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-center py-12">Loading...</p>
      ) : results.length === 0 ? (
        <div className="rounded-xs border border-stroke bg-white p-8 text-center text-body-color dark:border-white/10 dark:bg-dark dark:text-body-color-dark">
          No results yet. Try searching.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {results.map((course: any, index: number) => (
            <SingleCourseSearchCard
              key={String(course?.id ?? course?.courseId ?? index)}
              course={course}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchCoursePage;
