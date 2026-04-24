import { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";

import { mockProjects, mockSessions, mockSubtasks, mockTasks, mockUser } from "@/data/mockData";
import { mockAiService } from "@/services/aiService";
import { Project, ReflectionCadence, Session, Subtask, Task, TaskImpact, TaskStatus, User } from "@/types/models";

type AppState = {
  user: User;
  projects: Project[];
  tasks: Task[];
  subtasks: Subtask[];
  sessions: Session[];
  reflectionCadence: ReflectionCadence;
  activeProjects: Project[];
  todayHighImpactTask?: Task;
  getProject: (id: string) => Project | undefined;
  getTasksForProject: (projectId: string) => Task[];
  getSubtasksForTask: (taskId: string) => Subtask[];
  addTask: (projectId: string, impact?: TaskImpact) => void;
  updateTaskTitle: (taskId: string, title: string) => void;
  setProjectStatus: (projectId: string, status: Project["status"]) => void;
  toggleTaskStatus: (taskId: string) => void;
  toggleSubtask: (subtaskId: string) => void;
  ensureSubtasks: (taskId: string) => Promise<void>;
  completeSession: (taskId: string, completed: boolean) => void;
  setReflectionCadence: (cadence: ReflectionCadence) => void;
  suggestion: string;
};

const AppContext = createContext<AppState | null>(null);

function weightedProjectProgress(projectId: string, tasks: Task[]) {
  const projectTasks = tasks.filter((task) => task.projectId === projectId);
  if (!projectTasks.length) return 0;

  const weights: Record<TaskImpact, number> = { low: 1, medium: 2, high: 5 };
  const total = projectTasks.reduce((sum, task) => sum + weights[task.impact], 0);
  const done = projectTasks.reduce((sum, task) => sum + (task.status === "done" ? weights[task.impact] : 0), 0);
  return Math.round((done / total) * 100);
}

export function AppProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState(mockUser);
  const [projects, setProjects] = useState(mockProjects);
  const [tasks, setTasks] = useState(mockTasks);
  const [subtasks, setSubtasks] = useState(mockSubtasks);
  const [sessions, setSessions] = useState(mockSessions);
  const [reflectionCadence, setReflectionCadence] = useState<ReflectionCadence>("Weekly");
  const [suggestion] = useState("You've been avoiding onboarding. It is the highest-leverage step right now.");

  const hydratedProjects = useMemo(
    () =>
      projects.map((project) => ({
        ...project,
        progress: Math.max(project.progress, weightedProjectProgress(project.id, tasks))
      })),
    [projects, tasks]
  );

  const activeProjects = hydratedProjects.filter((project) => project.status === "active").slice(0, 3);
  const todayHighImpactTask = tasks.find((task) => task.impact === "high" && task.status !== "done");

  const value = useMemo<AppState>(
    () => ({
      user,
      projects: hydratedProjects,
      tasks,
      subtasks,
      sessions,
      reflectionCadence,
      activeProjects,
      todayHighImpactTask,
      getProject: (id) => hydratedProjects.find((project) => project.id === id),
      getTasksForProject: (projectId) => tasks.filter((task) => task.projectId === projectId),
      getSubtasksForTask: (taskId) => subtasks.filter((subtask) => subtask.taskId === taskId),
      addTask: (projectId, impact = "medium") => {
        const projectTasks = tasks.filter((task) => task.projectId === projectId);
        const highExists = projectTasks.some((task) => task.impact === "high" && task.status !== "done");
        const secondaryCount = projectTasks.filter((task) => task.impact !== "high" && task.status !== "done").length;

        if (impact === "high" && highExists) return;
        if (impact !== "high" && secondaryCount >= 2) return;

        setTasks((current) => [
          ...current,
          {
            id: `task-${Date.now()}`,
            projectId,
            title: impact === "high" ? "Name the one hard move" : "Add one concrete next step",
            impact,
            status: "todo"
          }
        ]);
      },
      updateTaskTitle: (taskId, title) => {
        const nextTitle = title.trim();
        if (!nextTitle) return;
        setTasks((current) =>
          current.map((task) => (task.id === taskId ? { ...task, title: nextTitle } : task))
        );
      },
      setProjectStatus: (projectId, status) => {
        setProjects((current) =>
          current.map((project) =>
            project.id === projectId ? { ...project, status, lastEditedAt: "just now" } : project
          )
        );
      },
      toggleTaskStatus: (taskId) => {
        setTasks((current) =>
          current.map((task) => {
            if (task.id !== taskId) return task;
            const nextStatus: TaskStatus = task.status === "done" ? "todo" : "done";
            return { ...task, status: nextStatus };
          })
        );
        const task = tasks.find((item) => item.id === taskId);
        if (task?.impact === "high" && task.status !== "done") {
          setUser((current) => ({
            ...current,
            streak: current.streak + 1,
            lastActiveDate: new Date().toISOString().slice(0, 10)
          }));
        }
      },
      toggleSubtask: (subtaskId) => {
        setSubtasks((current) =>
          current.map((subtask) =>
            subtask.id === subtaskId
              ? { ...subtask, status: subtask.status === "done" ? "todo" : "done" }
              : subtask
          )
        );
      },
      ensureSubtasks: async (taskId) => {
        if (subtasks.some((subtask) => subtask.taskId === taskId)) return;
        const task = tasks.find((item) => item.id === taskId);
        const project = task ? hydratedProjects.find((item) => item.id === task.projectId) : undefined;
        if (!task || !project) return;
        const generated = await mockAiService.generateSubtasks({ task, project });
        setSubtasks((current) => [
          ...current,
          ...generated.map((item, index) => ({
            id: `subtask-${taskId}-${index}`,
            taskId,
            title: item.title,
            status: "todo" as const
          }))
        ]);
      },
      completeSession: (taskId, completed) => {
        const finishedTask = tasks.find((task) => task.id === taskId);
        setSessions((current) => [
          ...current,
          {
            id: `session-${Date.now()}`,
            taskId,
            startTime: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
            endTime: new Date().toISOString(),
            completed
          }
        ]);
        if (completed) {
          if (finishedTask?.impact === "high" && finishedTask.status !== "done") {
            setUser((current) => ({
              ...current,
              streak: current.streak + 1,
              lastActiveDate: new Date().toISOString().slice(0, 10)
            }));
          }
          setTasks((current) =>
            current.map((task) => (task.id === taskId ? { ...task, status: "done" } : task))
          );
        }
      },
      setReflectionCadence,
      suggestion
    }),
    [activeProjects, hydratedProjects, reflectionCadence, sessions, subtasks, suggestion, tasks, todayHighImpactTask, user]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const state = useContext(AppContext);
  if (!state) {
    throw new Error("useAppState must be used inside AppProvider");
  }
  return state;
}
