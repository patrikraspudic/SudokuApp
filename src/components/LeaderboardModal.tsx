import React from "react";
import { Alert, FlatList, Modal, Pressable, Text, View } from "react-native";
import { styles } from "../styles/sudokuStyles";
import { LeaderboardEntry } from "../types/sudoku";

type Props = {
  visible: boolean;
  leaderboard: LeaderboardEntry[];
  onClose: () => void;
  onClear: () => Promise<void>;
  formatTime: (s: number) => string;
};

export default function LeaderboardModal({
  visible,
  leaderboard,
  onClose,
  onClear,
  formatTime,
}: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { maxHeight: "75%" }]}>
          <Text style={styles.modalTitle}>Leaderboard (lokalno)</Text>
          <Text style={styles.modalSub}>Najbolja vremena na ovom uređaju.</Text>

          {leaderboard.length === 0 ? (
            <Text style={[styles.modalSub, { marginTop: 10 }]}>
              Još nema rezultata. Riješi sudoku 🙂
            </Text>
          ) : (
            <FlatList
              style={{ marginTop: 12, width: "100%" }}
              data={leaderboard.slice(0, 20)}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
              renderItem={({ item, index }) => (
                <View style={styles.lbRow}>
                  <Text style={styles.lbRank}>#{index + 1}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.lbName}>{item.name}</Text>
                    <Text style={styles.lbMeta}>
                      {new Date(item.date).toLocaleString()} · {item.puzzleId}
                    </Text>
                  </View>
                  <Text style={styles.lbTime}>{formatTime(item.seconds)}</Text>
                </View>
              )}
            />
          )}

          <View style={styles.modalRow}>
            <Pressable
              style={[styles.modalBtn, styles.modalBtnGhost]}
              onPress={() => {
                Alert.alert(
                  "Obriši leaderboard?",
                  "Ovo briše sve lokalne rezultate.",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => onClear(),
                    },
                  ],
                );
              }}
            >
              <Text style={styles.modalBtnText}>Clear</Text>
            </Pressable>

            <Pressable style={styles.modalBtn} onPress={onClose}>
              <Text style={styles.modalBtnText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
