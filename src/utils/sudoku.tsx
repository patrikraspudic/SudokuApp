export const idx = (r: number, c: number) => r * 9 + c;

export function getConflictSet(board: number[]) {
  const conflicts = new Set<number>();

  const markDup = (indices: number[]) => {
    const map = new Map<number, number[]>();
    for (const i of indices) {
      const v = board[i];
      if (!v) continue;
      if (!map.has(v)) map.set(v, []);
      map.get(v)!.push(i);
    }
    for (const arr of map.values()) {
      if (arr.length > 1) arr.forEach((i) => conflicts.add(i));
    }
  };

  for (let r = 0; r < 9; r++) {
    const inds: number[] = [];
    for (let c = 0; c < 9; c++) inds.push(idx(r, c));
    markDup(inds);
  }

  for (let c = 0; c < 9; c++) {
    const inds: number[] = [];
    for (let r = 0; r < 9; r++) inds.push(idx(r, c));
    markDup(inds);
  }

  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      const inds: number[] = [];
      for (let r = br * 3; r < br * 3 + 3; r++) {
        for (let c = bc * 3; c < bc * 3 + 3; c++) inds.push(idx(r, c));
      }
      markDup(inds);
    }
  }

  return conflicts;
}
