export type BuilderStatus = "active" | "dormant";

export type Builder = {
  id: string;
  displayName: string;
  handle: string;
  score: number;
  status: BuilderStatus;
  accentColor: number;
  specialty: string;
};

export type ContributionEvent = {
  id: string;
  builderId: string;
  projectName: string;
  description: string;
  points: number;
};

export type CityPlot = {
  id: string;
  communityId: string;
  slot: number;
  gx: number;
  gy: number;
};

export type CityCommunity = {
  id: string;
  name: string;
  gx: number;
  gy: number;
  accentColor: number;
  level: number;
  progress: number;
  memberCount: number;
  activeBuilderCount: number;
  capacity: number;
};

export type CityStadium = {
  id: string;
  name: string;
  gx: number;
  gy: number;
  size: number;
  accentColor: number;
};

export type CityBuilding = {
  builder: Builder;
  plot: CityPlot;
  floors: number;
};

export type CityLayout = {
  buildings: CityBuilding[];
  plots: CityPlot[];
  communities: CityCommunity[];
  stadium: CityStadium;
  neighborhood: CityNeighborhood;
};

export type CityNeighborhood = {
  id: string;
  name: string;
  districtId: string;
  gx: number;
  gy: number;
  gridSize: number;
  blockIds: string[];
  stadiumBlockId: string;
};

export type GrowthAnimation = {
  token: number;
  builderId: string;
  fromFloors: number;
  toFloors: number;
};

export type CityViewProps = {
  buildings: CityBuilding[];
  plots: CityPlot[];
  communities: CityCommunity[];
  stadium: CityStadium;
  selectedBuilderId: string | null;
  growth: GrowthAnimation | null;
  onSelectBuilder: (builderId: string) => void;
  onReady?: () => void;
};
