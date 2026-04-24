import { Circle, CircleCheck } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/Text";
import { colors, radius, spacing } from "@/theme/tokens";
import { Subtask } from "@/types/models";

type SubtaskChecklistProps = {
  subtasks: Subtask[];
  onToggle: (id: string) => void;
};

export function SubtaskChecklist({ subtasks, onToggle }: SubtaskChecklistProps) {
  return (
    <View style={styles.wrap}>
      <AppText variant="label">Session Steps</AppText>
      <View style={styles.card}>
        {subtasks.map((subtask) => (
          <Pressable key={subtask.id} onPress={() => onToggle(subtask.id)} style={styles.row}>
            {subtask.status === "done" ? (
              <CircleCheck size={18} color={colors.accentSecondary} strokeWidth={1.8} />
            ) : (
              <Circle size={18} color={colors.mutedText} strokeWidth={1.2} />
            )}
            <AppText style={[styles.title, subtask.status === "done" && styles.done]}>{subtask.title}</AppText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm
  },
  card: {
    borderWidth: 1,
    borderColor: colors.subtleBorder,
    borderRadius: radius.md,
    backgroundColor: colors.ivory,
    overflow: "hidden"
  },
  row: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.subtleBorder
  },
  title: {
    flex: 1,
    fontSize: 14,
    lineHeight: 19
  },
  done: {
    color: colors.mutedText,
    textDecorationLine: "line-through"
  }
});
