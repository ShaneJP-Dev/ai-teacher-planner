// components/AILessonGenerator.tsx
import { useState } from "react";
import { Lesson, LessonPlannerInput } from "@/types";

interface AILessonGeneratorProps {
  onLessonsGenerated: (lessons: Lesson[]) => void;
}

export function AILessonGenerator({ onLessonsGenerated }: AILessonGeneratorProps) {
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
    setIsGenerating(true);
    try {
      const response = await fetch("/api/lessongenerate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plannerInput),
      });

      if (!response.ok) {
        throw new Error("Failed to generate lesson plan");
      }

      const data = await response.json();
      onLessonsGenerated(data.lessons);
    } catch (error) {
      console.error("Failed to generate lesson plan:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">AI Lesson Generator</h2>
      <form 
        onSubmit={(e) => { e.preventDefault(); generateLessonPlan(); }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <input
            type="text"
            name="term"
            value={plannerInput.term}
            onChange={handleInputChange}
            placeholder="Term"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button 
          type="submit" 
          disabled={isGenerating}
          className={`w-full py-2 px-4 rounded-md text-white font-medium
            ${isGenerating 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 transition-colors'
            }`}
        >
          {isGenerating ? "Generating..." : "Generate Lesson Plan"}
        </button>
      </form>
    </div>
  );
}