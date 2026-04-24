import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Check, ChevronDown, ChevronUp, Pencil, Plus } from "lucide-react-native";
import { Alert, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useState } from "react";

import { FocusCard } from "@/components/FocusCard";
import { BrandMark } from "@/components/BrandMark";
import { ProjectListItem } from "@/components/ProjectListItem";
import { Screen } from "@/components/Screen";
import { AppText } from "@/components/Text";
import { TaskRow } from "@/components/TaskRow";
import { MainTabParamList, RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { colors, radius, spacing } from "@/theme/tokens";

export function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList> & BottomTabNavigationProp<MainTabParamList>>();
  const { user, activeProjects, tasks, todayHighImpactTask, getProject, toggleTaskStatus, addTask, updateTaskTitle } =
    useAppState();
  const otherTasks = tasks.filter((task) => task.impact !== "high" && task.status !== "done").slice(0, 2);
  const focusProject = todayHighImpactTask ? getProject(todayHighImpactTask.projectId) : undefined;
  const [isGuideExpanded, setIsGuideExpanded] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [draftTaskTitle, setDraftTaskTitle] = useState("");

  const startEditingTask = (taskId: string, title: string) => {
    setEditingTaskId(taskId);
    setDraftTaskTitle(title);
  };

  const saveTaskTitle = () => {
    if (!editingTaskId) return;
    updateTaskTitle(editingTaskId, draftTaskTitle);
    setEditingTaskId(null);
    setDraftTaskTitle("");
  };

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.brandBlock}>
          <BrandMark />
        </View>
        <View style={styles.avatar}>
          <AppText variant="button">{user.name.slice(0, 1)}</AppText>
        </View>
      </View>

      <AppText variant="heading" style={styles.prompt}>
        What's the most important thing <AppText variant="heading" style={styles.today}>today?</AppText>
      </AppText>

      {todayHighImpactTask && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleBlock}>
              <AppText variant="label">Today's Focus</AppText>
            </View>
          </View>
          <FocusCard
            task={todayHighImpactTask}
            project={focusProject}
            onPress={() => navigation.navigate("Session", { taskId: todayHighImpactTask.id })}
          />
          <Pressable
            style={styles.secondaryActionRow}
            onPress={() =>
              Alert.alert("Why this?", "This is the single high-impact task for today. Completing it is what advances the streak.")
            }
          >
            <AppText variant="meta">Why this?</AppText>
          </Pressable>
        </View>
      )}

      <View style={styles.guideCard}>
        <Pressable style={styles.guideHeader} onPress={() => setIsGuideExpanded((current) => !current)}>
          <AppText variant="label">Instructions</AppText>
          {isGuideExpanded ? (
            <ChevronUp size={18} color={colors.textPrimary} />
          ) : (
            <ChevronDown size={18} color={colors.textPrimary} />
          )}
        </Pressable>
        {isGuideExpanded && (
          <>
            <View style={styles.guideRow}>
              <AppText variant="button" style={styles.guideNumber}>1</AppText>
              <AppText variant="meta" style={styles.guideText}>Pick exactly one high-impact task. This is the task that would make the day meaningful.</AppText>
            </View>
            <View style={styles.guideRow}>
              <AppText variant="button" style={styles.guideNumber}>2</AppText>
              <AppText variant="meta" style={styles.guideText}>Keep at most two secondary tasks. They should support the main task, not compete with it.</AppText>
            </View>
            <View style={styles.guideRow}>
              <AppText variant="button" style={styles.guideNumber}>3</AppText>
              <AppText variant="meta" style={styles.guideText}>Start a session, then explicitly complete or fail it. There is no passive tracking.</AppText>
            </View>
          </>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleBlock}>
            <AppText variant="label">Other Tasks</AppText>
            <AppText variant="meta">Small support tasks only. You can carry up to two.</AppText>
          </View>
        </View>
        <View style={styles.listCard}>
          {otherTasks.map((task) =>
            editingTaskId === task.id ? (
              <View key={task.id} style={styles.editRow}>
                <TextInput
                  value={draftTaskTitle}
                  onChangeText={setDraftTaskTitle}
                  style={styles.editInput}
                  testID={`support-task-input-${task.id}`}
                  autoFocus
                  placeholder="Edit support task"
                  placeholderTextColor={colors.mutedText}
                  onSubmitEditing={saveTaskTitle}
                />
                <Pressable onPress={saveTaskTitle} style={styles.editAction}>
                  <Check size={16} color={colors.ivory} />
                </Pressable>
              </View>
            ) : (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={() => toggleTaskStatus(task.id)}
                onPress={() => navigation.navigate("Session", { taskId: task.id })}
              />
            )
          )}
        </View>
        <View style={styles.secondaryActionRow}>
          {otherTasks.length > 0 && (
            <Pressable
              style={styles.editSupportLink}
              onPress={() => startEditingTask(otherTasks[otherTasks.length - 1].id, otherTasks[otherTasks.length - 1].title)}
            >
              <Pencil size={14} color={colors.mutedText} />
              <AppText variant="meta">Edit task</AppText>
            </Pressable>
          )}
          <AppText variant="meta">{otherTasks.length}/2</AppText>
          <Pressable
            onPress={() => {
              if (focusProject) addTask(focusProject.id);
              Alert.alert("Daily limit", "Second Brain keeps each day to one high-impact task and up to two secondary tasks.");
            }}
          >
            <Plus size={18} color={colors.textPrimary} />
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleBlock}>
            <AppText variant="label">Your Projects</AppText>
            <AppText variant="meta">Only active projects appear here. The app keeps you to three.</AppText>
          </View>
        </View>
        <View style={styles.projects}>
          {activeProjects.map((project) => (
            <ProjectListItem
              key={project.id}
              project={project}
              testID={`home-project-row-${project.id}`}
              onPress={() => navigation.navigate("ProjectDetail", { projectId: project.id })}
            />
          ))}
        </View>
        <Pressable style={styles.secondaryActionRow} onPress={() => navigation.navigate("Projects")}>
          <AppText variant="meta">View all</AppText>
        </Pressable>
      </View>

      <AppText variant="meta" style={styles.streak}>
        {user.streak} day streak. Only high-impact completions count.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.md,
    marginBottom: spacing.md
  },
  brandBlock: {
    flex: 1
  },
  prompt: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    maxWidth: 292
  },
  today: {
    color: colors.accentPrimary
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center"
  },
  guideCard: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.paperDeep,
    gap: spacing.sm,
    alignSelf: "stretch",
    alignItems: "flex-start"
  },
  guideRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md
  },
  guideHeader: {
    minHeight: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: spacing.sm,
    outlineStyle: "none"
  } as object,
  guideNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: "hidden",
    textAlign: "center",
    lineHeight: 24,
    color: colors.ivory,
    backgroundColor: colors.ink
  },
  guideText: {
    flex: 1
  },
  section: {
    marginTop: spacing.md,
    gap: spacing.sm
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.md
  },
  sectionTitleBlock: {
    flex: 1,
    gap: 3
  },
  secondaryActionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing.md,
    minHeight: 24
  },
  editSupportLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginRight: "auto"
  },
  listCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.subtleBorder,
    backgroundColor: colors.ivory,
    overflow: "hidden"
  },
  editRow: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.subtleBorder
  },
  editInput: {
    flex: 1,
    color: colors.textPrimary,
    fontFamily: "PlayfairDisplay_400Regular",
    fontSize: 16,
    lineHeight: 22,
    paddingVertical: spacing.sm,
    outlineStyle: "none"
  } as object,
  editAction: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ink
  },
  projects: {
    gap: spacing.xs
  },
  streak: {
    marginTop: spacing.lg,
    textAlign: "center"
  }
});
