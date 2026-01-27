import React from "react";
import { Pressable, Text, View } from "react-native";
import { idx } from "../utils/sudoku";
import { styles } from "../styles/sudokuStyles";

type Props = {
  gridSize: number;
  cellSize: number;
  board: number[];
  selected: number | null;
  fixed: boolean[];
  conflicts: Set<number>;
  onSelect: (i: number) => void;
};

export default function SudokuGrid({
  gridSize,
  cellSize,
  board,
  selected,
  fixed,
  conflicts,
  onSelect,
}: Props) {
  return (
    <View style={[styles.gridWrap, { width: gridSize, height: gridSize }]}>
      {Array.from({ length: 9 }).map((_, r) => (
        <View key={r} style={{ flexDirection: "row" }}>
          {Array.from({ length: 9 }).map((_, c) => {
            const i = idx(r, c);
            const v = board[i];

            const isSelectedCell = i === selected;
            const isFixed = fixed[i];
            const isConflict = conflicts.has(i);

            const cellStyle = [
              styles.cell,
              {
                width: cellSize,
                height: cellSize,
                borderLeftWidth: c % 3 === 0 ? 2 : 1,
                borderTopWidth: r % 3 === 0 ? 2 : 1,
                borderRightWidth: c === 8 ? 2 : 1,
                borderBottomWidth: r === 8 ? 2 : 1,
              },
              isFixed && styles.cellFixed,
              isSelectedCell && styles.cellSelected,
              isConflict && styles.cellConflict,
            ];

            return (
              <Pressable key={c} onPress={() => onSelect(i)} style={cellStyle}>
                <Text style={[styles.cellText, isFixed && styles.cellTextFixed]}>
                  {v === 0 ? "" : String(v)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}
