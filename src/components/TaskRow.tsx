import { Circle, Grip, Star } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/Text";
import { colors, spacing } from "@/theme/tokens";
import { Task } from "@/types/models";

type TaskRowProps = {
  task: Task;
  onPress?: () => void;
  onToggle?: () => void;
  showGrip?: boolean;
};

export function TaskRow({ task, onPress, onToggle, showGrip = false }: TaskRowProps) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <Pressable onPress={onToggle} hitSlop={10}>
        {task.impact === "high" ? (
          <Star size={19} color={colors.taupe} strokeWidth={1.6} />
        ) : (
          <Circle size={19} color={colors.mutedText} strokeWidth={1.2} />
        )}
      </Pressable>
      <AppText style={styles.title}>{task.title}</AppText>
      {task.impact !== "high" && (
        <AppText variant="label" style={[styles.impact, task.impact === "low" && styles.low]}>
          {task.impact}
        </AppText>
      )}
      {showGrip && <Grip size={16} color={colors.mutedText} strokeWidth={1.5} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.subtleBorder
  },
  title: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20
  },
  impact: {
    color: colors.taupe
  },
  low: {
    color: colors.blue
  }
});
