"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // Adjust the import based on your component library
import { Card, CardContent } from "@/components/ui/card"; // Adjust the import based on your component library

interface Lesson {
  id: number;
  title: string;
  type: "lesson" | "quiz";
  date: string;
  content: string;
}

const initialLessons: Lesson[] = [
  { id: 1, title: "Math - Algebra Basics", type: "lesson", date: "2024-01-05", content: "Introduction to variables and equations" },
  { id: 2, title: "Math - Algebra Quiz 1", type: "quiz", date: "2024-01-10", content: "Basic algebra quiz with 10 questions" },
  { id: 3, title: "Science - Intro to Biology", type: "lesson", date: "2024-01-12", content: "Understanding cells and DNA" },
];

const LessonsPage: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonContent, setNewLessonContent] = useState("");
  const [newLessonType, setNewLessonType] = useState<"lesson" | "quiz">("lesson");
  
  const addLesson = () => {
    if (newLessonTitle && newLessonContent) {
      const newLesson: Lesson = {
        id: lessons.length + 1,
        title: newLessonTitle,
        type: newLessonType,
        date: new Date().toISOString().split("T")[0], // Set to current date
        content: newLessonContent,
      };
      setLessons([...lessons, newLesson]);
      setNewLessonTitle("");
      setNewLessonContent("");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Lessons</h2>
      <div className="space-y-4">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="mb-4">
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{lesson.title}</h3>
                  <p className="text-sm text-gray-600">{lesson.content}</p>
                </div>
                <span className="text-xs text-gray-500">{lesson.date}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <input
          type="text"
          placeholder="Lesson Title"
          value={newLessonTitle}
          onChange={(e) => setNewLessonTitle(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <textarea
          placeholder="Lesson Content"
          value={newLessonContent}
          onChange={(e) => setNewLessonContent(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <select
          value={newLessonType}
          onChange={(e) => setNewLessonType(e.target.value as "lesson" | "quiz")}
          className="border p-2 mb-2 w-full"
        >
          <option value="lesson">Lesson</option>
          <option value="quiz">Quiz</option>
        </select>
        <Button variant="default" size="lg" onClick={addLesson}>
          Add New Lesson
        </Button>
      </div>
    </div>
  );
};

export default LessonsPage;
