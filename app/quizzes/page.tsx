'use client';

import React, { useState } from 'react';
import { QuizGenerator } from '@/components/quiz/QuizGenerator';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Question {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

interface Quiz {
    title: string;
    subject: string;
    topic: string;
    difficulty: string;
    questions: Question[];
}

const QuizzesPage: React.FC = () => {
    const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<string[]>([]); // Fixed the space here
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    const handleQuizGenerated = (quiz: Quiz) => {
        setCurrentQuiz(quiz);
        setCurrentQuestionIndex(0);
        setUserAnswers([]); // Fixed here too
        setShowResults(false);
        setScore(0);
    };

    const handleAnswer = (answer: string) => {
        const newAnswers = [...userAnswers, answer];
        setUserAnswers(newAnswers); // Fixed here as well

        if (answer === currentQuiz?.questions[currentQuestionIndex].correctAnswer) {
            setScore(score + 1);
        }

        if (currentQuestionIndex + 1 < currentQuiz!.questions.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowResults(true);
        }
    };

    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setUserAnswers([]); // Fixed here too
        setShowResults(false);
        setScore(0);
    };

    return (
        <div className="container mx-auto p-6">
            {!currentQuiz ? (
                <QuizGenerator onQuizGenerated={handleQuizGenerated} />
            ) : showResults ? (
                <Card className="w-full max-w-2xl mx-auto">
                    <CardContent className="p-6">
                        <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
                        <p>Your Score: {score} / {currentQuiz.questions.length}</p>
                        <h3 className="mt-4">Results Summary:</h3>
                        {currentQuiz.questions.map((question, index) => (
                            <div key={index} className="mb-4">
                                <p><strong>{question.question}</strong></p>
                                <p>Your Answer: {userAnswers[index] || "No answer"}</p>
                                <p>Correct Answer: {question.correctAnswer}</p>
                                <p>{question.explanation}</p>
                            </div>
                        ))}
                        <Button onClick={restartQuiz} className="mt-4">
                            Restart Quiz
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Card className="w-full max-w-2xl mx-auto">
                    <CardContent className="p-6">
                        <h2 className="text-2xl font-bold mb-4">{currentQuiz.questions[currentQuestionIndex].question}</h2>
                        <div className="space-y-2">
                            {currentQuiz.questions[currentQuestionIndex].options.map((option, index) => (
                                <Button key={index} onClick={() => handleAnswer(option)} className="w-full">
                                    {option}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default QuizzesPage;
