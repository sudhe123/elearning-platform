import roadmapData from "../Data/roadmapData";
import courses from "../Data/CourseData";

export function generatePersonalizedRoadmap(courseId, goal) {
  const baseSteps = Array.isArray(roadmapData[courseId])
    ? JSON.parse(JSON.stringify(roadmapData[courseId]))
    : [];

  const course = courses.find((c) => c.id === Number(courseId));

  const fallbackVideoId = course?.video || "dQw4w9WgXcQ";

  // If no data found
  if (baseSteps.length === 0) {
    baseSteps.push(
      {
        id: 1,
        title: "Introduction",
        description: "Get started with fundamentals",
        outcome: "Understand basics",
        type: "video",
        videoId: fallbackVideoId
      },
      {
        id: 2,
        title: "Advanced Concepts",
        description: "Deep dive into topic",
        outcome: "Build practical knowledge",
        type: "video",
        videoId: fallbackVideoId
      }
    );
  }

  // Ensure every step has videoId
  baseSteps.forEach((step) => {
    if (!step.videoId) {
      step.videoId = fallbackVideoId;
    }
  });

  switch (goal) {

    case "1 Hour Quick Learning": {
      return baseSteps.slice(0, 2).map((step, idx) => ({
        ...step,
        title:
          idx === 0
            ? `⚡ Quick Learn: ${step.title}`
            : `🎯 Core Concept: ${step.title}`,
        description: `${step.description} (Quick overview mode)`,
        outcome: `${step.outcome} (Fast learning takeaway)`,
        videoId: step.videoId
      }));
    }

    case "Job Ready": {
      const personalized = baseSteps.map((step) => ({
        ...step,
        title: `💼 Job Ready: ${step.title}`,
        description: `${step.description} (Industry level focus)`,
        outcome: `${step.outcome} + interview usage`,
        videoId: step.videoId
      }));

      personalized.push({
        id: 999,
        title: "Career Preparation & Portfolio",
        description: "Resume + real project guidance",
        outcome: "Job ready profile",
        type: "video",
        videoId: fallbackVideoId
      });

      return personalized;
    }

    case "Interview Preparation": {
      const personalized = baseSteps.map((step) => ({
        ...step,
        title: `🧠 Interview: ${step.title}`,
        description: `${step.description} (Interview focus)`,
        outcome: `${step.outcome} + Q&A practice`,
        videoId: step.videoId
      }));

      personalized.push({
        id: 998,
        title: "Mock Interview Practice",
        description: "Technical + coding questions",
        outcome: "Interview confidence",
        type: "video",
        videoId: fallbackVideoId
      });

      return personalized;
    }

    case "Project Based Learning": {
      const personalized = baseSteps.map((step) => ({
        ...step,
        title: `🛠️ Project: ${step.title}`,
        description: `${step.description} (Build while learning)`,
        outcome: `${step.outcome} + real project work`,
        videoId: step.videoId
      }));

      personalized.push({
        id: 997,
        title: "Final Project Build",
        description: "Complete application build",
        outcome: "Portfolio project ready",
        type: "video",
        videoId: fallbackVideoId
      });

      return personalized;
    }

    case "Certification Preparation": {
      const personalized = baseSteps.map((step) => ({
        ...step,
        title: `📜 Cert Prep: ${step.title}`,
        description: `${step.description} (Exam focus)`,
        outcome: `${step.outcome} + certification prep`,
        videoId: step.videoId
      }));

      personalized.push({
        id: 996,
        title: "Mock Exam Practice",
        description: "Final revision test",
        outcome: "Certification ready",
        type: "video",
        videoId: fallbackVideoId
      });

      return personalized;
    }

    default:
      return baseSteps.map((step) => ({
        ...step,
        videoId: step.videoId || fallbackVideoId
      }));
  }
}