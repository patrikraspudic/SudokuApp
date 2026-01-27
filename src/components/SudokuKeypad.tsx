import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../styles/sudokuStyles";

type Props = {
  onInput: (n: number) => void;
  onErase: () => void;
};

export default function SudokuKeypad({ onInput, onErase }: Props) {
  return (
    <View style={styles.keypad}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
        <Pressable key={n} style={styles.keyBtn} onPress={() => onInput(n)}>
          <Text style={styles.keyText}>{n}</Text>
        </Pressable>
      ))}
      <Pressable style={[styles.keyBtn, styles.eraseBtn]} onPress={onErase}>
        <Text style={styles.keyText}>⌫</Text>
      </Pressable>
    </View>
  );
}
