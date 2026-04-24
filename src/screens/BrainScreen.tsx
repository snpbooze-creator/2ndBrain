import { StyleSheet, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { Screen } from "@/components/Screen";
import { BrainVisual } from "@/components/BrainVisual";
import { SuggestionCard } from "@/components/SuggestionCard";
import { AppText } from "@/components/Text";
import { RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { colors, radius, spacing } from "@/theme/tokens";

export function BrainScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { suggestion, activeProjects, todayHighImpactTask } = useAppState();

  return (
    <Screen>
      <AppText variant="label">Brain</AppText>
      <AppText variant="heading" style={styles.heading}>
        Threads worth keeping close.
      </AppText>
      <BrainVisual />
      <SuggestionCard
        text={suggestion}
        onPress={() => {
          if (todayHighImpactTask) navigation.navigate("Session", { taskId: todayHighImpactTask.id });
        }}
      />
      <View style={styles.notes}>
        {activeProjects.map((project) => (
          <View key={project.id} style={styles.note}>
            <AppText variant="label">{project.type}</AppText>
            <AppText variant="title" style={styles.noteTitle}>{project.title}</AppText>
            <AppText variant="meta">{project.context}</AppText>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl
  },
  notes: {
    gap: spacing.md,
    marginTop: spacing.lg
  },
  note: {
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.subtleBorder,
    backgroundColor: colors.ivory,
    gap: spacing.sm
  },
  noteTitle: {
    fontSize: 22
  }
});
