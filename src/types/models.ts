export type ProjectStatus = "active" | "paused" | "dead";
export type ProjectType = "app" | "video" | "writing" | "music" | "other";
export type TaskImpact = "low" | "medium" | "high";
export type TaskStatus = "todo" | "doing" | "done";
export type SubtaskStatus = "todo" | "done";
export type ReflectionCadence = "Daily" | "Weekly" | "Monthly";

export type User = {
  id: string;
  name: string;
  streak: number;
  lastActiveDate: string;
};

export type Project = {
  id: string;
  userId: string;
  title: string;
  status: ProjectStatus;
  type: ProjectType;
  progress: number;
  lastEditedAt: string;
  context: string;
};

export type Task = {
  id: string;
  projectId: string;
  title: string;
  impact: TaskImpact;
  status: TaskStatus;
};

export type Subtask = {
  id: string;
  taskId: string;
  title: string;
  status: SubtaskStatus;
};

export type Session = {
  id: string;
  taskId: string;
  startTime: string;
  endTime?: string;
  completed: boolean;
};
