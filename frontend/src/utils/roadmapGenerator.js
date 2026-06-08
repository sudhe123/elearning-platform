const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

/* Fetch YouTube video */
const fetchVideoForTopic = async (query) => {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(
        query
      )}&key=${API_KEY}`
    );

    const data = await res.json();

    return data?.items?.[0]?.id?.videoId || "dQw4w9WgXcQ";
  } catch (err) {
    console.log("YT API error", err);
    return "dQw4w9WgXcQ";
  }
};

/* MAIN ROADMAP */
export const generatePersonalizedRoadmap = async (courseId, goal) => {
  const topics = [
    "Introduction",
    "Basics",
    "Core Concepts",
    "Practice",
    "Mini Project",
    "Advanced Topics",
  ];

  const roadmap = [];

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];

    // ✅ FIXED QUERY (IMPORTANT)
    const videoQuery = `learn ${goal} ${topic} tutorial`;

    const videoId = await fetchVideoForTopic(videoQuery);

    roadmap.push({
      id: `${courseId}-${i + 1}`,
      title: topic,
      description: `${topic} explained for ${goal}`,
      outcome: `Understand ${topic}`,
      video: videoId,
    });
  }

  return roadmap;
};