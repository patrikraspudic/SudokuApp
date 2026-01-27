import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../styles/sudokuStyles";

type Props = {
  onNew: () => void;
  onReset: () => void;
  onHint: () => void;
  onCheck: () => void;
  onOpenLeaderboard: () => void;
};

export default function SudokuActions({
  onNew,
  onReset,
  onHint,
  onCheck,
  onOpenLeaderboard,
}: Props) {
  return (
    <View style={styles.actionsRow}>
      <Pressable style={styles.actionBtn} onPress={onNew}>
        <Text style={styles.actionText}>New</Text>
      </Pressable>
      <Pressable style={styles.actionBtn} onPress={onReset}>
        <Text style={styles.actionText}>Reset</Text>
      </Pressable>
      <Pressable style={styles.actionBtn} onPress={onHint}>
        <Text style={styles.actionText}>Hint</Text>
      </Pressable>
      <Pressable style={styles.actionBtn} onPress={onCheck}>
        <Text style={styles.actionText}>Check</Text>
      </Pressable>
      <Pressable style={styles.actionBtn} onPress={onOpenLeaderboard}>
        <Text style={styles.actionText}>LB</Text>
      </Pressable>
    </View>
  );
}
