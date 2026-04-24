import { StyleSheet, View } from "react-native";

import { ProgressIndicator } from "@/components/ProgressIndicator";
import { Screen } from "@/components/Screen";
import { AppText } from "@/components/Text";
import { useAppState } from "@/state/AppContext";
import { colors, radius, spacing } from "@/theme/tokens";
import { ReflectionCadence } from "@/types/models";

const reviewPlans: Record<ReflectionCadence, { title: string; intro: string; steps: string[] }> = {
  Daily: {
    title: "Daily review",
    intro: "A short end-of-day check. It keeps tomorrow from inheriting today's noise.",
    steps: [
      "Confirm whether the high-impact task was completed or failed.",
      "Name the one avoided thing that should move forward next.",
      "Carry over only work that still matters."
    ]
  },
  Weekly: {
    title: "Weekly review",
    intro: "A wider review of direction, leverage, and active project load.",
    steps: [
      "Compare progress by impact, not number of tasks completed.",
      "Choose which active projects stay alive, pause, or die.",
      "Set the next high-impact task for each project worth continuing."
    ]
  },
  Monthly: {
    title: "Monthly review",
    intro: "A slow audit of creative direction and whether the work still deserves attention.",
    steps: [
      "Look for patterns in avoided sessions and unfinished high-impact tasks.",
      "Decide what no longer belongs in the system.",
      "Commit to the few projects that still feel meaningful."
    ]
  }
};

export function ReviewScreen() {
  const { activeProjects, tasks, sessions, reflectionCadence } = useAppState();
  const highDone = tasks.filter((task) => task.impact === "high" && task.status === "done").length;
  const selectedPlan = reviewPlans[reflectionCadence];

  return (
    <Screen>
      <AppText variant="label">Review</AppText>
      <AppText variant="heading" style={styles.heading}>
        Progress by leverage, not busyness.
      </AppText>
      <View style={styles.reviewCard}>
        <AppText variant="label">Current cadence</AppText>
        <AppText variant="title" style={styles.reviewTitle}>{selectedPlan.title}</AppText>
        <AppText variant="meta">{selectedPlan.intro}</AppText>
        {selectedPlan.steps.map((step, index) => (
          <View key={step} style={styles.stepRow}>
            <AppText variant="button" style={styles.stepNumber}>{index + 1}</AppText>
            <AppText variant="meta" style={styles.stepText}>{step}</AppText>
          </View>
        ))}
      </View>
      <View style={styles.allReviews}>
        <AppText variant="label">What happens at each review</AppText>
        {(Object.keys(reviewPlans) as ReflectionCadence[]).map((cadence) => (
          <View key={cadence} style={[styles.reviewMini, cadence === reflectionCadence && styles.activeMini]}>
            <AppText variant="button">{cadence}</AppText>
            <AppText variant="meta">{reviewPlans[cadence].intro}</AppText>
          </View>
        ))}
      </View>
      <View style={styles.metrics}>
        <View style={styles.metric}>
          <AppText variant="title">{highDone}</AppText>
          <AppText variant="meta">high-impact tasks completed</AppText>
        </View>
        <View style={styles.metric}>
          <AppText variant="title">{sessions.length}</AppText>
          <AppText variant="meta">explicit sessions closed</AppText>
        </View>
      </View>
      <View style={styles.list}>
        {activeProjects.map((project) => (
          <View key={project.id} style={styles.row}>
            <View style={styles.rowText}>
              <AppText variant="button">{project.title}</AppText>
              <AppText variant="meta">Weighted progress</AppText>
            </View>
            <ProgressIndicator progress={project.progress} />
            <AppText variant="button">{project.progress}%</AppText>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg
  },
  reviewCard: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.subtleBorder,
    backgroundColor: colors.ivory,
    gap: spacing.sm,
    marginBottom: spacing.lg
  },
  reviewTitle: {
    color: colors.accentPrimary
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: "hidden",
    textAlign: "center",
    lineHeight: 24,
    color: colors.ivory,
    backgroundColor: colors.ink
  },
  stepText: {
    flex: 1
  },
  allReviews: {
    gap: spacing.sm,
    marginBottom: spacing.lg
  },
  reviewMini: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.subtleBorder,
    backgroundColor: colors.backgroundPrimary,
    gap: 4
  },
  activeMini: {
    backgroundColor: colors.paperDeep,
    borderColor: colors.accentPrimary
  },
  metrics: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg
  },
  metric: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.paperDeep,
    gap: spacing.xs
  },
  list: {
    borderWidth: 1,
    borderColor: colors.subtleBorder,
    borderRadius: radius.lg,
    backgroundColor: colors.ivory,
    overflow: "hidden"
  },
  row: {
    minHeight: 74,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.subtleBorder
  },
  rowText: {
    width: 96,
    gap: 4
  }
});
