import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { CalendarEvent, Lesson } from "@/types";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

interface LessonSchedulerProps {
  lessons: Lesson[];
  onLessonMove: (lesson: Lesson, start: Date, end: Date) => void;
  newlyAddedLessonIds: number[];
}

interface EventWrapperProps {
  event: CalendarEvent;
  isNewlyAdded: boolean;
}

const EventWrapper = ({ event, isNewlyAdded }: EventWrapperProps) => (
  <div
    className={`cursor-move p-2 rounded-md bg-white shadow-md ${
      isNewlyAdded ? "border-2 border-green-500 animate-pulse" : ""
    }`}
  >
    <strong className="block text-sm font-semibold">{event.title}</strong>
    <p className="text-xs text-gray-600 truncate">{event.content}</p>
  </div>
);

export const LessonScheduler: React.FC<LessonSchedulerProps> = ({
  lessons,
  onLessonMove,
  newlyAddedLessonIds,
}) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const mappedEvents: CalendarEvent[] = lessons.map((lesson) => {
      const startDate = new Date(lesson.date);
      return {
        id: lesson.id,
        title: lesson.title,
        content: lesson.content,
        type: lesson.type,
        endDate: lesson.endDate,
        start: startDate,
        end: new Date(moment(startDate).add(1, "hour").toDate()),
      };
    });
    setEvents(mappedEvents);
  }, [lessons]);

  const moveEvent = ({ event, start, end }: any) => {
    const updatedEvent: CalendarEvent = {
      ...event,
      start: new Date(start),
      end: new Date(end),
    };

    // Convert CalendarEvent to Lesson type
    const lessonEvent: Lesson = {
      id: event.id,
      title: event.title,
      content: event.content,
      type: event.type,
      date: new Date(start), // Use start date directly instead of event.date
      endDate: new Date(end).toISOString(),
    };

    onLessonMove(lessonEvent, new Date(start), new Date(end));

    setEvents((prevEvents) =>
      prevEvents.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev))
    );
  };

  const CustomEventComponent = React.useCallback(
    ({ event }: { event: CalendarEvent }) => (
      <EventWrapper
        event={event}
        isNewlyAdded={newlyAddedLessonIds.includes(event.id)}
      />
    ),
    [newlyAddedLessonIds]
  );

  return (
    <div className="h-[500px]">
      <DragAndDropCalendar
        localizer={localizer}
        events={events}
        startAccessor={(event: any) => event.start}
        endAccessor={(event: any) => event.end}
        className="h-full"
        components={{
          event: CustomEventComponent as any,
        }}
        defaultView="week"
        views={["week", "day"]}
        step={30}
        timeslots={2}
        onEventDrop={moveEvent}
        onEventResize={moveEvent}
        resizable
        selectable
        dayLayoutAlgorithm="no-overlap"
      />
    </div>
  );
};
