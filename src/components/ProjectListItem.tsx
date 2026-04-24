import { Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/Text";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { ProjectThumbnail } from "@/components/ProjectThumbnail";
import { colors, spacing } from "@/theme/tokens";
import { Project } from "@/types/models";

type ProjectListItemProps = {
  project: Project;
  onPress?: () => void;
  testID?: string;
};

export function ProjectListItem({ project, onPress, testID }: ProjectListItemProps) {
  return (
    <Pressable onPress={onPress} testID={testID ?? `project-row-${project.id}`} style={styles.row}>
      <ProjectThumbnail type={project.type} />
      <View style={styles.main}>
        <AppText variant="button">{project.title}</AppText>
        <ProgressIndicator progress={project.progress} />
      </View>
      <View style={styles.percentBlock}>
        <AppText variant="button">{project.progress}%</AppText>
        <View style={styles.miniBar}>
          <View style={[styles.miniFill, { width: `${Math.min(project.progress, 100)}%` }]} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    minHeight: 64
  },
  main: {
    flex: 1,
    gap: spacing.xs
  },
  percentBlock: {
    width: 42,
    alignItems: "flex-end",
    gap: 7
  },
  miniBar: {
    width: 34,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.subtleBorder,
    overflow: "hidden"
  },
  miniFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.accentPrimary
  }
});
