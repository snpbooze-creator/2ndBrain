import { ArrowRight, CircleDot, Star } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/Text";
import { colors, radius, shadows, spacing } from "@/theme/tokens";
import { Project, Task } from "@/types/models";

type FocusCardProps = {
  task: Task;
  project?: Project;
  onPress?: () => void;
};

export function FocusCard({ task, project, onPress }: FocusCardProps) {
  return (
    <Pressable onPress={onPress} testID={`focus-card-${task.id}`} style={styles.card}>
      <View style={styles.impactRow}>
        <Star size={14} color={colors.accentPrimary} fill={colors.accentPrimary} />
        <AppText variant="label" style={styles.impactText}>
          High Impact
        </AppText>
      </View>
      <AppText variant="title" style={styles.title}>
        {task.title}
      </AppText>
      <View style={styles.bottom}>
        <View style={styles.projectRow}>
          <CircleDot size={13} color={colors.backgroundSecondary} />
          <AppText style={styles.project}>{project?.title}</AppText>
        </View>
        <View style={styles.cta}>
          <ArrowRight size={22} color={colors.ink} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 188,
    justifyContent: "space-between",
    backgroundColor: colors.ink,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.soft
  },
  impactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  impactText: {
    color: colors.accentPrimary
  },
  title: {
    color: colors.ivory,
    maxWidth: "86%"
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end"
  },
  projectRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  project: {
    color: colors.ivory,
    fontSize: 14
  },
  cta: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundSecondary
  }
});
