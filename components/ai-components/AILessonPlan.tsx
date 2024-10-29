// components/AILessonGenerator.tsx
import { useState } from "react";
import { Lesson, LessonPlannerInput, TermInfo } from "@/types";

interface AILessonGeneratorProps {
  onLessonsGenerated: (lessons: Lesson[], termInfo: TermInfo) => void;
}

export function AILessonGenerator({
  onLessonsGenerated,
}: AILessonGeneratorProps) {
  const [plannerInput, setPlannerInput] = useState<LessonPlannerInput>({
    grade: "",
    subject: "",
    curriculum: "",
    term: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPlannerInput((prev) => ({ ...prev, [name]: value }));
  };

  const generateLessonPlan = async () => {
    if (
      !plannerInput.grade ||
      !plannerInput.subject ||
      !plannerInput.curriculum ||
      !plannerInput.term
    ) {
      alert("Please fill in all fields");
      return;
    }

    setIsGenerating(true);
    try {
      // Ensure the term is just the number
      const termNumber = plannerInput.term.replace(/[^1-4]/g, "");

      const response = await fetch("/api/lessongenerate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...plannerInput,
          term: termNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate lesson plan");
      }

      const data = await response.json();
      onLessonsGenerated(data.lessons, data.termInfo);
    } catch (error) {
      console.error("Failed to generate lesson plan:", error);
      // Type check the error before accessing message property
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unexpected error occurred");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        AI Lesson Generator
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          generateLessonPlan();
        }}
        className="space-y-4"
      >
        <input
          type="text"
          name="grade"
          value={plannerInput.grade}
          onChange={handleInputChange}
          placeholder="Grade"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="subject"
          value={plannerInput.subject}
          onChange={handleInputChange}
          placeholder="Subject"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="curriculum"
          value={plannerInput.curriculum}
          onChange={handleInputChange}
          placeholder="Curriculum"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="term"
          value={plannerInput.term}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Select Term</option>
          <option value="1">Term 1 (Mid-January to late March)</option>
          <option value="2">Term 2 (Early April to late June)</option>
          <option value="3">Term 3 (Mid-July to late September)</option>
          <option value="4">Term 4 (Early October to mid-December)</option>
        </select>
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md text-white font-medium
            ${
              isGenerating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 transition-colors"
            }`}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate Lesson Plan"}
        </button>
      </form>
    </div>
  );
}
