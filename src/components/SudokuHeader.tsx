import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../styles/sudokuStyles";
import { formatTime } from "../utils/time";

type Props = {
  playerName: string;
  elapsed: number;
  bestTime: number | null;
  onOpenName: () => void;
};

export default function SudokuHeader({
  playerName,
  elapsed,
  bestTime,
  onOpenName,
}: Props) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>Sudoku</Text>
        <Text style={styles.sub}>
          Igrač: <Text style={styles.subStrong}>{playerName || "—"}</Text> ·
          Time: <Text style={styles.subStrong}>{formatTime(elapsed)}</Text>
          {bestTime != null ? (
            <Text style={styles.subMuted}> · Best: {formatTime(bestTime)}</Text>
          ) : null}
        </Text>
      </View>

      <Pressable style={styles.smallBtn} onPress={onOpenName}>
        <Text style={styles.smallBtnText}>Ime</Text>
      </Pressable>
    </View>
  );
}
