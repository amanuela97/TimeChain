import { useState, useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import EventCard from "./EventCard";

interface GameControlsProps {
  isScoreView?: boolean;
}

export default function GameControls({
  isScoreView = false,
}: GameControlsProps) {
  const events = useGameStore((state) => state.events);
  const [items, setItems] = useState(events);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const activeEvent = activeId
    ? items.find((item) => item.year === activeId)
    : null;

  useEffect(() => {
    if (isScoreView) {
      const sortedEvents = [...events].sort((a, b) => a.year - b.year);
      setItems(sortedEvents);
    } else {
      setItems(events);
    }
  }, [events, isScoreView]);

  const sortedYears = [...events]
    .sort((a, b) => a.year - b.year)
    .map((event) => event.year);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    if (!isScoreView) {
      setActiveId(event.active.id);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    if (!isScoreView) {
      const { active, over } = event;

      if (active && over && active.id !== over.id) {
        setItems((items) => {
          const oldIndex = items.findIndex((item) => item.year === active.id);
          const newIndex = items.findIndex((item) => item.year === over.id);

          return arrayMove(items, oldIndex, newIndex);
        });
      }
      setActiveId(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center w-full">
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center w-full max-w-7xl mx-auto">
      {isScoreView ? (
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 p-4 rounded-lg w-full border-2 border-white bg-black">
          {items.map((event) => (
            <EventCard key={event.year} event={event} isScoreView={true} />
          ))}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item.year)}
            strategy={rectSortingStrategy}
          >
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6 p-4 rounded-lg w-full border-2 border-blue-500 bg-black">
              {items.map((event) => (
                <EventCard
                  key={event.year}
                  event={event}
                  isHidden={event.year === activeId}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeEvent ? <EventCard event={activeEvent} isDragging /> : null}
          </DragOverlay>
        </DndContext>
      )}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 mt-2 w-full">
        {sortedYears.map((year) => (
          <div key={year} className="w-full lg:w-56 text-center bg-black p-2">
            <span className="text-lg font-bold text-white">{year}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
