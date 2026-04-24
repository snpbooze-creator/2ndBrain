import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";

import { ProjectListItem } from "@/components/ProjectListItem";
import { Screen } from "@/components/Screen";
import { AppText } from "@/components/Text";
import { RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { colors, radius, spacing } from "@/theme/tokens";

export function ProjectsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { activeProjects } = useAppState();

  return (
    <Screen>
      <AppText variant="label">Projects</AppText>
      <AppText variant="heading" style={styles.heading}>
        Keep only the work that can still become real.
      </AppText>
      <View style={styles.ruleCard}>
        <AppText variant="title" style={styles.ruleNumber}>
          {activeProjects.length}/3
        </AppText>
        <AppText variant="meta">active projects. Pause or kill one before adding another.</AppText>
      </View>
      <View style={styles.list}>
        {activeProjects.map((project) => (
          <ProjectListItem
            key={project.id}
            project={project}
            testID={`projects-project-row-${project.id}`}
            onPress={() => navigation.navigate("ProjectDetail", { projectId: project.id })}
          />
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
  ruleCard: {
    padding: spacing.lg,
    backgroundColor: colors.paperDeep,
    borderRadius: radius.lg,
    marginBottom: spacing.lg
  },
  ruleNumber: {
    color: colors.accentPrimary,
    marginBottom: spacing.xs
  },
  list: {
    gap: spacing.md
  }
});
