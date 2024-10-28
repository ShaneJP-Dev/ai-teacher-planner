// components/quiz/QuizGenerator.tsx
'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface QuizGeneratorProps {
    onQuizGenerated: (quiz: any) => void;
}

export const QuizGenerator: React.FC<QuizGeneratorProps> = ({ onQuizGenerated }) => {
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [numberOfQuestions, setNumberOfQuestions] = useState(5);
    const [difficulty, setDifficulty] = useState('medium');
    const [isGenerating, setIsGenerating] = useState(false);
    const [targetAge, setTargetAge] = useState('');
    const [learningObjectives, setLearningObjectives] = useState('');
    const [questionTypes, setQuestionTypes] = useState<string[]>(['multiple-choice']);

    const generateQuiz = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'generateQuiz',
                    subject,
                    topic,
                    numberOfQuestions,
                    difficulty,
                    targetAge,
                    learningObjectives,
                    questionTypes,
                }),
            });

            const data = await response.json();
            if (data.output) {
                
                onQuizGenerated(data.output);
            } else if (data.error) {
                console.error('Error generating quiz:', data.error);
                // Handle the error in thhe UI, e.g., show an error message to the user
            }
        } catch (error) {
            console.error('Failed to generate quiz:', error);
            // Handle the error in the UI, e.g., show an error message to the user
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">AI Quiz Generator</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block mb-2">Subject</label>
                        <Input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="e.g., Mathematics"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Topic</label>
                        <Input
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., Algebra"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Learning Objectives</label>
                        <textarea
                            value={learningObjectives}
                            onChange={(e) => setLearningObjectives(e.target.value)}
                            placeholder="Enter specific learning objectives..."
                            className="w-full p-2 border rounded"
                            rows={3}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Number of Questions</label>
                            <Input
                                type="number"
                                value={numberOfQuestions}
                                onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                                min={1}
                                max={20}
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Target Age Group</label>
                            <Input
                                value={targetAge}
                                onChange={(e) => setTargetAge(e.target.value)}
                                placeholder="e.g., 12-14"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block mb-2">Question Types</label>
                        <div className="flex gap-2 flex-wrap">
                            {['multiple-choice', 'true-false', 'short-answer', 'matching'].map((type) => (
                                <Button
                                    key={type}
                                    variant={questionTypes.includes(type) ? "default" : "outline"}
                                    onClick={() => {
                                        if (questionTypes.includes(type)) {
                                            setQuestionTypes(questionTypes.filter(t => t !== type));
                                        } else {
                                            setQuestionTypes([...questionTypes, type]);
                                        }
                                    }}
                                >
                                    {type}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block mb-2">Difficulty</label>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                    <Button
                        onClick={generateQuiz}
                        disabled={isGenerating}
                        className="w-full"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating Quiz...
                            </>
                        ) : (
                            'Generate AI Quiz'
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};