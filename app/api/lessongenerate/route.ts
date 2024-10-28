import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { LessonPlannerInput, Lesson } from '@/types';

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// POST handler for the API route
export async function POST(req: Request) {
  try {
    // Parse the request body
    const input: LessonPlannerInput = await req.json();

    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create the prompt
    const prompt = `
      Create a detailed lesson plan for an entire term:
      Grade: ${input.grade}
      Subject: ${input.subject}
      Curriculum: ${input.curriculum}
      Term: ${input.term}

      Please provide a comprehensive breakdown of lessons for the entire term. 
      Each lesson should be in the following format:
      Week,Day,Title,Content,Type

      Each line should contain these five elements separated by commas.
      Type should be either 'lesson' or 'quiz'.
      Assume a 12-week term with 5 school days per week.
      Please ensure each line follows this exact format and provide a total of 60 lessons/quizzes.
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Get the current date
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0); // Set to beginning of the day

    // Parse the response into lessons
    const lessons: Lesson[] = text
      .split("\n")
      .filter((line) => line.trim()) // Remove empty lines
      .map((line, index) => {
        const [week, day, title, content, type] = line
          .split(",")
          .map((item) => item.trim());
        
        // Calculate the date based on week and day
        const lessonDate = new Date(startDate);
        lessonDate.setDate(startDate.getDate() + (parseInt(week) - 1) * 7 + (parseInt(day) - 1));
        
        return {
          id: index + 1,
          title: title || "Untitled Lesson",
          content: content || "No content provided",
          type: type?.toLowerCase() === "quiz" ? "quiz" : "lesson",
          date: lessonDate.toISOString().split("T")[0],
          week: parseInt(week),
          day: parseInt(day)
        };
      });

    // Return the response
    return NextResponse.json({ lessons });
  } catch (error) {
    console.error("Error generating lesson plan:", error);
    return NextResponse.json(
      { error: "Failed to generate lesson plan" },
      { status: 500 }
    );
  }
}