import { Project, Session, Subtask, Task, User } from "@/types/models";

export const mockUser: User = {
  id: "user-1",
  name: "Alex",
  streak: 6,
  lastActiveDate: "2026-04-24"
};

export const mockProjects: Project[] = [
  {
    id: "project-1",
    userId: "user-1",
    title: "Nutrition App",
    status: "active",
    type: "app",
    progress: 68,
    lastEditedAt: "2h ago",
    context: "A calm onboarding and nutrition planning mobile app for people rebuilding their routine."
  },
  {
    id: "project-2",
    userId: "user-1",
    title: "YouTube Series",
    status: "active",
    type: "video",
    progress: 40,
    lastEditedAt: "yesterday",
    context: "A reflective creator series about making work with less noise and more intent."
  },
  {
    id: "project-3",
    userId: "user-1",
    title: "Music EP",
    status: "active",
    type: "music",
    progress: 20,
    lastEditedAt: "3d ago",
    context: "A stripped-back EP with warm textures and close vocal takes."
  }
];

export const mockTasks: Task[] = [
  {
    id: "task-1",
    projectId: "project-1",
    title: "Finish the onboarding experience",
    impact: "high",
    status: "doing"
  },
  {
    id: "task-2",
    projectId: "project-1",
    title: "Implement the nutrition plan flow",
    impact: "high",
    status: "todo"
  },
  {
    id: "task-3",
    projectId: "project-1",
    title: "Refine the nutrition plan flow",
    impact: "medium",
    status: "todo"
  },
  {
    id: "task-4",
    projectId: "project-1",
    title: "Write landing page copy",
    impact: "low",
    status: "todo"
  },
  {
    id: "task-5",
    projectId: "project-2",
    title: "Cut the opening scene",
    impact: "high",
    status: "todo"
  },
  {
    id: "task-6",
    projectId: "project-3",
    title: "Record the second verse vocal",
    impact: "high",
    status: "todo"
  }
];

export const mockSubtasks: Subtask[] = [
  { id: "subtask-1", taskId: "task-1", title: "Write the first three onboarding questions", status: "done" },
  { id: "subtask-2", taskId: "task-1", title: "Build the goal selection screen states", status: "todo" },
  { id: "subtask-3", taskId: "task-1", title: "Connect answers to the plan preview", status: "todo" },
  { id: "subtask-4", taskId: "task-1", title: "Add empty and completed onboarding copy", status: "todo" }
];

export const mockSessions: Session[] = [];
