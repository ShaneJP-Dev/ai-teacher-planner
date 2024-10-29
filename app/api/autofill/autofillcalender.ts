// pages/api/autofillcalendar.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Lesson, TermInfo } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { lessons, termInfo } = req.body;

    if (!lessons || !termInfo) {
      return res.status(400).json({ error: 'Missing required data' });
    }

    const autoFilledLessons = await autoFillLessons(lessons, termInfo);

    if (!autoFilledLessons || !Array.isArray(autoFilledLessons)) {
      throw new Error("Failed to generate auto-filled lessons");
    }

    return res.status(200).json({ lessons: autoFilledLessons });
  } catch (error) {
    console.error('Error in auto-fill calendar:', error);
    return res.status(500).json({ error: 'Failed to auto-fill calendar' });
  }
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

async function autoFillLessons(lessons: Lesson[], termInfo: TermInfo): Promise<Lesson[]> {
  // Convert string dates to Date objects
  const termStart = new Date(termInfo.startDate);
  const termEnd = new Date(termInfo.endDate);

  // Use the original order of lessons
  const sortedLessons = [...lessons];

  // Calculate available teaching days
  const totalDays = Math.ceil((termEnd.getTime() - termStart.getTime()) / (1000 * 60 * 60 * 24));
  let availableDays: Date[] = [];
  
  // Generate array of available teaching days (excluding weekends)
  for (let i = 0; i < totalDays; i++) {
    const currentDate = addDays(termStart, i);
    if (!isWeekend(currentDate)) {
      availableDays.push(currentDate);
    }
  }

  // Calculate optimal distribution
  const numberOfLessons = sortedLessons.length;
  const daysPerLesson = Math.floor(availableDays.length / numberOfLessons);
  
  // Distribute lessons across available days
  const updatedLessons = sortedLessons.map((lesson, index) => {
    // Calculate the target date index for this lesson
    const targetDayIndex = Math.min(
      index * daysPerLesson,
      availableDays.length - 1
    );

    const lessonDate = availableDays[targetDayIndex];
    
    // Create end date (1 hour after start)
    const endDate = new Date(lessonDate);
    endDate.setHours(lessonDate.getHours() + 1);

    // Set default lesson time (e.g., 9 AM)
    lessonDate.setHours(9, 0, 0, 0);
    endDate.setHours(10, 0, 0, 0);

    return {
      ...lesson,
      date: lessonDate.toISOString(),
      endDate: endDate.toISOString(),
      autoFilled: true,
    };
  });

  // Apply scheduling rules and constraints
  const optimizedLessons = applySchedulingRules(updatedLessons, termInfo);

  return optimizedLessons;
}

function applySchedulingRules(lessons: Lesson[], termInfo: TermInfo): Lesson[] {
  return lessons.map((lesson, index) => {
    const lessonDate = new Date(lesson.date);
    
    // Ensure proper spacing between lessons
    const minDaysBetweenLessons = 1; // Adjust as needed
    if (index > 0) {
      const previousLesson = lessons[index - 1];
      const prevDate = new Date(previousLesson.date);
      const daysDiff = Math.floor(
        (lessonDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysDiff < minDaysBetweenLessons) {
        lessonDate.setDate(
          lessonDate.getDate() + (minDaysBetweenLessons - daysDiff)
        );
      }
    }

    // Calculate end date (1 hour after start)
    const endDate = new Date(lessonDate);
    endDate.setHours(lessonDate.getHours() + 1);

    // Add scheduling metadata
    const schedulingMetadata = {
      dayOfWeek: lessonDate.getDay(),
      weekNumber: Math.ceil(
        (lessonDate.getTime() - new Date(termInfo.startDate).getTime()) /
          (7 * 24 * 60 * 60 * 1000)
      ),
    };

    return {
      ...lesson,
      date: lessonDate.toISOString(),
      endDate: endDate.toISOString(),
      schedulingMetadata,
      autoFilled: true,
    };
  });
}

// Optional: Add helper functions for specific scheduling rules
function checkHolidays(date: Date): boolean {
  // Implement holiday checking logic
  // Return true if date is a holiday
  return false;
}

function getPreferredTimeSlot(subject: string): string {
  // Implement logic to determine preferred time slots for different subjects
  // For example, more challenging subjects earlier in the day
  return '09:00'; // Default to 9 AM
}