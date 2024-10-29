"use client";

import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Lesson, TermInfo } from "@/types";
import { AILessonGenerator } from "@/components/ai-components/AILessonPlan";
import { LessonScheduler } from "@/components/layout/LessonScheduler";
import { format } from 'date-fns';

export function LessonPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonContent, setNewLessonContent] = useState("");
  const [newLessonType, setNewLessonType] = useState<"lesson" | "quiz">(
    "lesson"
  );
  const [termInfo, setTermInfo] = useState<TermInfo | null>(null);

  const addLesson = () => {
    if (newLessonTitle && newLessonContent) {
      const newLesson: Lesson = {
        id: lessons.length + 1,
        title: newLessonTitle,
        type: newLessonType,
        date: new Date(),
        content: newLessonContent,
      };
      setLessons([...lessons, newLesson]);
      setNewLessonTitle("");
      setNewLessonContent("");
    }
  };

  const [newlyAddedLessonIds, setNewlyAddedLessonIds] = useState<number[]>([]);

  const handleGeneratedLessons = (
    generatedLessons: Lesson[],
    newTermInfo: TermInfo
  ) => {
    setLessons((prevLessons) => {
      const updatedLessons = [...prevLessons];
      const newIds: number[] = [];

      generatedLessons.forEach((newLesson) => {
        if (!updatedLessons.some((lesson) => lesson.id === newLesson.id)) {
          updatedLessons.push(newLesson);
          newIds.push(newLesson.id);
        }
      });

      setNewlyAddedLessonIds(newIds);

      return updatedLessons.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    });

    setTermInfo(newTermInfo);
  };

  const handleLessonMove = (movedLesson: Lesson, start: Date, end: Date) => {
    setLessons((prevLessons) =>
      prevLessons.map((lesson) =>
        lesson.id === movedLesson.id
          ? {
              ...lesson,
              date: start, // Use the start Date directly
              endDate: end.toISOString(), // Convert end Date to ISO string if needed
            }
          : lesson
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Lesson Planning Page
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* AI Lesson Generator */}
          <div className="w-full lg:w-1/2">
            <AILessonGenerator onLessonsGenerated={handleGeneratedLessons} />
          </div>

          {/* Add New Lesson Form */}
          <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Add New Lesson
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addLesson();
              }}
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
                onChange={(e) =>
                  setNewLessonType(e.target.value as "lesson" | "quiz")
                }
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
        </div>

        {/* Term Info Display */}
        {termInfo && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold mb-2 text-gray-800">
              Current Term
            </h2>
            <p>
              <strong>Name:</strong> {termInfo.name}
            </p>
            <p>
              <strong>Start Date:</strong> {termInfo.startDate}
            </p>
            <p>
              <strong>End Date:</strong> {termInfo.endDate}
            </p>
          </div>
        )}

        {/* Lesson Scheduler */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Lesson Schedule
          </h2>
          <LessonScheduler
            lessons={lessons}
            onLessonMove={handleLessonMove}
            newlyAddedLessonIds={newlyAddedLessonIds}
          />
        </div>

        {/* Display All Lessons */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">All Lessons</h2>
          {lessons.map((lesson) => (
      <div
        key={lesson.id}
        className="mb-4 p-4 border border-gray-200 rounded-md"
      >
        <h3 className="text-lg font-bold">{lesson.title}</h3>
        <p>
          <strong>Type:</strong> {lesson.type}
        </p>
        <p>
          <strong>Date:</strong> {format(new Date(lesson.date), 'PPP')}
        </p>
        {lesson.endDate && (
          <p>
            <strong>End Date:</strong> {format(new Date(lesson.endDate), 'PPP')}
          </p>
        )}
        <p>
          <strong>Content:</strong> {lesson.content}
        </p>
      </div>
    ))}

        </div>
      </div>
    </DndProvider>
  );
}

export default LessonPage;
