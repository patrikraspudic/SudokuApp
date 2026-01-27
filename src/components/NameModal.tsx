import React from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { styles } from "../styles/sudokuStyles";

type Props = {
  visible: boolean;
  playerName: string;
  nameDraft: string;
  setNameDraft: (v: string) => void;
  onCancel: () => void;
  onSave: () => void;
};

export default function NameModal({
  visible,
  playerName,
  nameDraft,
  setNameDraft,
  onCancel,
  onSave,
}: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Unesi ime</Text>
          <Text style={styles.modalSub}>
            Ime se koristi za leaderboard i sprema se lokalno.
          </Text>

          <TextInput
            value={nameDraft}
            onChangeText={setNameDraft}
            placeholder="npr. Patrik"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            autoCapitalize="words"
            autoCorrect={false}
          />

          <View style={styles.modalRow}>
            <Pressable
              style={[styles.modalBtn, styles.modalBtnGhost]}
              onPress={onCancel}
            >
              <Text style={styles.modalBtnText}>Cancel</Text>
            </Pressable>

            <Pressable style={styles.modalBtn} onPress={onSave}>
              <Text style={styles.modalBtnText}>Save</Text>
            </Pressable>
          </View>

          {!playerName ? (
            <Text style={[styles.modalSub, { marginTop: 10 }]}>
              Moraš unijeti ime prvi put
            </Text>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}
