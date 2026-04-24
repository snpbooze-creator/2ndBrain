import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Platform } from "react-native";
import { Alert, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Check, Music, Play, RotateCcw, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";

import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SubtaskChecklist } from "@/components/SubtaskChecklist";
import { AppText } from "@/components/Text";
import { TimerCircle } from "@/components/TimerCircle";
import { RootStackParamList } from "@/navigation/types";
import { useAppState } from "@/state/AppContext";
import { colors, radius, shadows, spacing } from "@/theme/tokens";

type Props = NativeStackScreenProps<RootStackParamList, "Session">;

export function SessionScreen({ route, navigation }: Props) {
  const { taskId } = route.params;
  const { tasks, getProject, getSubtasksForTask, ensureSubtasks, toggleSubtask, completeSession } = useAppState();
  const task = tasks.find((item) => item.id === taskId);
  const project = task ? getProject(task.projectId) : undefined;
  const subtasks = getSubtasksForTask(taskId);
  const [minutesInput, setMinutesInput] = useState("25");
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioNodesRef = useRef<{
    master: GainNode;
    pulse: OscillatorNode;
    warmth: OscillatorNode;
    shimmer: OscillatorNode;
    lfo: OscillatorNode;
    lfoGain: GainNode;
  } | null>(null);

  useEffect(() => {
    void ensureSubtasks(taskId);
  }, [ensureSubtasks, taskId]);

  useEffect(() => {
    if (!running || paused || remainingSeconds <= 0) return undefined;
    const interval = setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [paused, remainingSeconds, running]);

  useEffect(() => {
    if (running || paused) return;
    const minutes = Math.max(1, Math.min(240, Number.parseInt(minutesInput, 10) || 1));
    setRemainingSeconds(minutes * 60);
  }, [minutesInput, paused, running]);

  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, []);

  if (!task || !project) return null;

  const stopAmbientSound = () => {
    audioNodesRef.current?.pulse.stop();
    audioNodesRef.current?.warmth.stop();
    audioNodesRef.current?.shimmer.stop();
    audioNodesRef.current?.lfo.stop();
    audioNodesRef.current?.master.disconnect();
    audioNodesRef.current?.lfoGain.disconnect();
    audioNodesRef.current = null;
    audioContextRef.current?.suspend().catch(() => {});
  };

  const startAmbientSound = async () => {
    if (Platform.OS !== "web") return false;
    const WebAudioContext =
      globalThis.AudioContext ??
      (globalThis as typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!WebAudioContext) return false;

    const context = audioContextRef.current ?? new WebAudioContext();
    audioContextRef.current = context;
    if (context.state === "suspended") {
      await context.resume();
    }

    if (audioNodesRef.current) return true;

    const master = context.createGain();
    master.gain.value = 0.03;
    master.connect(context.destination);

    const warmth = context.createOscillator();
    warmth.type = "sine";
    warmth.frequency.value = 196;

    const pulse = context.createOscillator();
    pulse.type = "triangle";
    pulse.frequency.value = 247;

    const shimmer = context.createOscillator();
    shimmer.type = "sine";
    shimmer.frequency.value = 392;

    const warmthGain = context.createGain();
    warmthGain.gain.value = 0.7;
    const pulseGain = context.createGain();
    pulseGain.gain.value = 0.24;
    const shimmerGain = context.createGain();
    shimmerGain.gain.value = 0.09;

    const lfo = context.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.08;
    const lfoGain = context.createGain();
    lfoGain.gain.value = 0.015;

    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);

    warmth.connect(warmthGain);
    pulse.connect(pulseGain);
    shimmer.connect(shimmerGain);
    warmthGain.connect(master);
    pulseGain.connect(master);
    shimmerGain.connect(master);

    warmth.start();
    pulse.start();
    shimmer.start();
    lfo.start();

    audioNodesRef.current = { master, pulse, warmth, shimmer, lfo, lfoGain };
    return true;
  };

  const handleSoundToggle = async () => {
    if (soundEnabled) {
      stopAmbientSound();
      setSoundEnabled(false);
      return;
    }

    const started = await startAmbientSound();
    if (started) {
      setSoundEnabled(true);
      return;
    }

    Alert.alert("Sound unavailable", "Focus sound is currently available in the web preview only.");
  };

  const closeSession = () => {
    stopAmbientSound();
    setSoundEnabled(false);
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate("MainTabs");
  };

  const finish = (completed: boolean) => {
    completeSession(task.id, completed);
    closeSession();
  };

  const startTimer = () => {
    const minutes = Math.max(1, Math.min(240, Number.parseInt(minutesInput, 10) || 1));
    setMinutesInput(String(minutes));
    if (remainingSeconds <= 0 || !running) {
      setRemainingSeconds(minutes * 60);
    }
    setPaused(false);
    setRunning(true);
  };

  const resetTimer = () => {
    const minutes = Math.max(1, Math.min(240, Number.parseInt(minutesInput, 10) || 1));
    setRunning(false);
    setPaused(false);
    setRemainingSeconds(minutes * 60);
  };

  const timerLabel =
    paused && running
      ? "Paused"
      : `${Math.floor(remainingSeconds / 60).toString().padStart(2, "0")}:${(remainingSeconds % 60)
          .toString()
          .padStart(2, "0")}`;
  const impactLabel =
    task.impact === "high" ? "High Impact" : task.impact === "medium" ? "Medium Impact" : "Low Impact";

  return (
    <Screen>
      <View style={styles.top}>
        <Pressable onPress={closeSession} testID="session-close-button" style={styles.iconButton}>
          <X size={21} color={colors.textPrimary} />
        </Pressable>
        <Pressable
          onPress={() => {
            void handleSoundToggle();
          }}
          testID="session-sound-button"
          style={[styles.iconButton, soundEnabled && styles.iconButtonActive]}
        >
          <Music size={20} color={soundEnabled ? colors.accentPrimary : colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.hero}>
        <AppText
          variant="label"
          style={[
            styles.impact,
            task.impact === "medium" && styles.mediumImpact,
            task.impact === "low" && styles.lowImpact
          ]}
        >
          {impactLabel}
        </AppText>
        <AppText variant="heading" style={styles.title}>{task.title}</AppText>
        <AppText style={styles.project}>{project.title}</AppText>
        <AppText variant="meta" style={styles.soundStatus}>
          {soundEnabled ? "Focus sound on" : "Focus sound off"}
        </AppText>
      </View>

      <TimerCircle
        remaining={timerLabel}
        progress={remainingSeconds / ((Number.parseInt(minutesInput, 10) || 1) * 60)}
        onStart={startTimer}
        startLabel={running ? (paused ? "Resume" : "Running") : "Start"}
      />

      <View style={styles.timerEditor}>
        <AppText variant="label">Exact time</AppText>
        <View style={styles.inputRow}>
          <TextInput
            value={minutesInput}
            onChangeText={(value) => setMinutesInput(value.replace(/[^0-9]/g, "").slice(0, 3))}
            keyboardType="number-pad"
            editable={!running}
            style={styles.minuteInput}
            testID="timer-minutes-input"
            maxLength={3}
          />
          <AppText variant="button">min</AppText>
          <Pressable onPress={startTimer} style={styles.smallIconButton}>
            <Play size={16} color={colors.ivory} fill={colors.ivory} />
          </Pressable>
          <Pressable onPress={resetTimer} style={[styles.smallIconButton, styles.resetButton]}>
            <RotateCcw size={16} color={colors.textPrimary} />
          </Pressable>
        </View>
      </View>

      <View style={styles.controls}>
        <PrimaryButton
          onPress={() => {
            if (!running) startTimer();
            else setPaused((current) => !current);
          }}
          style={styles.sideButton}
        >
          {paused ? "Resume" : "Pause"}
        </PrimaryButton>
        <Pressable onPress={() => finish(true)} style={styles.completeWrap}>
          <View style={styles.completeButton}>
            <Check size={28} color={colors.ivory} />
          </View>
          <AppText>Complete</AppText>
        </Pressable>
        <PrimaryButton onPress={() => finish(false)} style={styles.sideButton}>Fail</PrimaryButton>
      </View>

      <View style={styles.checklist}>
        <SubtaskChecklist subtasks={subtasks} onToggle={toggleSubtask} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: "row",
    justifyContent: "space-between"
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
  iconButtonActive: {
    backgroundColor: colors.paperDeep,
    borderColor: colors.accentPrimary
  },
  hero: {
    alignItems: "center",
    marginTop: spacing.lg
  },
  impact: {
    color: colors.accentPrimary,
    marginBottom: spacing.md
  },
  mediumImpact: {
    color: colors.taupe
  },
  lowImpact: {
    color: colors.blue
  },
  title: {
    textAlign: "center",
    maxWidth: 310,
    fontSize: 29,
    lineHeight: 36
  },
  project: {
    marginTop: spacing.sm,
    color: colors.mutedText
  },
  soundStatus: {
    marginTop: spacing.xs
  },
  timerEditor: {
    alignSelf: "center",
    marginTop: spacing.sm,
    alignItems: "center",
    gap: spacing.xs
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    minHeight: 42,
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
    borderWidth: 1,
    borderColor: colors.subtleBorder,
    borderRadius: radius.pill
  },
  minuteInput: {
    minWidth: 44,
    paddingVertical: 8,
    textAlign: "center",
    color: colors.textPrimary,
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    outlineStyle: "none"
  } as object,
  smallIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ink
  },
  resetButton: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.subtleBorder
  },
  controls: {
    marginTop: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  sideButton: {
    flex: 1,
    minHeight: 58
  },
  completeWrap: {
    alignItems: "center",
    gap: spacing.xs
  },
  completeButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ink
  },
  checklist: {
    marginTop: spacing.lg
  }
});
