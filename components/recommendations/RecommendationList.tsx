import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarIcon } from "lucide-react";

interface Recommendation {
  title: string;
  duration: string;
  author: string;
}

interface RecommendationListProps {
  recommendations: Recommendation[];
}

export const RecommendationList: React.FC<RecommendationListProps> = ({ recommendations }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Top picks for you</h2>
        <Button variant="ghost" size="sm">Show all</Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {recommendations.map((recommendation, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">{recommendation.title}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <CalendarIcon className="h-4 w-4" />
                <span>{recommendation.duration}</span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback>{recommendation.author[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{recommendation.author}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};