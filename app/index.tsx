import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LeaderboardModal from "../src/components/LeaderboardModal";
import NameModal from "../src/components/NameModal";
import SudokuActions from "../src/components/SudokuActions";
import SudokuGrid from "../src/components/SudokuGrid";
import SudokuHeader from "../src/components/SudokuHeader";
import SudokuKeypad from "../src/components/SudokuKeypad";
import { useSudokuGame } from "../src/hooks/useSudokuGame";
import { styles } from "../src/styles/sudokuStyles";

export default function SudokuScreen() {
  const g = useSudokuGame();

  return (
    <SafeAreaView style={styles.safe}>
      <SudokuHeader
        playerName={g.playerName}
        elapsed={g.elapsed}
        bestTime={g.bestTime}
        onOpenName={() => g.setShowNameModal(true)}
      />

      <SudokuGrid
        gridSize={g.gridSize}
        cellSize={g.cellSize}
        board={g.board}
        selected={g.selected}
        fixed={g.fixed}
        conflicts={g.conflicts}
        onSelect={g.setSelected}
      />

      <SudokuActions
        onNew={g.startNewGame}
        onReset={g.resetGame}
        onHint={g.hint}
        onCheck={g.check}
        onOpenLeaderboard={() => g.setShowLeaderboard(true)}
      />

      <SudokuKeypad onInput={g.inputNumber} onErase={g.erase} />

      <Text style={styles.hintText}>
        Timer se pauzira automatski kad izađeš iz aplikacije (background) i
        nastavi kad se vratiš.
      </Text>

      <NameModal
        visible={g.showNameModal}
        playerName={g.playerName}
        nameDraft={g.nameDraft}
        setNameDraft={g.setNameDraft}
        onCancel={g.cancelNameModal}
        onSave={g.saveName}
      />

      <LeaderboardModal
        visible={g.showLeaderboard}
        leaderboard={g.leaderboard}
        onClose={() => g.setShowLeaderboard(false)}
        onClear={g.clearLeaderboard}
        formatTime={g.formatTime}
      />
    </SafeAreaView>
  );
}
