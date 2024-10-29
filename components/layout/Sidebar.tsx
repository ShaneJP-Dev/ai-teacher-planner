"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboardIcon, 
  BookIcon, 
  InboxIcon, 
  Settings2Icon, 
  Shapes,
  LogOutIcon,
  MenuIcon,
  XIcon
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: <LayoutDashboardIcon className="mr-2 h-4 w-4" />, label: "Dashboard", href: "/" },
  { icon: <Shapes className="mr-2 h-4 w-4" />, label: "Quizzes", href: "/quizzes" },
  { icon: <BookIcon className="mr-2 h-4 w-4" />, label: "Lessons", href: "/lesson" },
  { icon: <InboxIcon className="mr-2 h-4 w-4" />, label: "Messages", href: "/messages" },
  { icon: <Settings2Icon className="mr-2 h-4 w-4" />, label: "Settings", href: "/settings" }
];

interface SidebarProps {
  userEmail: string;
  userName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ userEmail, userName }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMobileMenu}
          className="rounded-full"
        >
          {isMobileMenuOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static
        inset-y-0 left-0
        w-64 bg-white border-r
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        z-50 h-screen
      `}>
        <div className="flex flex-col h-full">
          {/* User Info */}
          <div className="p-6">
            <div className="flex flex-col items-center space-y-2 mb-6">
              <Avatar className="w-20 h-20">
                <AvatarFallback>{userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-center">{userName}</span>
              <span className="text-sm text-gray-500 text-center">{userEmail}</span>
            </div>
          </div>

          {/* Navigation Menu - Scrollable */}
          <nav className="flex-1 overflow-y-auto px-6">
            <div className="space-y-1">
              {navItems.map((item, index) => (
                <React.Fragment key={index}>
                  {index === 2 && <div className="my-2 border-gray-200" />}
                  <Link 
                    href={item.href} 
                    className="block"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-shadow" 
                      size="default"
                    >
                      {item.icon}
                      {item.label}
                    </Button>
                  </Link>
                </React.Fragment>
              ))}
            </div>
          </nav>

          {/* Sign Out Button - Fixed at bottom */}
          <div className="p-6 border-t border-gray-200">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-shadow" 
              size="default"
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};