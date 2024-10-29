import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { LessonPlannerInput, Lesson } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const TERM_DATES = {
  '1': { start: '01-15', end: '03-25', name: 'Term 1 (Mid-January to late March)' },
  '2': { start: '04-01', end: '06-25', name: 'Term 2 (Early April to late June)' },
  '3': { start: '07-15', end: '09-25', name: 'Term 3 (Mid-July to late September)' },
  '4': { start: '10-01', end: '12-15', name: 'Term 4 (Early October to mid-December)' }
};

function getTermDates(term: string, year = new Date().getFullYear()) {
  const termDates = TERM_DATES[term as keyof typeof TERM_DATES];
  if (!termDates) throw new Error('Invalid term');

  const startDate = new Date(`${year}-${termDates.start}`);
  const endDate = new Date(`${year}-${termDates.end}`);

  // Ensure valid dates
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Invalid date calculation');
  }

  return { startDate, endDate, termName: termDates.name };
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function calculateLessonDate(startDate: Date, week: number, day: number): Date | null {
  try {
    const lessonDate = new Date(startDate);
    lessonDate.setDate(startDate.getDate() + ((week - 1) * 7) + (day - 1));
    
    // Validate the date
    if (isNaN(lessonDate.getTime())) {
      return null;
    }
    
    return lessonDate;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const input: LessonPlannerInput = await req.json();
    const { startDate, endDate, termName } = getTermDates(input.term);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Create a detailed lesson plan for ${termName}:
      Grade: ${input.grade}
      Subject: ${input.subject}
      Curriculum: ${input.curriculum}
      Term Period: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}

      Generate a lesson plan specifically for this term period. 
      Each lesson entry must follow this exact format:
      Week,Day,Title,Content,Type

      Critical Requirements:
      1. Structure:
         - Week numbers must be 1-10
         - Day numbers must be 1-5 (1=Monday, 5=Friday)
         - No weekend classes
         - Each line must have exactly 5 elements separated by commas

      2. Content Guidelines:
         - Type must be either 'lesson' or 'quiz'
         - Include 1-2 quizzes every 2-3 weeks
         - Ensure content builds progressively
         - Align with ${input.curriculum} curriculum standards

      3. Term Specific:
         - Plan only for ${termName}
         - Account for approximately 50 school days
         - Ensure logical progression of topics
         
      Format each line exactly as: Week,Day,Title,Content,Type
      Example: 1,1,Introduction to Fractions,Basic concepts of numerator and denominator,lesson
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const lessons: Lesson[] = text
      .split("\n")
      .filter(line => line.trim())
      .map((line, index) => {
        try {
          const [weekStr, dayStr, title, content, type] = line
            .split(",")
            .map(item => item.trim());

          const week = parseInt(weekStr);
          const day = parseInt(dayStr);

          // Validate week and day
          if (isNaN(week) || isNaN(day) || week < 1 || week > 10 || day < 1 || day > 5) {
            return null;
          }

          const lessonDate = calculateLessonDate(startDate, week, day);
          if (!lessonDate || lessonDate > endDate || lessonDate < startDate || isWeekend(lessonDate)) {
            return null;
          }

          return {
            id: index + 1,
            title: title || "Untitled Lesson",
            content: content || "No content provided",
            type: type?.toLowerCase() === "quiz" ? "quiz" : "lesson",
            date: lessonDate.toISOString().split('T')[0],
            week,
            day
          } as Lesson;
        } catch {
          return null;
        }
      })
      .filter((lesson): lesson is Lesson => lesson !== null);

    // Sort lessons by date
    lessons.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return NextResponse.json({ 
      lessons,
      termInfo: {
        name: termName,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      }
    });
  } catch (error) {
    console.error("Error generating lesson plan:", error);
    return NextResponse.json(
      { error: "Failed to generate lesson plan" },
      { status: 500 }
    );
  }
}