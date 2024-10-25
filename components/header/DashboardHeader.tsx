import React from 'react';
import { Button } from "@/components/ui/button";
import { BellIcon, SearchIcon } from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-semibold">Good afternoon, {userName}!</h1>
        <BellIcon className="h-5 w-5 text-gray-500" />
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="default">Start new course</Button>
        <Button variant="ghost" size="icon">
          <SearchIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};