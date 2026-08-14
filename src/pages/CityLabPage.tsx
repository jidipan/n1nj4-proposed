import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/useLanguage";
import { createSeededCommonsLayout } from "../features/city-lab/domain/plot-allocation";
import { getFloorProgress, scoreToFloors } from "../features/city-lab/domain/progression";
import type {
  Builder,
  ContributionEvent,
  GrowthAnimation,
} from "../features/city-lab/domain/types";
import { DEMO_EVENTS, INITIAL_BUILDERS } from "../features/city-lab/data/demo-data";
import "./CityLabPage.css";

const ThreeCityView = lazy(
  () => import("../features/city-lab/renderers/three/ThreeCityView"),
);

type EventLogItem = ContributionEvent & {
  resultingScore: number;
  createdFloor: boolean;
};

function copyBuilders(builders: Builder[]): Builder[] {
  return builders.map((builder) => ({ ...builder }));
}

export default function CityLabPage() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryString = searchParams.toString();
  const isZh = language === "zh";
  const [builders, setBuilders] = useState(() => copyBuilders(INITIAL_BUILDERS));
  const buildersRef = useRef(builders);
  const [selectedBuilderId, setSelectedBuilderId] = useState<string>(INITIAL_BUILDERS[0].id);
  const [growth, setGrowth] = useState<GrowthAnimation | null>(null);
  const [eventLog, setEventLog] = useState<EventLogItem[]>([]);
  const [activeEvent, setActiveEvent] = useState<EventLogItem | null>(null);
  const [demoRun, setDemoRun] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [readyTime, setReadyTime] = useState<number | null>(null);
  const viewStartedAtRef = useRef(performance.now());
  const growthTokenRef = useRef(0);

  useEffect(() => {
    const nextSearchParams = new URLSearchParams(queryString);
    if (!nextSearchParams.has("view")) return;

    nextSearchParams.delete("view");
    setSearchParams(nextSearchParams, { replace: true });
  }, [queryString, setSearchParams]);

  const cityLayout = useMemo(() => createSeededCommonsLayout(builders), [builders]);
  const { buildings, communities, neighborhood, plots, stadium } = cityLayout;
  const vacantPlotCount = plots.length - buildings.length;
  const selectedBuilder =
    builders.find((builder) => builder.id === selectedBuilderId) ?? builders[0];
  const selectedBuilding = buildings.find(
    (building) => building.builder.id === selectedBuilder.id,
  );
  const selectedCommunity = communities.find(
    (community) => community.id === selectedBuilding?.plot.communityId,
  );
  const selectedProgress = getFloorProgress(selectedBuilder.score);

  const handleReady = useCallback(() => {
    const elapsed = Math.round(performance.now() - viewStartedAtRef.current);
    setReadyTime(elapsed);
  }, []);

  const replayDemo = useCallback(() => {
    const resetBuilders = copyBuilders(INITIAL_BUILDERS);
    buildersRef.current = resetBuilders;
    setBuilders(resetBuilders);
    setEventLog([]);
    setActiveEvent(null);
    setGrowth(null);
    setIsPlaying(true);
    setDemoRun((run) => run + 1);
  }, []);

  useEffect(() => {
    if (demoRun === 0) return;
    let cancelled = false;
    let eventIndex = 0;
    let timer = 0;

    const runNextEvent = () => {
      if (cancelled || eventIndex >= DEMO_EVENTS.length) {
        if (!cancelled) setIsPlaying(false);
        return;
      }

      const event = DEMO_EVENTS[eventIndex];
      const currentBuilder = buildersRef.current.find(
        (builder) => builder.id === event.builderId,
      );
      if (!currentBuilder) return;

      const fromFloors = scoreToFloors(currentBuilder.score);
      const resultingScore = currentBuilder.score + event.points;
      const toFloors = scoreToFloors(resultingScore);
      const nextBuilders = buildersRef.current.map((builder) =>
        builder.id === event.builderId
          ? { ...builder, score: resultingScore, status: "active" as const }
          : builder,
      );
      const logItem: EventLogItem = {
        ...event,
        resultingScore,
        createdFloor: toFloors > fromFloors,
      };

      buildersRef.current = nextBuilders;
      setBuilders(nextBuilders);
      setSelectedBuilderId(event.builderId);
      setActiveEvent(logItem);
      setEventLog((current) => [logItem, ...current]);
      growthTokenRef.current += 1;
      setGrowth({
        token: growthTokenRef.current,
        builderId: event.builderId,
        fromFloors,
        toFloors,
      });

      eventIndex += 1;
      timer = window.setTimeout(runNextEvent, 2200);
    };

    timer = window.setTimeout(runNextEvent, 700);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [demoRun]);

  const sharedViewProps = {
    buildings,
    plots,
    communities,
    stadium,
    selectedBuilderId,
    growth,
    onSelectBuilder: setSelectedBuilderId,
    onReady: handleReady,
  };

  return (
    <div className="city-lab-page">
      <section className="city-lab-workspace">
        <div className="city-lab-stage-shell">
          <div className="city-lab-stage-meta">
            <span>{neighborhood.name}</span>
            <span>{neighborhood.blockIds.length}/9 BLOCKS OPEN</span>
            <span>{buildings.length} BUILDERS · {vacantPlotCount} VACANT PLOTS</span>
            <span>2 ACTIVE ROAD LEVELS</span>
            <span>LIVE CITY STATE</span>
            {readyTime !== null && <span>3D READY {readyTime}MS</span>}
          </div>

          <Suspense
            fallback={
              <div className="city-lab-loading">
                <span />
                {isZh ? "正在初始化城市渲染器…" : "Initialising city renderer…"}
              </div>
            }
          >
            <ThreeCityView {...sharedViewProps} />
          </Suspense>
        </div>

        <aside className="city-lab-builder-panel">
          <div className="city-lab-panel-heading">
            <div>
              <span className="city-lab-panel-eyebrow">SELECTED BUILDER</span>
              <h2>{selectedBuilder.displayName}</h2>
              <p>@{selectedBuilder.handle}</p>
            </div>
            <span
              className={`city-lab-status city-lab-status--${selectedBuilder.status}`}
            >
              {selectedBuilder.status}
            </span>
          </div>

          <div className="city-lab-score-card">
            <div>
              <span>{isZh ? "贡献积分" : "Contribution score"}</span>
              <strong>{selectedBuilder.score}</strong>
            </div>
            <div>
              <span>{isZh ? "建筑高度" : "Building height"}</span>
              <strong>{selectedProgress.floors}F</strong>
            </div>
          </div>

          <div className="city-lab-progress-block">
            <div>
              <span>{isZh ? "下一层进度" : "Next floor"}</span>
              <span>
                {selectedProgress.nextThreshold === null
                  ? "MAX LEVEL"
                  : `${selectedProgress.pointsToNext} PTS TO GO`}
              </span>
            </div>
            <div className="city-lab-progress-track">
              <span style={{ width: `${selectedProgress.progress * 100}%` }} />
            </div>
          </div>

          <div className="city-lab-specialty">
            <span>{isZh ? "建设领域" : "Builder focus"}</span>
            <strong>{selectedBuilder.specialty}</strong>
          </div>

          {selectedCommunity && (
            <div className="city-lab-specialty">
              <span>{isZh ? "街区公园" : "Block park"}</span>
              <strong>
                {selectedCommunity.name} · LV{selectedCommunity.level}
              </strong>
            </div>
          )}

          <div className="city-lab-builder-list">
            <span className="city-lab-panel-eyebrow">CITY DIRECTORY</span>
            <div>
              {buildings.map(({ builder, floors }) => (
                <button
                  key={builder.id}
                  type="button"
                  className={builder.id === selectedBuilder.id ? "active" : ""}
                  onClick={() => setSelectedBuilderId(builder.id)}
                >
                  <i style={{ background: `#${builder.accentColor.toString(16).padStart(6, "0")}` }} />
                  <span>{builder.displayName}</span>
                  <b>{floors}F</b>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="city-lab-event-console">
        <div className="city-lab-event-intro">
          <span className="city-lab-panel-eyebrow">CONTRIBUTION EVENT REPLAY</span>
          <h2>{isZh ? "让贡献数据驱动一座 3D 城市" : "One event stream, one living 3D city"}</h2>
          <p>
            {isZh
              ? "重播会恢复初始积分，并按顺序模拟四次已验证贡献。跨过积分阈值的建筑将新增楼层。"
              : "Replay restores the baseline and simulates four verified contributions. Buildings gain a floor when score crosses a threshold."}
          </p>
          <button type="button" onClick={replayDemo} disabled={isPlaying}>
            {isPlaying ? (isZh ? "正在重播…" : "REPLAYING…") : "REPLAY DEMO"}
          </button>
        </div>

        <div className={`city-lab-active-event ${activeEvent ? "is-live" : ""}`}>
          <span>{activeEvent ? "LIVE CITY EVENT" : "WAITING FOR EVENT"}</span>
          {activeEvent ? (
            <>
              <h3>{activeEvent.projectName}</h3>
              <p>{activeEvent.description}</p>
              <div>
                <strong>+{activeEvent.points} PTS</strong>
                <span>{activeEvent.createdFloor ? "NEW FLOOR BUILT" : "PROGRESS UPDATED"}</span>
              </div>
            </>
          ) : (
            <p>{isZh ? "点击 Replay Demo 开始城市生长测试。" : "Start Replay Demo to test city growth."}</p>
          )}
        </div>

        <div className="city-lab-event-log">
          <span className="city-lab-panel-eyebrow">EVENT LOG</span>
          {eventLog.length === 0 ? (
            <p className="city-lab-event-empty">NO EVENTS YET</p>
          ) : (
            eventLog.map((event) => {
              const builder = builders.find((item) => item.id === event.builderId);
              return (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => setSelectedBuilderId(event.builderId)}
                >
                  <span>{builder?.displayName}</span>
                  <strong>+{event.points}</strong>
                  <small>{event.createdFloor ? "↑ FLOOR" : `${event.resultingScore} PTS`}</small>
                </button>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
