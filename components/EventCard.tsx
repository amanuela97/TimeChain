import { Event } from "@/types/game";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, MouseEvent } from "react";

interface EventCardProps {
  event: Event;
  isHidden?: boolean;
  isDragging?: boolean;
  isScoreView?: boolean;
}

export default function EventCard({
  event,
  isHidden,
  isDragging,
  isScoreView,
}: EventCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isLongText = event.event.length > 296;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: event.year });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundImage: `url(${event.imageUrl || "/placeholder-image.jpg"})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: isHidden ? 0 : 1,
  };

  const handleReadMoreClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <div className="w-full lg:w-56 h-72 relative">
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`w-full h-full rounded-lg shadow-md flex flex-col justify-between items-center text-white p-2 bg-white ${
          isDragging ? "border-4 border-blue-500" : ""
        }`}
      >
        <div className="text-center bg-black bg-opacity-70 p-2 rounded w-full h-full overflow-hidden">
          <p className="font-bold mb-1 text-sm line-clamp-[11]">
            {event.event}
          </p>
          <p className="text-xs mt-1">{event.timeZone}</p>
        </div>
      </div>
      {isLongText && !isHidden && (
        <button
          onClick={handleReadMoreClick}
          className="absolute bottom-0 left-0 right-0 text-xs bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-b"
        >
          Read More
        </button>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-black text-white p-6 rounded-lg max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">{event.event}</h2>
            <p className="text-sm text-gray-500">Time Zone: {event.timeZone}</p>
            <button
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
