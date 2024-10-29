// app/api/generatequiz/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

function cleanJsonString(str: string): string {
  // Remove any markdown formatting
  str = str.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  
  // Remove any leading/trailing whitespace
  str = str.trim();
  
  // Handle potential line breaks and formatting issues
  str = str.replace(/[\r\n]+/g, ' ');
  
  // Remove any extra spaces between json elements
  str = str.replace(/\s+/g, ' ');
  
  return str;
}

export async function POST(req: Request) {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
        const model = genAI.getGenerativeModel({ model: "gemini-pro" })
        const data = await req.json()
        
        if (data.type === "generateQuiz") {
            const prompt = `Generate an educational quiz with the following specifications:
            Subject: ${data.subject}
            Topic: ${data.topic}
            Number of questions: ${data.numberOfQuestions}
            Difficulty: ${data.difficulty}
            Target Grade: ${data.targetGrade}
            Learning Objectives: ${data.learningObjectives}
            Question Types: ${data.questionTypes.join(', ')}

            Important: Return ONLY a valid JSON object with no additional text or formatting.
            The response must be a single JSON object with this exact structure:
            {
                "title": string,
                "subject": string,
                "topic": string,
                "difficulty": string,
                "targetGrade": string,
                "totalTime": string,
                "questions": [
                    {
                        "id": number,
                        "type": string,
                        "question": string,
                        "options": string[],
                        "correctAnswer": string,
                        "explanation": string,
                        "relatedConcepts": string[],
                        "difficultyRating": string,
                        "estimatedTime": string
                    }
                ]
            }`;

            try {
                const result = await model.generateContent(prompt);
                const response = await result.response;
                let output = await response.text();

                // Clean the response
                output = cleanJsonString(output);

                try {
                    // Attempt to parse the cleaned output as JSON
                    const jsonData = JSON.parse(output);
                    
                    // Validate the required structure
                    if (!jsonData.title || !jsonData.questions || !Array.isArray(jsonData.questions)) {
                        throw new Error("Invalid quiz structure");
                    }

                    return NextResponse.json({ output: jsonData });
                } catch (parseError) {
                    console.error("JSON parsing error:", parseError);
                    console.error("Cleaned output:", output);
                    return NextResponse.json({ 
                        error: "Failed to parse quiz data", 
                        details: parseError instanceof Error ? parseError.message : "Unknown parsing error",
                        rawOutput: output 
                    }, { status: 500 });
                }
            } catch (generationError) {
                console.error("Generation error:", generationError);
                return NextResponse.json({ 
                    error: "Failed to generate quiz content",
                    details: generationError instanceof Error ? generationError.message : "Unknown generation error"
                }, { status: 500 });
            }
        }
        
        return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
        
    } catch (error) {
        console.error("Server error:", error);
        return NextResponse.json({ 
            error: "Server error",
            details: error instanceof Error ? error.message : "Unknown server error"
        }, { status: 500 });
    }
}