// pages/api/event.ts
import { NextResponse } from "next/server";

interface TimeZone {
  name: string;
  range: number[];
}

interface DifficultyMapping {
  [key: string]: number[];
}

interface EventData {
  year: number;
  event: string;
  imageUrl: string | null;
  timeZone: string;
  difficulty: string;
}

// Function to infer the time zone based on the year
function inferTimeZone(year: number, timeZones: TimeZone[]): string {
  for (const zone of timeZones) {
    if (year >= zone.range[0] && year <= zone.range[1]) {
      return zone.name;
    }
  }
  return "Unknown";
}

// Function to infer difficulty based on the year
function inferDifficulty(
  year: number,
  difficultyMapping: DifficultyMapping
): string {
  if (year >= difficultyMapping.easy[0]) {
    return "easy";
  } else if (year >= difficultyMapping.medium[0]) {
    return "medium";
  } else {
    return "hard";
  }
}

// Function to fetch an image URL from Wikimedia Commons
async function fetchImage(eventName: string): Promise<string> {
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
    eventName
  )}&format=json&utf8=1&srlimit=1`;

  try {
    const res = await fetch(searchUrl);
    const data = await res.json();

    if (data.query && data.query.search.length > 0) {
      const pageTitle = data.query.search[0].title;

      // Now fetch the page content to get images
      const pageUrl = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(
        pageTitle
      )}&prop=images&format=json&utf8=1`;
      const pageRes = await fetch(pageUrl);
      const pageData = await pageRes.json();

      if (pageData.parse && pageData.parse.images) {
        // Filter the images to include only those with image file extensions
        const imageName = pageData.parse.images.find((img: string) =>
          /\.(jpg|jpeg|png|svg)$/i.test(img)
        );
        if (imageName) {
          const imageUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
            imageName
          )}`;

          return imageUrl;
        }
      }
    }
  } catch (error) {
    console.error("Error fetching image:", error);
  }

  return "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png"; // Return null if no image found or an error occurred
}

async function fetchRandomEvents(
  startYear: number,
  endYear: number,
  numberOfEvents: number
): Promise<EventData[]> {
  const events: EventData[] = [];
  const timeZones: TimeZone[] = [
    { name: "Ancient History", range: [-3000, 500] },
    { name: "Early Middle Ages", range: [500, 1000] },
    { name: "High Middle Ages", range: [1000, 1300] },
    { name: "Late Middle Ages", range: [1300, 1500] },
    { name: "Early Modern Period", range: [1500, 1750] },
    { name: "Industrial Revolution", range: [1750, 1850] },
    { name: "19th Century", range: [1850, 1900] },
    { name: "Early 20th Century", range: [1900, 1950] },
    { name: "Late 20th Century", range: [1950, 2000] },
    { name: "21st Century", range: [2000, 2025] },
  ];

  const difficultyMapping: DifficultyMapping = {
    easy: [1800, 2000],
    medium: [1500, 1800],
    hard: [-3000, 1500],
  };

  // Regular expression to detect years (4-digit numbers)
  const yearRegex = /\b\d{4}\b/g;

  while (events.length < numberOfEvents) {
    const randomYear =
      Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;

    const res = await fetch(
      `https://events.historylabs.io/year/${randomYear}?onlyDated=false`
    );

    // Log the response status

    // Check if the response is OK before proceeding
    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.json();

    if (data && data.events && data.events.length > 0) {
      const randomEvent =
        data.events[Math.floor(Math.random() * data.events.length)];
      if (randomEvent) {
        const timeZone = inferTimeZone(randomYear, timeZones);
        const difficulty = inferDifficulty(randomYear, difficultyMapping);
        const imageUrl = await fetchImage(randomEvent.content); // Fetch image using the event content

        // Remove any years from the event content and replace with dashes
        const sanitizedEventContent = randomEvent.content.replace(
          yearRegex,
          "----"
        );

        events.push({
          year: randomYear,
          event: sanitizedEventContent,
          imageUrl: imageUrl,
          timeZone: timeZone,
          difficulty: difficulty,
        });
      }
    }
  }

  return events;
}

export async function POST(req: Request) {
  const { startYear, endYear, numberOfEvents } = await req.json();

  if (!startYear || !endYear || !numberOfEvents) {
    return NextResponse.json(
      { success: false, message: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const events = await fetchRandomEvents(
      startYear || 1500,
      endYear || 2023,
      numberOfEvents || 5
    );
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching events" },
      { status: 500 }
    );
  }
}
