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
    content: string;
    date: string | Date;
    start?: Date;
    end?: Date;
    type: "lesson" | "quiz";
    endDate?: string;
  }

  export interface CalendarEvent {
    id: number;
    title: string;
    content: string;
    start: Date;
    end: Date;
    type: "lesson" | "quiz";
    endDate?: string;
  }

  export interface TermInfo {
    name: string;
    startDate: string;
    endDate: string;
  }
  
  export interface LessonPlanResponse {
    lessons: Lesson[];
    termInfo: TermInfo;
  }