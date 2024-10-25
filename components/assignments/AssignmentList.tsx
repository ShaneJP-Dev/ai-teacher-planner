import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Assignment {
  title: string;
  date: string;
  grade?: string;
  status: 'Completed' | 'In Progress';
}

interface AssignmentListProps {
  assignments: Assignment[];
}

export const AssignmentList: React.FC<AssignmentListProps> = ({ assignments }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your assignments</h2>
        <Button variant="ghost" size="sm">Show all</Button>
      </div>
      <div className="space-y-4">
        {assignments.map((assignment, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{assignment.title}</h3>
                  <div className="text-sm text-gray-500">{assignment.date}</div>
                </div>
                <div className="flex items-center space-x-4">
                  {assignment.grade && (
                    <div className="text-sm text-gray-500">{assignment.grade}</div>
                  )}
                  <Button
                    variant={assignment.status === "Completed" ? "secondary" : "default"}
                    size="sm"
                  >
                    {assignment.status}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};