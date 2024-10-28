"use client"


import { useState } from "react";
import { Lesson } from "@/types";
import { AILessonGenerator } from "@/components/ai-components/AILessonPlan";

export function LessonPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonContent, setNewLessonContent] = useState("");
  const [newLessonType, setNewLessonType] = useState<"lesson" | "quiz">("lesson");

  const addLesson = () => {
    if (newLessonTitle && newLessonContent) {
      const newLesson: Lesson = {
        id: lessons.length + 1,
        title: newLessonTitle,
        type: newLessonType,
        date: new Date().toISOString().split("T")[0],
        content: newLessonContent,
      };
      setLessons([...lessons, newLesson]);
      setNewLessonTitle("");
      setNewLessonContent("");
    }
  };

  const handleGeneratedLessons = (generatedLessons: Lesson[]) => {
    setLessons((prev) => [...prev, ...generatedLessons]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Lesson Planning Page</h1>
      
      <div className="mb-8">
        <AILessonGenerator onLessonsGenerated={handleGeneratedLessons} />
      </div>

      {/* Add New Lesson Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Lesson</h2>
        <form 
          onSubmit={(e) => { e.preventDefault(); addLesson(); }}
          className="space-y-4"
        >
          <input
            type="text"
            value={newLessonTitle}
            onChange={(e) => setNewLessonTitle(e.target.value)}
            placeholder="Lesson Title"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={newLessonContent}
            onChange={(e) => setNewLessonContent(e.target.value)}
            placeholder="Lesson Content"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          />
          <select
            value={newLessonType}
            onChange={(e) => setNewLessonType(e.target.value as "lesson" | "quiz")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="lesson">Lesson</option>
            <option value="quiz">Quiz</option>
          </select>
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Add Lesson
          </button>
        </form>
      </div>

      {/* Display All Lessons */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800"> All Lessons</h2>
        {lessons.map((lesson) => (
          <div key={lesson.id} className="mb-4">
            <h3 className="text-lg font-bold">{lesson.title}</h3>
            <p>Type: {lesson.type}</p>
            <p>Date: {lesson.date}</p>
            <p>{lesson.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LessonPage;