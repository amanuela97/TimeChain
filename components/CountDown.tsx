import { useState, useEffect } from "react";

interface CountDownProps {
  initialTime: number;
  onTimeUp: () => void;
}

export default function CountDown({ initialTime, onTimeUp }: CountDownProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  return (
    <div className="text-2xl font-bold">Time left: {timeLeft} seconds</div>
  );
}
