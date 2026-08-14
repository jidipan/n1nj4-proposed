const FLOOR_THRESHOLDS = [0, 50, 150, 300, 500, 750, 1100, 1500] as const;

export const MAX_FLOORS = FLOOR_THRESHOLDS.length;

export function scoreToFloors(score: number): number {
  const safeScore = Math.max(0, score);
  let floors = 1;

  for (let index = 1; index < FLOOR_THRESHOLDS.length; index += 1) {
    if (safeScore >= FLOOR_THRESHOLDS[index]) floors = index + 1;
  }

  return floors;
}

export function getFloorProgress(score: number) {
  const floors = scoreToFloors(score);
  const currentThreshold = FLOOR_THRESHOLDS[floors - 1];
  const nextThreshold = FLOOR_THRESHOLDS[floors];

  if (nextThreshold === undefined) {
    return {
      floors,
      currentThreshold,
      nextThreshold: null,
      pointsToNext: 0,
      progress: 1,
    };
  }

  const progress =
    (Math.max(score, currentThreshold) - currentThreshold) /
    (nextThreshold - currentThreshold);

  return {
    floors,
    currentThreshold,
    nextThreshold,
    pointsToNext: Math.max(0, nextThreshold - score),
    progress: Math.min(1, Math.max(0, progress)),
  };
}
