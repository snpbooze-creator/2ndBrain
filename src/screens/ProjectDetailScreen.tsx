import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ArrowLeft, MoreHorizontal, Plus } from "lucide-react-native";
import { Alert, Pressable, StyleSheet, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { ProjectThumbnail } from "@/components/ProjectThumbnail";
import { Screen } from "@/components/Screen";
import { SuggestionCard } from "@/components/SuggestionCard";
import { AppText } from "@/components/Text";
import { TaskRow } from "@/components/TaskRow";
import { RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { colors, radius, shadows, spacing } from "@/theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "ProjectDetail">;

export function ProjectDetailScreen({ route, navigation }: Props) {
  const { projectId } = route.params;
  const { getProject, getTasksForProject, addTask, toggleTaskStatus, setProjectStatus, suggestion } = useAppState();
  const project = getProject(projectId);
  const projectTasks = getTasksForProject(projectId);
  const highTasks = projectTasks.filter((task) => task.impact === "high");
  const otherTasks = projectTasks.filter((task) => task.impact !== "high");

  if (!project) return null;

  return (
    <Screen>
      <View style={styles.top}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconButton}>
          <ArrowLeft size={22} color={colors.textPrimary} />
        </Pressable>
        <Pressable
          onPress={() => Alert.alert("Project options", "This first version keeps project settings intentionally minimal.")}
          style={styles.iconButton}
        >
          <MoreHorizontal size={22} color={colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.titleRow}>
        <View style={styles.titleBlock}>
          <AppText variant="heading">{project.title}</AppText>
          <View style={styles.metaRow}>
            <View style={styles.statusDot} />
            <AppText variant="meta">{project.status}</AppText>
            <AppText variant="meta">·</AppText>
            <AppText variant="meta">Last edited {project.lastEditedAt}</AppText>
          </View>
        </View>
        <ProgressIndicator progress={project.progress} circular size={64} />
      </View>

      <View style={styles.headerImage}>
        <ProjectThumbnail type={project.type} large />
      </View>

      <View style={styles.tabs}>
        {["Tasks", "Overview", "Notes", "Brain"].map((tab, index) => (
          <View key={tab} style={[styles.tab, index === 0 && styles.activeTab]}>
            <AppText style={[styles.tabText, index === 0 && styles.activeTabText]}>{tab}</AppText>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <AppText variant="label" style={styles.accentLabel}>High Impact</AppText>
        <View style={styles.taskCard}>
          {highTasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              showGrip
              onToggle={() => toggleTaskStatus(task.id)}
              onPress={() => navigation.navigate("Session", { taskId: task.id })}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <AppText variant="label">Other Tasks</AppText>
        <View style={styles.taskCard}>
          {otherTasks.map((task) => (
            <TaskRow key={task.id} task={task} showGrip onToggle={() => toggleTaskStatus(task.id)} />
          ))}
        </View>
        <Pressable onPress={() => addTask(project.id)} testID="add-task-row" style={styles.addRow}>
          <Plus size={18} color={colors.taupe} />
          <AppText>Add new task</AppText>
        </Pressable>
      </View>

      <SuggestionCard
        text={suggestion}
        onPress={() => {
          const target = highTasks.find((task) => task.status !== "done") ?? highTasks[0];
          if (target) navigation.navigate("Session", { taskId: target.id });
        }}
      />

      <View style={styles.actions}>
        <PrimaryButton
          variant="ghost"
          style={styles.actionButton}
          onPress={() => setProjectStatus(project.id, project.status === "paused" ? "active" : "paused")}
        >
          {project.status === "paused" ? "Resume project" : "Pause project"}
        </PrimaryButton>
        <PrimaryButton
          variant="ghost"
          style={styles.actionButton}
          onPress={() =>
            Alert.alert("Kill this project?", "This will mark the project as dead in local state.", [
              { text: "Cancel", style: "cancel" },
              { text: "Kill project", style: "destructive", onPress: () => setProjectStatus(project.id, "dead") }
            ])
          }
        >
          Kill project
        </PrimaryButton>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xl
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ivory,
    borderWidth: 1,
    borderColor: colors.subtleBorder,
    ...shadows.light
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.xl
  },
  titleBlock: {
    flex: 1
  },
  metaRow: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.taupe
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.subtleBorder,
    marginBottom: spacing.lg
  },
  headerImage: {
    height: 148,
    borderRadius: radius.lg,
    overflow: "hidden",
    marginBottom: spacing.xl,
    backgroundColor: colors.backgroundSecondary
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent"
  },
  activeTab: {
    borderBottomColor: colors.textPrimary
  },
  tabText: {
    fontSize: 15,
    color: colors.mutedText
  },
  activeTabText: {
    color: colors.textPrimary
  },
  section: {
    gap: spacing.sm,
    marginBottom: spacing.lg
  },
  accentLabel: {
    color: colors.accentPrimary
  },
  taskCard: {
    borderWidth: 1,
    borderColor: colors.subtleBorder,
    borderRadius: radius.md,
    backgroundColor: colors.ivory,
    overflow: "hidden"
  },
  addRow: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.subtleBorder,
    borderRadius: radius.md
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg
  },
  actionButton: {
    flex: 1,
    minHeight: 46
  }
});
