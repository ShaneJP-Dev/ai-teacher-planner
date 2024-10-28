"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BrainCircuitIcon, SendIcon } from "lucide-react";
import { generateTermPlans } from '@/utils/generateTermPlans'; // Create this utility for AI generation
import { DndProvider } from "react-dnd"; // Drag and Drop provider
import { HTML5Backend } from 'react-dnd-html5-backend';

interface Message {
  type: 'user' | 'ai';
  content: string;
}

export const AIChat: React.FC = () => {
  const [output, setOutput] = useState('This is a nextjs project');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'ai',
      content: 'Hello! I can help you create term planners and quizzes. What would you like to generate?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [generatedPlans, setGeneratedPlans] = useState<any[]>([]); // Holds generated lesson plans and quizzes

  const generateText = async (prompt: string) => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ body: prompt })
      });

      const data = await response.json();

      if (response.ok) {
        return data.output;
      } else {
        return data.error || 'Error generating response';
      }
    } catch (error) {
      console.error(error);
      return 'An error occurred while generating the response.';
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      // Add the user message to the chat
      setMessages([...messages, { type: 'user', content: inputMessage }]);
      const userRequest = inputMessage.toLowerCase();

      // Generate AI response based on the user input
      const aiResponse = await generateText(userRequest);
      setMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);

      // Clear the input field
      setInputMessage('');
    }
  };

  return (
    <>
      <Button
        variant="default"
        size="lg"
        className="fixed bottom-6 right-6 rounded-full shadow-lg flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <BrainCircuitIcon className="w-5 h-5" />
        AI Teaching Assistant
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BrainCircuitIcon className="w-5 h-5 text-purple-500" />
              AI Teaching Assistant
            </DialogTitle>
            <DialogDescription>
              Generate term planners and quizzes with AI assistance
            </DialogDescription>
          </DialogHeader>

          <div className="h-[400px] overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-md">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${message.type === 'user'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white border border-gray-200'
                    }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button size="icon" onClick={handleSendMessage}>
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
