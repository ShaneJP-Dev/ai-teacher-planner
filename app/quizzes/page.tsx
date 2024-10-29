"use client";

import React, { useState } from "react";
import { QuizGenerator } from "@/components/ai-components/AIQuizGenerator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonitorIcon, PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

// Mock data for saved quizzes (you can replace this with actual data fetching logic)
const savedQuizzes = {
  Mathematics: [
    { id: 1, title: "Algebra Basics", date: "2023-06-15" },
    { id: 2, title: "Geometry Fundamentals", date: "2023-06-20" },
  ],
  Science: [
    { id: 3, title: "Biology: Cell Structure", date: "2023-06-18" },
    { id: 4, title: "Chemistry: Periodic Table", date: "2023-06-22" },
  ],
  History: [
    { id: 5, title: "World War II Overview", date: "2023-06-17" },
    { id: 6, title: "Ancient Civilizations", date: "2023-06-21" },
  ],
};

const QuizzesPage: React.FC = () => {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [activeTab, setActiveTab] = useState("Mathematics");
  const [isQuizGeneratorOpen, setIsQuizGeneratorOpen] = useState(false);

  const handleQuizGenerated = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResults(false);
    setScore(0);
    setIsQuizGeneratorOpen(false);
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);

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
    setUserAnswers([]);
    setShowResults(false);
    setScore(0);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Quizzes</h1>

      {!currentQuiz ? (
        <>
          {/* Quiz Generation Options */}
          <div className="grid md:grid-cols-1 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Create Online Quiz
                </h2>
                <p className="text-gray-600 mb-4">
                  Design an interactive online quiz experience.
                </p>
                <Dialog
                  open={isQuizGeneratorOpen}
                  onOpenChange={setIsQuizGeneratorOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="w-full"
                      onClick={() => setIsQuizGeneratorOpen(true)}
                    >
                      <MonitorIcon className="mr-2 h-4 w-4" />
                      Create Online Quiz
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogTitle>Create Online Quiz</DialogTitle>
                    <QuizGenerator onQuizGenerated={handleQuizGenerated} />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>

          {/* Saved Quizzes */}
          <h2 className="text-2xl font-semibold mb-4">Saved Quizzes</h2>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              {Object.keys(savedQuizzes).map((subject) => (
                <TabsTrigger key={subject} value={subject}>
                  {subject}
                </TabsTrigger>
              ))}
            </TabsList>
            {Object.entries(savedQuizzes).map(([subject, quizzes]) => (
              <TabsContent key={subject} value={subject}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quizzes.map((quiz) => (
                    <Card key={quiz.id}>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{quiz.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Created: {quiz.date}
                        </p>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Card className="flex items-center justify-center p-4 border-dashed">
                    <Button variant="ghost">
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Add New Quiz
                    </Button>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </>
      ) : showResults ? (
        // Display quiz results
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
            <p>
              Your Score: {score} / {currentQuiz.questions.length}
            </p>
            <h3 className="mt-4">Results Summary:</h3>
            {currentQuiz.questions.map((question, index) => (
              <div key={index} className="mb-4">
                <p>
                  <strong>{question.question}</strong>
                </p>
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
        // Display current quiz question
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">
              {currentQuiz.questions[currentQuestionIndex].question}
            </h2>
            <div className="space-y-2">
              {currentQuiz.questions[currentQuestionIndex].options.map(
                (option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="w-full"
                  >
                    {option}
                  </Button>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizzesPage;
