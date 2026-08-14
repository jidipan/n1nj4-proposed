import { scoreToFloors } from "./progression";
import type { Builder, CityCommunity, CityLayout, CityPlot } from "./types";

export const CITY_SEED = "city-zero-alpha-01";
export const COMMUNITY_CAPACITY = 8;

const BUILDING_SIZE = 2.18;
const PLOT_PITCH = 3;
const BLOCK_STREET_HALF_WIDTH = 1.2;

export const CITY_SPATIAL_RULES = {
  metersPerUnit: 7,
  gridSize: 3,
  buildingSize: BUILDING_SIZE,
  plotPitch: PLOT_PITCH,
  plotEdgeReserve: (PLOT_PITCH - BUILDING_SIZE) / 2,
  plotLaneWidth: PLOT_PITCH - BUILDING_SIZE,
  blockStreetHalfWidth: BLOCK_STREET_HALF_WIDTH,
  blockStreetWidth: BLOCK_STREET_HALF_WIDTH * 2,
  districtAvenueWidth: 4.5,
} as const;

export const CITY_BLOCK_SIZE =
  CITY_SPATIAL_RULES.gridSize * CITY_SPATIAL_RULES.plotPitch;
const BLOCK_DISTANCE = CITY_BLOCK_SIZE + CITY_SPATIAL_RULES.blockStreetWidth;
const NEIGHBORHOOD_ZERO_BLOCK_SLOTS = [
  { gx: -BLOCK_DISTANCE, gy: -BLOCK_DISTANCE },
  { gx: 0, gy: -BLOCK_DISTANCE },
  { gx: BLOCK_DISTANCE, gy: -BLOCK_DISTANCE },
  { gx: BLOCK_DISTANCE, gy: 0 },
  { gx: BLOCK_DISTANCE, gy: BLOCK_DISTANCE },
  { gx: 0, gy: BLOCK_DISTANCE },
  { gx: -BLOCK_DISTANCE, gy: BLOCK_DISTANCE },
  { gx: -BLOCK_DISTANCE, gy: 0 },
] as const;
const COMMUNITY_THEMES = [
  { name: "Ember Park", accentColor: 0xe66f51 },
  { name: "Tide Park", accentColor: 0x397f9d },
  { name: "Canopy Park", accentColor: 0x6f9857 },
  { name: "Volt Park", accentColor: 0x9a71bd },
  { name: "Forge Park", accentColor: 0xc78a3f },
  { name: "Harbor Park", accentColor: 0x4a91a8 },
  { name: "Signal Park", accentColor: 0xc45f82 },
  { name: "Grove Park", accentColor: 0x718c52 },
] as const;
const SLOT_OFFSETS = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
] as const;
const COMMONS_THRESHOLDS = [0, 900, 1800, 3000, 4500] as const;

export const CITY_STADIUM = {
  id: "city-zero-stadium",
  name: "City Zero Stadium",
  gx: 0,
  gy: 0,
  size: CITY_BLOCK_SIZE,
  accentColor: 0xef806d,
} as const;

function stableHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function rotateOffset(x: number, y: number, quarterTurns: number): [number, number] {
  switch (quarterTurns % 4) {
    case 1:
      return [-y, x];
    case 2:
      return [-x, -y];
    case 3:
      return [y, -x];
    default:
      return [x, y];
  }
}

function getCommonsState(members: Builder[]) {
  const activeBuilderCount = members.filter((builder) => builder.status === "active").length;
  const cappedContribution = members.reduce(
    (total, builder) => total + Math.min(builder.score, 400),
    0,
  );
  const commonsScore = cappedContribution + activeBuilderCount * 100;
  let level = 1;

  for (let index = 1; index < COMMONS_THRESHOLDS.length; index += 1) {
    if (commonsScore >= COMMONS_THRESHOLDS[index]) level = index + 1;
  }

  const currentThreshold = COMMONS_THRESHOLDS[level - 1];
  const nextThreshold = COMMONS_THRESHOLDS[level];
  const progress = nextThreshold
    ? Math.min(1, (commonsScore - currentThreshold) / (nextThreshold - currentThreshold))
    : 1;

  return { activeBuilderCount, level, progress };
}

export function createSeededCommonsLayout(builders: Builder[]): CityLayout {
  const random = seededRandom(stableHash(CITY_SEED));
  const plotGroups: CityPlot[][] = [];
  const blockSlots = shuffled(NEIGHBORHOOD_ZERO_BLOCK_SLOTS, random);
  const communityBases = blockSlots
    .map((anchor, communityIndex) => {
      const theme = COMMUNITY_THEMES[communityIndex % COMMUNITY_THEMES.length];
      const quarterTurns = Math.floor(random() * 4);
      const gx = anchor.gx;
      const gy = anchor.gy;
      const communityId = `neighbourhood-zero-block-${communityIndex + 1}`;
      const plots = SLOT_OFFSETS.map(([x, y], slot) => {
        const [rotatedX, rotatedY] = rotateOffset(x, y, quarterTurns);
        return {
          id: `${communityId}-plot-${slot + 1}`,
          communityId,
          slot,
          gx: gx + rotatedX * CITY_SPATIAL_RULES.plotPitch,
          gy: gy + rotatedY * CITY_SPATIAL_RULES.plotPitch,
        };
      });
      plotGroups.push(plots);

      return {
        id: communityId,
        name: theme.name,
        gx,
        gy,
        accentColor: theme.accentColor,
      };
    });

  const capacity = communityBases.length * COMMUNITY_CAPACITY;
  const residents = shuffled(builders.slice(0, capacity), random);
  const blockOrder = shuffled(
    communityBases.map((_, index) => index),
    random,
  );
  const availablePlots = plotGroups.map((plots) => shuffled(plots, random));
  const nextPlotIndexByBlock = communityBases.map(() => 0);
  const buildings = residents.map((builder, index) => {
    const blockIndex = blockOrder[index % blockOrder.length];
    const plotIndex = nextPlotIndexByBlock[blockIndex];
    nextPlotIndexByBlock[blockIndex] += 1;

    return {
      builder,
      plot: availablePlots[blockIndex][plotIndex],
      floors: scoreToFloors(builder.score),
    };
  });

  const communities: CityCommunity[] = communityBases.map((community) => {
    const members = buildings
      .filter((building) => building.plot.communityId === community.id)
      .map((building) => building.builder);
    const state = getCommonsState(members);

    return {
      ...community,
      ...state,
      memberCount: members.length,
      capacity: COMMUNITY_CAPACITY,
    };
  });

  return {
    buildings,
    plots: plotGroups.flat(),
    communities,
    stadium: CITY_STADIUM,
    neighborhood: {
      id: "neighbourhood-zero",
      name: "Neighbourhood Zero",
      districtId: "district-zero",
      gx: 0,
      gy: 0,
      gridSize: 3,
      blockIds: [CITY_STADIUM.id, ...communities.map((community) => community.id)],
      stadiumBlockId: CITY_STADIUM.id,
    },
  };
}
