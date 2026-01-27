import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, AppState, AppStateStatus, Dimensions } from "react-native";

import { PUZZLES } from "../data/puzzles";
import { LeaderboardEntry } from "../types/sudoku";
import { loadJSON, saveJSON, STORAGE_KEYS } from "../utils/storage";
import { getConflictSet } from "../utils/sudoku";
import { formatTime } from "../utils/time";

export function useSudokuGame() {
  const gridSize = Math.min(Dimensions.get("window").width - 24, 420);
  const cellSize = Math.floor(gridSize / 9);

  const [gameIndex, setGameIndex] = useState(() =>
    Math.floor(Math.random() * PUZZLES.length),
  );
  const puzzle = PUZZLES[gameIndex];

  const [board, setBoard] = useState<number[]>(() => puzzle.puzzle.slice());
  const [selected, setSelected] = useState<number | null>(null);

  const [elapsed, setElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);

  const [playerName, setPlayerName] = useState("");
  const [nameDraft, setNameDraft] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const [hasSavedWin, setHasSavedWin] = useState(false);

  const fixed = useMemo(() => puzzle.puzzle.map((v) => v !== 0), [gameIndex]);
  const conflicts = useMemo(() => getConflictSet(board), [board]);

  const isSolved = useMemo(() => {
    for (let i = 0; i < 81; i++)
      if (board[i] !== puzzle.solution[i]) return false;
    return true;
  }, [board, puzzle]);

  const solvedRef = useRef(false);
  const runningRef = useRef(true);

  useEffect(() => {
    solvedRef.current = isSolved;
  }, [isSolved]);
  useEffect(() => {
    runningRef.current = timerRunning;
  }, [timerRunning]);

  useEffect(() => {
    (async () => {
      const savedName = await AsyncStorage.getItem(STORAGE_KEYS.PLAYER_NAME);
      const lb = await loadJSON<LeaderboardEntry[]>(
        STORAGE_KEYS.LEADERBOARD,
        [],
      );
      setLeaderboard(Array.isArray(lb) ? lb : []);
      if (savedName && savedName.trim()) {
        setPlayerName(savedName.trim());
        setNameDraft(savedName.trim());
      } else {
        setShowNameModal(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!timerRunning) return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [timerRunning]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state: AppStateStatus) => {
      if (state === "active") {
        if (!solvedRef.current) setTimerRunning(true);
      } else {
        if (runningRef.current) setTimerRunning(false);
      }
    });
    return () => sub.remove();
  }, []);

  const startNewGame = () => {
    const next = Math.floor(Math.random() * PUZZLES.length);
    setGameIndex(next);
    const p = PUZZLES[next];
    setBoard(p.puzzle.slice());
    setSelected(null);
    setElapsed(0);
    setTimerRunning(true);
    setHasSavedWin(false);
  };

  const resetGame = () => {
    setBoard(puzzle.puzzle.slice());
    setSelected(null);
    setElapsed(0);
    setTimerRunning(true);
    setHasSavedWin(false);
  };

  const inputNumber = (n: number) => {
    if (selected == null) return;
    if (fixed[selected]) return;
    setBoard((prev) => {
      const next = prev.slice();
      next[selected] = n;
      return next;
    });
  };

  const erase = () => inputNumber(0);

  const hint = () => {
    const empties: number[] = [];
    for (let i = 0; i < 81; i++)
      if (!fixed[i] && board[i] === 0) empties.push(i);

    if (empties.length === 0) {
      Alert.alert("Hint", "Nema praznih polja");
      return;
    }

    const pick = empties[Math.floor(Math.random() * empties.length)];
    setBoard((prev) => {
      const next = prev.slice();
      next[pick] = puzzle.solution[pick];
      return next;
    });
    setSelected(pick);
  };

  const check = () => {
    let wrong = 0;
    let empty = 0;
    for (let i = 0; i < 81; i++) {
      if (board[i] === 0) empty++;
      else if (board[i] !== puzzle.solution[i]) wrong++;
    }
    if (empty === 0 && wrong === 0)
      Alert.alert("Bravo!", "Sudoku je točno riješen");
    else
      Alert.alert(
        "Provjera",
        `Prazno: ${empty}\nPogrešno: ${wrong}\nKonflikti: ${conflicts.size}`,
      );
  };

  const saveName = async () => {
    const clean = nameDraft.trim();
    if (!clean) {
      Alert.alert("Ime", "Upiši ime (min 1 znak).");
      return;
    }
    setPlayerName(clean);
    await AsyncStorage.setItem(STORAGE_KEYS.PLAYER_NAME, clean);
    setShowNameModal(false);
  };

  const cancelNameModal = () => {
    if (playerName) setShowNameModal(false);
    else Alert.alert("Ime", "Moraš unijeti ime prvi put");
  };

  const addScore = async (seconds: number) => {
    const cleanName = (playerName || "Player").trim() || "Player";
    const entry: LeaderboardEntry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: cleanName,
      seconds,
      date: new Date().toISOString(),
      puzzleId: puzzle.id,
    };
    const next = [entry, ...leaderboard]
      .sort((a, b) => a.seconds - b.seconds)
      .slice(0, 50);
    setLeaderboard(next);
    await saveJSON(STORAGE_KEYS.LEADERBOARD, next);
  };

  useEffect(() => {
    if (!isSolved) return;
    setTimerRunning(false);
    if (!hasSavedWin) {
      setHasSavedWin(true);
      addScore(elapsed);
      Alert.alert("Bravo!", `Riješeno\nVrijeme: ${formatTime(elapsed)}`);
    }
  }, [isSolved]);

  const bestTime = useMemo(
    () => (leaderboard.length ? leaderboard[0].seconds : null),
    [leaderboard],
  );

  const clearLeaderboard = async () => {
    setLeaderboard([]);
    await AsyncStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
  };

  return {
    gridSize,
    cellSize,

    puzzle,
    fixed,
    conflicts,

    board,
    setBoard,

    selected,
    setSelected,

    elapsed,
    timerRunning,

    playerName,
    nameDraft,
    setNameDraft,
    showNameModal,
    setShowNameModal,

    leaderboard,
    showLeaderboard,
    setShowLeaderboard,

    startNewGame,
    resetGame,
    inputNumber,
    erase,
    hint,
    check,

    saveName,
    cancelNameModal,

    clearLeaderboard,

    bestTime,
    formatTime,
  };
}
