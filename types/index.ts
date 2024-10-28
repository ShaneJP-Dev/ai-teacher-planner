// types/index.ts
export interface LessonPlannerInput {
    grade: string;
    subject: string;
    curriculum: string;
    term: string;
  }
  
  export interface Lesson {
    id: number;
    title: string;
    type: "lesson" | "quiz";
    date: string;
    content: string;
  }