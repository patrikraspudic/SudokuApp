import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEYS = {
  PLAYER_NAME: "sudoku_player_name",
  LEADERBOARD: "sudoku_leaderboard",
};

export async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function saveJSON(key: string, value: unknown) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {}
}
