import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import moment from 'moment';
import { Lesson } from '@/types';

interface DraggableLessonProps {
  lesson: Lesson;
  onLessonMove: (lesson: Lesson, start: Date, end: Date) => void;
  isNewlyAdded: boolean;
}

interface DropResult {
  start: Date;
  end: Date;
}

const DraggableLesson: React.FC<DraggableLessonProps> = ({ lesson, onLessonMove, isNewlyAdded }) => {
  // Create a ref with fallback for type safety
  const ref = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'LESSON',
    item: {
      id: lesson.id,
      title: lesson.title,
      start: new Date(lesson.date),
      end: moment(lesson.date).add(1, 'hour').toDate(),
    },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      if (dropResult && dropResult.start && dropResult.end) {
        onLessonMove(lesson, dropResult.start, dropResult.end);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Connect the drag ref
  drag(ref);

  return (
    <div
      ref={ref}
      role="button"  // Accessibility role for draggable
      aria-grabbed={isDragging}  // Accessibility attribute for dragging state
      className={`cursor-move ${isDragging ? 'opacity-50' : 'opacity-100'} ${
        isNewlyAdded ? 'border-2 border-green-500 animate-pulse' : ''
      } p-2 rounded-md bg-white shadow-md select-none`}
      data-testid={`draggable-lesson-${lesson.id}`}  // Useful for testing
    >
      <strong className="block text-sm font-semibold">{lesson.title}</strong>
      <p className="text-xs text-gray-600 truncate">{lesson.content}</p>
    </div>
  );
};

export default DraggableLesson;
