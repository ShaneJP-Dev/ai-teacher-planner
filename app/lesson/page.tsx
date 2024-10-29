"use client";

import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Lesson, TermInfo } from "@/types";
import { AILessonGenerator } from "@/components/ai-components/AILessonPlan";
import { LessonScheduler } from "@/components/layout/LessonScheduler";
import { format } from "date-fns";

export function LessonPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [newlyAddedLessonIds, setNewlyAddedLessonIds] = useState<number[]>([]);
  const [termInfo, setTermInfo] = useState<TermInfo | null>(null);

  const handleGeneratedLessons = (
    generatedLessons: Lesson[],
    newTermInfo: TermInfo
  ) => {
    setLessons((prevLessons) => {
      const newIds: number[] = [];
      const updatedLessons = [...prevLessons];

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
          ? { ...lesson, date: start, endDate: end.toISOString() }
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

          {/* Term Info */}
          {termInfo && (
            <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
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
        </div>

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
            <div key={lesson.id} className="mb-4 p-4 border border-gray-200">
              <h3 className="text-lg font-bold">{lesson.title}</h3>
              <p>
                <strong>Type:</strong> {lesson.type}
              </p>
              <p>
                <strong>Date:</strong> {format(new Date(lesson.date), "PPP")}
              </p>
              {lesson.endDate && (
                <p>
                  <strong>End Date:</strong>{" "}
                  {format(new Date(lesson.endDate), "PPP")}
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
