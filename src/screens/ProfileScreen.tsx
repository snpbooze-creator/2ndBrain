import { Pressable, StyleSheet, View } from "react-native";

import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { AppText } from "@/components/Text";
import { useAppState } from "@/state/AppContext";
import { colors, radius, spacing } from "@/theme/tokens";

const cadenceOptions = ["Daily", "Weekly", "Monthly"] as const;

export function ProfileScreen() {
  const { user, reflectionCadence, setReflectionCadence } = useAppState();

  return (
    <Screen>
      <View style={styles.avatar}>
        <AppText variant="heading">{user.name.slice(0, 1)}</AppText>
      </View>
      <AppText variant="heading" style={styles.name}>{user.name}</AppText>
      <AppText variant="meta" style={styles.meta}>Last active {user.lastActiveDate}</AppText>
      <View style={styles.card}>
        <AppText variant="label">Current streak</AppText>
        <AppText variant="heading" style={styles.streak}>{user.streak} days</AppText>
        <AppText variant="meta">Streaks increase only when the day's high-impact task is completed.</AppText>
      </View>
      <View style={styles.card}>
        <AppText variant="label">Reflection cadence</AppText>
        <AppText variant="title" style={styles.cadenceTitle}>{reflectionCadence}</AppText>
        <AppText variant="meta">Choose how often Review asks you to slow down and inspect your work.</AppText>
        <View style={styles.segmented}>
          {cadenceOptions.map((option) => (
            <Pressable
              key={option}
              onPress={() => setReflectionCadence(option)}
              testID={`cadence-option-${option.toLowerCase()}`}
              style={[styles.segment, reflectionCadence === option && styles.activeSegment]}
            >
              <AppText variant="button" style={reflectionCadence === option && styles.activeSegmentText}>
                {option}
              </AppText>
            </Pressable>
          ))}
        </View>
      </View>
      <PrimaryButton variant="ghost" onPress={() => setReflectionCadence("Weekly")}>
        Reset cadence
      </PrimaryButton>
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundSecondary,
    marginBottom: spacing.lg
  },
  name: {
    marginBottom: spacing.xs
  },
  meta: {
    marginBottom: spacing.xl
  },
  card: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.subtleBorder,
    backgroundColor: colors.ivory,
    gap: spacing.sm,
    marginBottom: spacing.lg
  },
  streak: {
    color: colors.accentPrimary
  },
  cadenceTitle: {
    color: colors.textPrimary
  },
  segmented: {
    flexDirection: "row",
    gap: spacing.xs,
    padding: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.backgroundSecondary
  },
  segment: {
    flex: 1,
    minHeight: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.pill
  },
  activeSegment: {
    backgroundColor: colors.ink
  },
  activeSegmentText: {
    color: colors.ivory
  }
});
