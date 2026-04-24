import { Project, Subtask, Task } from "@/types/models";

export type TaskBreakdownInput = {
  task: Task;
  project: Project;
};

export type AiService = {
  generateSubtasks(input: TaskBreakdownInput): Promise<Pick<Subtask, "title">[]>;
  suggestNextHighImpactTask(input: { projects: Project[]; tasks: Task[] }): Promise<string>;
};

export const AI_BREAKDOWN_PROMPT = `You are an execution-focused assistant.

Break this task into the smallest set of high-quality, actionable subtasks a human can realistically complete.

TASK:
{task_title}

PROJECT TYPE:
{project_type}

CONTEXT:
{project_context}

Rules:
1. Generate 3 to 6 subtasks only.
2. Each subtask must be specific, concrete, and immediately actionable.
3. Each subtask must be completable in one focused work session.
4. Avoid vague steps like research, plan, work on, improve, or think about.
5. Avoid redundant or overlapping subtasks.
6. Focus on execution, not organization.
7. Prioritize the hardest or most avoided step early.
8. If the task is already small, return fewer subtasks.
9. Each title should be short, ideally 8-12 words max.

Return JSON only:
[
  { "title": "..." }
]`;

export const mockAiService: AiService = {
  async generateSubtasks({ task, project }) {
    const appDefaults = [
      "Build the primary screen state",
      "Wire the main user input path",
      "Add empty and error states",
      "Test the flow on a small device"
    ];

    const creativeDefaults = [
      "Make the first concrete draft",
      "Remove the weakest section",
      "Tighten the opening moment",
      "Export one version for review"
    ];

    const titles = project.type === "app" ? appDefaults : creativeDefaults;
    return titles.slice(0, task.title.length < 28 ? 3 : 4).map((title) => ({ title }));
  },

  async suggestNextHighImpactTask({ tasks }) {
    const activeHigh = tasks.find((task) => task.impact === "high" && task.status !== "done");
    if (!activeHigh) {
      return "Choose one hard task before adding more work.";
    }
    return `You've been avoiding ${activeHigh.title.toLowerCase().replace(/^finish /, "")}. It is the highest-leverage step right now.`;
  }
};
