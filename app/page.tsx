import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardHeader } from '@/components/header/DashboardHeader';
import { StatsCard } from '@/components/stats/StatsCard';
import { AssignmentList } from '@/components/assignments/AssignmentList';
import { RecommendationList } from '@/components/recommendations/RecommendationList';
import { AIChat } from '@/components/ai-chat/AIChat';

const DashboardPage = () => {
  const userData = {
    name: 'Teacher Name',
    email: 'teacher.school@gmail.com',
  };

  const statsData = [
    { value: 500, label: 'Hours spent' },
    { value: 21, label: 'Completed tests' },
    { value: 43, label: 'Total points' },
  ];

  const assignments = [
    { title: "Colour theory", date: "1 Aug 2023", grade: "80/100", status: "Completed" as const },
    { title: "Composition", date: "3 Aug 2023", grade: "95/100", status: "Completed" as const },
    { title: "UX writing", date: "3 Aug 2023", status: "In Progress" as const }
  ];

  const recommendations = [
    { title: "How to create first CV", duration: "3 hours", author: "Wade Warren" },
    { title: "Design argumentation", duration: "3 hours", author: "Oliver Stul" },
    { title: "UX writing challenges", duration: "24 hours", author: "Still Fabric" }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userName={userData.name} userEmail={userData.email} />
      
      <div className="flex-1 p-8">
        <DashboardHeader userName={userData.name} />
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          {statsData.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        <AssignmentList assignments={assignments} />
        <RecommendationList recommendations={recommendations} />
        <AIChat />
      </div>
    </div>
  );
};

export default DashboardPage;