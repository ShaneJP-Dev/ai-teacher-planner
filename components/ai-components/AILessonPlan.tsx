import React, { useState } from "react";
import { Lesson, LessonPlannerInput, TermInfo } from "@/types";
import { LessonScheduler } from "../layout/LessonScheduler";
import Loader from "../loader/Loader"; // Import Loader component

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
  const [generatedLessons, setGeneratedLessons] = useState<Lesson[]>([]);
  const [termInfo, setTermInfo] = useState<TermInfo | null>(null);
  const [newlyAddedLessonIds, setNewlyAddedLessonIds] = useState<number[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);

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
      setGeneratedLessons(data.lessons);
      setTermInfo(data.termInfo);
      setNewlyAddedLessonIds(data.lessons.map((lesson: Lesson) => lesson.id));
      onLessonsGenerated(data.lessons, data.termInfo);
      setShowCalendar(true);
    } catch (error) {
      console.error("Failed to generate lesson plan:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unexpected error occurred");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLessonMove = (lesson: Lesson, start: Date, end: Date) => {
    const updatedLesson: Lesson = {
      ...lesson,
      date: start,
      endDate: end.toISOString(),
    };

    const updatedLessons = generatedLessons.map((l) =>
      l.id === updatedLesson.id ? updatedLesson : l
    );

    setGeneratedLessons(updatedLessons);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">AI Lesson Generator</h2>
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
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Term</option>
          <option value="Term 1">Term 1</option>
          <option value="Term 2">Term 2</option>
          <option value="Term 3">Term 3</option>
          <option value="Term 4">Term 4</option>
        </select>
        <button
          type="submit"
          disabled={isGenerating}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Generate Lesson Plan
        </button>
      </form>

      {isGenerating ? (  // Show Loader while generating
        <Loader />
      ) : showCalendar && ( // Show Calendar if generation is complete
        <LessonScheduler
          lessons={generatedLessons}
          onLessonMove={handleLessonMove}
          newlyAddedLessonIds={newlyAddedLessonIds}
        />
      )}
    </div>
  );
}
