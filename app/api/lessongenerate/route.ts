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
      Create a detailed lesson plan for:
      Grade: ${input.grade}
      Subject: ${input.subject}
      Curriculum: ${input.curriculum}
      Term: ${input.term}

      Please provide 5 daily lessons in the following format exactly:
      Title,Content,Type
      
      Each line should contain these three elements separated by commas.
      Type should be either 'lesson' or 'quiz'.
      Please ensure each line follows this exact format.
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response into lessons
    const lessons: Lesson[] = text
      .split("\n")
      .filter((line) => line.trim()) // Remove empty lines
      .map((line, index) => {
        const [title, content, type] = line
          .split(",")
          .map((item) => item.trim());
        return {
          id: index + 1,
          title: title || "Untitled Lesson",
          content: content || "No content provided",
          type: type?.toLowerCase() === "quiz" ? "quiz" : "lesson",
          date: new Date(Date.now() + index * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
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
