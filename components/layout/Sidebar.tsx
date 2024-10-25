import React from 'react';
import Link from 'next/link'; // Import Next.js Link
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboardIcon, 
  BookIcon, 
  InboxIcon, 
  Settings2Icon, 
  PlusIcon 
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string; // Add href to each item for the link
}

const navItems: NavItem[] = [
  { icon: <LayoutDashboardIcon className="mr-2 h-4 w-4" />, label: "Quizzes", href: "/quizzes" },
  { icon: <BookIcon className="mr-2 h-4 w-4" />, label: "Lessons", href: "/lesson" },
  { icon: <InboxIcon className="mr-2 h-4 w-4" />, label: "Messages", href: "/messages" },
  { icon: <Settings2Icon className="mr-2 h-4 w-4" />, label: "Settings", href: "/settings" }
];

interface SidebarProps {
  userEmail: string;
  userName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ userEmail, userName }) => {
  return (
    <div className="w-64 bg-white p-6 border-r">
      
      <div className="space-y-6">
        {/* User Info */}
        <div className="flex flex-col space-y-1">
          <Avatar className="w-16 h-16">
            <AvatarFallback>{userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{userName}</span>
          <span className="text-sm text-gray-500">{userEmail}</span>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {navItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                size="default"
              >
                {item.icon}
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Start new course button */}
        <Button variant="default" className="w-full" size="default">
          <PlusIcon className="mr-2 h-4 w-4" />
          Start new course
        </Button>

        {/* Upgrade to Premium Card */}
        <Card className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Upgrade to Premium</h3>
            <Button variant="secondary" size="sm">Get started</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
