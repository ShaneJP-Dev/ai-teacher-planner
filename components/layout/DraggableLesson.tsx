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

  drag(ref);

  return (
    <div
      ref={ref}
      role="button"
      aria-grabbed={isDragging}
      className={`cursor-move transition-opacity duration-200 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${
        isNewlyAdded ? 'border-2 border-green-500 animate-pulse' : ''
      } p-4 rounded-lg bg-white shadow-lg select-none w-full max-w-xs`}
      data-testid={`draggable-lesson-${lesson.id}`}
    >
      <strong className="block text-sm font-semibold">{lesson.title}</strong>
      <p className="text-xs text-gray-600 truncate">{lesson.content}</p>
    </div>
  );
};

export default DraggableLesson;
