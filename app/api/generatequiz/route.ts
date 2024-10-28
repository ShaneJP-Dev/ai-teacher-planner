// app/api/generate/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

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
            Target Age Group: ${data.targetAge}
            Learning Objectives: ${data.learningObjectives}
            Question Types: ${data.questionTypes.join(', ')}

            For each question, include:
            1. A clear question statement
            2. Multiple answer options (for multiple choice)
            3. The correct answer
            4. A detailed explanation of why this is the correct answer
            5. Related concepts or topics
            6. Difficulty rating
            7. Estimated time to answer

            Please return the quiz as a clean JSON object without any markdown formatting or code blocks.
            Use the following JSON format:
            {
                "title": "Quiz Title",
                "subject": "Subject Name",
                "topic": "Topic Name",
                "difficulty": "Difficulty Level",
                "targetAge": "Age Range",
                "totalTime": "Estimated total time",
                "questions": [
                    {
                        "id": "unique_id",
                        "type": "question_type",
                        "question": "Question text",
                        "options": ["option1", "option2", "option3", "option4"],
                        "correctAnswer": "Correct option",
                        "explanation": "Detailed explanation of the answer",
                        "relatedConcepts": ["concept1", "concept2"],
                        "difficultyRating": "Easy/Medium/Hard",
                        "estimatedTime": "time in minutes"
                    }
                ]
            }`;

            const result = await model.generateContent(prompt);
            const response = await result.response;

            // Get the response text
            let output = await response.text();

            // Clean the response by removing any markdown formatting
            // This assumes the response might include code block markers for JSON
            output = output.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

            try {
                // Attempt to parse the cleaned output as JSON
                const jsonData = JSON.parse(output);
                
                // If parsing is successful, return the JSON data
                return NextResponse.json({ output: jsonData });
            } catch (error) {
                console.error("JSON parsing error:", error);
                console.error("Raw output:", output);
                return NextResponse.json({ error: "Invalid JSON response from AI", rawOutput: output }, { status: 500 });
            }
        }
        
        // Handle other request types
        return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
    }
}