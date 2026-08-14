import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  CITY_BLOCK_SIZE,
  CITY_SPATIAL_RULES,
} from "../../domain/plot-allocation";
import type {
  CityBuilding,
  CityCommunity,
  CityStadium,
  CityViewProps,
  GrowthAnimation,
} from "../../domain/types";

const FLOOR_HEIGHT = 0.78;
const BUILDING_SIZE = CITY_SPATIAL_RULES.buildingSize;
const PLOT_SURFACE_SIZE = CITY_SPATIAL_RULES.plotPitch - 0.08;
const STADIUM_MODEL_SCALE = 1.3;
const CAMERA_MIN_ZOOM = 23;
const CAMERA_MAX_ZOOM = 60;
const CAMERA_DEFAULT_ZOOM = 30;
const CAMERA_ZOOM_STEP = 1;
const NEIGHBORHOOD_ZERO_HALF_EXTENT =
  (CITY_BLOCK_SIZE + CITY_SPATIAL_RULES.blockStreetWidth) * 1.5;
const NEIGHBORHOOD_GROUND_SIZE = NEIGHBORHOOD_ZERO_HALF_EXTENT * 2;
const NEIGHBORHOOD_GROUND_GAP = 0.34;
const SURROUNDING_NEIGHBORHOOD_SLOTS = [
  { id: "north-west", number: 2, dx: -1, dz: -1, color: 0x93a876, reserveType: "hills" },
  { id: "north", number: 1, dx: 0, dz: -1, color: 0x73936d, reserveType: "forest" },
  { id: "north-east", number: 8, dx: 1, dz: -1, color: 0xa7b77f, reserveType: "meadow" },
  { id: "east", number: 7, dx: 1, dz: 0, color: 0x4f91a1, reserveType: "open-water" },
  { id: "south-east", number: 6, dx: 1, dz: 1, color: 0xb7a876, reserveType: "farmland" },
  { id: "south", number: 5, dx: 0, dz: 1, color: 0x9cb38d, reserveType: "rain-garden" },
  { id: "south-west", number: 4, dx: -1, dz: 1, color: 0x91a873, reserveType: "orchard" },
  { id: "west", number: 3, dx: -1, dz: 0, color: 0x83a795, reserveType: "wetland" },
] as const;

type ReserveType = (typeof SURROUNDING_NEIGHBORHOOD_SLOTS)[number]["reserveType"];

type BuildingAnimation = {
  from: number;
  to: number;
  startedAt: number;
  duration: number;
};

function floorHeight(floors: number) {
  return Math.max(0.85, floors) * FLOOR_HEIGHT;
}

function CameraRig({
  zoom,
  verticalContentHeight,
  onZoomChange,
}: {
  zoom: number;
  verticalContentHeight: number;
  onZoomChange: (zoom: number) => void;
}) {
  const { camera, gl, size, invalidate } = useThree();
  const controlsRef = useRef<OrbitControls | null>(null);
  const homeTargetRef = useRef(new THREE.Vector3());
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!(camera instanceof THREE.OrthographicCamera)) return;

    const controls = new OrbitControls(camera, gl.domElement);
    controlsRef.current = controls;
    controls.enableRotate = false;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.screenSpacePanning = false;
    controls.zoomToCursor = true;
    controls.minZoom = CAMERA_MIN_ZOOM;
    controls.maxZoom = CAMERA_MAX_ZOOM;
    controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
    controls.mouseButtons.MIDDLE = THREE.MOUSE.DOLLY;
    controls.mouseButtons.RIGHT = THREE.MOUSE.PAN;
    controls.touches.ONE = THREE.TOUCH.PAN;
    controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;

    let isClamping = false;
    const handleChange = () => {
      if (isClamping) return;

      camera.updateMatrixWorld();
      const matrix = camera.matrixWorld.elements;
      const rightX = matrix[0];
      const rightZ = matrix[2];
      const upX = matrix[4];
      const upY = matrix[5];
      const upZ = matrix[6];
      const unlockedHalfWidth =
        NEIGHBORHOOD_ZERO_HALF_EXTENT * (Math.abs(rightX) + Math.abs(rightZ));
      const unlockedHalfHeight =
        NEIGHBORHOOD_ZERO_HALF_EXTENT * (Math.abs(upX) + Math.abs(upZ));
      const viewportHalfWidth =
        (camera.right - camera.left) / (2 * camera.zoom);
      const viewportHalfHeight =
        (camera.top - camera.bottom) / (2 * camera.zoom);
      const horizontalEdgeA = -unlockedHalfWidth + viewportHalfWidth;
      const horizontalEdgeB = unlockedHalfWidth - viewportHalfWidth;
      const minScreenPanX = Math.min(horizontalEdgeA, horizontalEdgeB);
      const maxScreenPanX = Math.max(horizontalEdgeA, horizontalEdgeB);
      const zoomExpansionProgress = THREE.MathUtils.clamp(
        (camera.zoom - CAMERA_MIN_ZOOM) / (CAMERA_MAX_ZOOM - CAMERA_MIN_ZOOM),
        0,
        1,
      );
      const buildingTopClearance =
        verticalContentHeight * Math.abs(upY) * zoomExpansionProgress;
      const verticalEdgeA = -unlockedHalfHeight + viewportHalfHeight;
      const verticalEdgeB =
        unlockedHalfHeight + buildingTopClearance - viewportHalfHeight;
      const minScreenPanY = Math.min(verticalEdgeA, verticalEdgeB);
      const maxScreenPanY = Math.max(verticalEdgeA, verticalEdgeB);
      const targetScreenX = controls.target.x * rightX + controls.target.z * rightZ;
      const targetScreenY = controls.target.x * upX + controls.target.z * upZ;
      const clampedScreenX = THREE.MathUtils.clamp(
        targetScreenX,
        minScreenPanX,
        maxScreenPanX,
      );
      const clampedScreenY = THREE.MathUtils.clamp(
        targetScreenY,
        minScreenPanY,
        maxScreenPanY,
      );
      const determinant = rightX * upZ - rightZ * upX;
      const clampedOffsetX =
        (clampedScreenX * upZ - rightZ * clampedScreenY) / determinant;
      const clampedOffsetZ =
        (rightX * clampedScreenY - clampedScreenX * upX) / determinant;
      const clampedTarget = new THREE.Vector3(
        clampedOffsetX,
        0,
        clampedOffsetZ,
      );
      const correction = clampedTarget.sub(controls.target);

      if (correction.lengthSq() > 0.000001) {
        isClamping = true;
        controls.target.add(correction);
        camera.position.add(correction);
        controls.update();
        isClamping = false;
      }

      onZoomChange(Math.round(camera.zoom * 10) / 10);
      invalidate();
    };
    const handleStart = () => {
      gl.domElement.style.cursor = "grabbing";
    };
    const handleEnd = () => {
      gl.domElement.style.cursor = "grab";
    };

    controls.addEventListener("change", handleChange);
    controls.addEventListener("start", handleStart);
    controls.addEventListener("end", handleEnd);
    gl.domElement.style.cursor = "grab";

    return () => {
      controls.removeEventListener("change", handleChange);
      controls.removeEventListener("start", handleStart);
      controls.removeEventListener("end", handleEnd);
      controls.dispose();
      controlsRef.current = null;
      gl.domElement.style.cursor = "";
    };
  }, [camera, gl, invalidate, onZoomChange, verticalContentHeight]);

  useEffect(() => {
    if (!(camera instanceof THREE.OrthographicCamera)) return;

    const compositionOffset = size.width > 860 ? 7 : 0;
    camera.position.set(14 + compositionOffset, 16, 14 - compositionOffset);
    homeTargetRef.current.set(compositionOffset, 0, -compositionOffset);
    controlsRef.current?.target.copy(homeTargetRef.current);
    camera.lookAt(homeTargetRef.current);
    if (!initializedRef.current) {
      camera.zoom = CAMERA_DEFAULT_ZOOM;
      initializedRef.current = true;
    }
    camera.updateProjectionMatrix();
    controlsRef.current?.update();
    invalidate();
  }, [camera, invalidate, size.height, size.width]);

  useEffect(() => {
    if (!(camera instanceof THREE.OrthographicCamera)) return;

    camera.zoom = THREE.MathUtils.clamp(zoom, CAMERA_MIN_ZOOM, CAMERA_MAX_ZOOM);
    camera.updateProjectionMatrix();
    controlsRef.current?.update();
    invalidate();
  }, [camera, invalidate, zoom]);

  return null;
}

function ReadySignal({ onReady }: Pick<CityViewProps, "onReady">) {
  useEffect(() => {
    const frame = requestAnimationFrame(() => onReady?.());
    return () => cancelAnimationFrame(frame);
  }, [onReady]);

  return null;
}

function ReserveTree({
  x,
  z,
  scale = 1,
  color = 0x4f7950,
}: {
  x: number;
  z: number;
  scale?: number;
  color?: number;
}) {
  return (
    <group position={[x, -0.04, z]} scale={scale}>
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.1, 0.14, 0.68, 7]} />
        <meshStandardMaterial color={0x6e5139} roughness={0.98} />
      </mesh>
      <mesh position={[0, 0.94, 0]}>
        <dodecahedronGeometry args={[0.52, 0]} />
        <meshStandardMaterial color={color} roughness={0.96} />
      </mesh>
    </group>
  );
}

function ReserveNeighbourhoodLabel({
  number,
  dx,
  dz,
}: {
  number: number;
  dx: number;
  dz: number;
}) {
  const { gl } = useThree();
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (!context) return null;

    context.textAlign = "center";
    context.textBaseline = "middle";
    context.lineJoin = "round";
    context.font = "800 68px Arial, sans-serif";
    context.strokeStyle = "rgba(255, 248, 226, 0.16)";
    context.lineWidth = 5;
    context.fillStyle = "rgba(38, 47, 42, 0.32)";
    const label = `NEIGHBOURHOOD ${number}`;
    context.strokeText(label, 512, 105);
    context.fillText(label, 512, 105);
    context.beginPath();
    context.moveTo(178, 176);
    context.lineTo(846, 176);
    context.strokeStyle = "rgba(43, 53, 47, 0.12)";
    context.lineWidth = 3;
    context.stroke();

    const labelTexture = new THREE.CanvasTexture(canvas);
    labelTexture.colorSpace = THREE.SRGBColorSpace;
    labelTexture.generateMipmaps = true;
    labelTexture.minFilter = THREE.LinearMipmapLinearFilter;
    labelTexture.magFilter = THREE.LinearFilter;
    labelTexture.anisotropy = gl.capabilities.getMaxAnisotropy();
    labelTexture.needsUpdate = true;
    return labelTexture;
  }, [gl, number]);

  useEffect(
    () => () => {
      texture?.dispose();
    },
    [texture],
  );

  if (!texture) return null;

  const isDiagonal = dx !== 0 && dz !== 0;
  const innerDistance = isDiagonal
    ? NEIGHBORHOOD_ZERO_HALF_EXTENT - 4.8
    : NEIGHBORHOOD_ZERO_HALF_EXTENT - 2.1;

  return (
    <group
      position={[-dx * innerDistance, 0.018, -dz * innerDistance]}
      rotation={[0, Math.PI / 2, 0]}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={3}>
        <planeGeometry args={[10.5, 2.6]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.62}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function ReserveLandscape({ type }: { type: ReserveType }) {
  if (type === "forest") {
    return (
      <group>
        {Array.from({ length: 24 }, (_, index) => {
          const column = index % 6;
          const row = Math.floor(index / 6);
          return (
            <ReserveTree
              key={`forest-tree-${index}`}
              x={-12.5 + column * 5 + (row % 2) * 0.8}
              z={-8.2 + row * 5.4 + (column % 2) * 0.55}
              scale={1.15 + (index % 3) * 0.16}
              color={index % 2 === 0 ? 0x355f45 : 0x4c7650}
            />
          );
        })}
      </group>
    );
  }

  if (type === "wetland") {
    const pools = [
      { x: -7.5, z: -3.5, sx: 1.65, sz: 0.82 },
      { x: 5.2, z: 5.8, sx: 1.25, sz: 0.72 },
      { x: 6.5, z: -8.2, sx: 0.95, sz: 0.62 },
    ];
    return (
      <group>
        {pools.map((pool, index) => (
          <mesh
            key={`wetland-pool-${index}`}
            rotation={[-Math.PI / 2, 0, index * 0.42]}
            position={[pool.x, -0.065, pool.z]}
            scale={[pool.sx, pool.sz, 1]}
          >
            <circleGeometry args={[4.2, 32]} />
            <meshStandardMaterial color={0x5e9ca0} roughness={0.42} metalness={0.03} />
          </mesh>
        ))}
        {Array.from({ length: 20 }, (_, index) => {
          const angle = index * 2.17;
          const radius = 5.5 + (index % 4) * 2.2;
          return (
            <mesh
              key={`wetland-reed-${index}`}
              position={[Math.cos(angle) * radius, 0.18, Math.sin(angle) * radius]}
            >
              <coneGeometry args={[0.13, 0.48 + (index % 3) * 0.1, 5]} />
              <meshStandardMaterial color={index % 2 === 0 ? 0x6e8852 : 0x8a9561} />
            </mesh>
          );
        })}
      </group>
    );
  }

  if (type === "open-water") {
    return (
      <group>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.064, 0]}>
          <planeGeometry
            args={[
              NEIGHBORHOOD_GROUND_SIZE - NEIGHBORHOOD_GROUND_GAP - 0.18,
              NEIGHBORHOOD_GROUND_SIZE - NEIGHBORHOOD_GROUND_GAP - 0.18,
            ]}
          />
          <meshPhysicalMaterial
            color={0x5798a8}
            roughness={0.3}
            metalness={0.04}
            clearcoat={0.22}
            clearcoatRoughness={0.42}
          />
        </mesh>
        {Array.from({ length: 9 }, (_, index) => (
          <mesh
            key={`water-ripple-${index}`}
            rotation={[
              -Math.PI / 2,
              0,
              (index % 2 === 0 ? -1 : 1) * 0.08,
            ]}
            position={[
              -8.5 + (index % 3) * 8.5,
              -0.046,
              -10.5 + Math.floor(index / 3) * 10.5,
            ]}
          >
            <planeGeometry args={[5.8 + (index % 3) * 0.9, 0.1]} />
            <meshBasicMaterial
              color={0xb8d8d7}
              transparent
              opacity={0.26}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    );
  }

  if (type === "rain-garden") {
    const basins = [
      { x: -7, z: -5, scale: 1.15 },
      { x: 6.5, z: 5.8, scale: 0.9 },
      { x: 2.5, z: -7.8, scale: 0.65 },
    ];
    return (
      <group>
        {basins.map((basin, index) => (
          <group key={`rain-basin-${index}`} position={[basin.x, 0, basin.z]}>
            <mesh
              rotation={[-Math.PI / 2, 0, index * 0.35]}
              position={[0, -0.065, 0]}
              scale={[1.5 * basin.scale, basin.scale, 1]}
            >
              <circleGeometry args={[3.6, 28]} />
              <meshStandardMaterial color={0x6ea4a0} roughness={0.5} />
            </mesh>
            {Array.from({ length: 7 }, (_, plantIndex) => {
              const angle = (plantIndex / 7) * Math.PI * 2;
              return (
                <mesh
                  key={`rain-plant-${plantIndex}`}
                  position={[
                    Math.cos(angle) * 4.3 * basin.scale,
                    0.16,
                    Math.sin(angle) * 3.2 * basin.scale,
                  ]}
                >
                  <dodecahedronGeometry args={[0.22 + (plantIndex % 2) * 0.08, 0]} />
                  <meshStandardMaterial color={plantIndex % 2 ? 0x5f8b55 : 0x7aa064} />
                </mesh>
              );
            })}
          </group>
        ))}
      </group>
    );
  }

  if (type === "farmland") {
    const fields = [
      { x: -7.2, z: -9.3, width: 12.6, depth: 7.8, color: 0x8f8f59 },
      { x: 7.1, z: -9.2, width: 12.4, depth: 8.0, color: 0xa89b5f },
      { x: -7.25, z: 0.15, width: 12.5, depth: 8.55, color: 0x9b8759 },
      { x: 7.15, z: 0.25, width: 12.45, depth: 8.45, color: 0x7f8e58 },
      { x: -7.2, z: 9.85, width: 12.55, depth: 8.25, color: 0xa58c57 },
      { x: 7.05, z: 9.8, width: 12.45, depth: 8.3, color: 0x87945d },
    ];

    return (
      <group>
        {fields.map((field, index) => (
          <mesh
            key={`simple-farm-field-${index}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[field.x, -0.058, field.z]}
          >
            <planeGeometry args={[field.width, field.depth]} />
            <meshStandardMaterial color={field.color} roughness={0.99} />
          </mesh>
        ))}
      </group>
    );
  }

  if (type === "orchard") {
    return (
      <group>
        {Array.from({ length: 20 }, (_, index) => {
          const column = index % 5;
          const row = Math.floor(index / 5);
          return (
            <ReserveTree
              key={`orchard-tree-${index}`}
              x={-11 + column * 5.5}
              z={-8.2 + row * 5.5}
              scale={0.82}
              color={index % 2 === 0 ? 0x66834a : 0x7d914d}
            />
          );
        })}
      </group>
    );
  }

  if (type === "meadow") {
    const flowerColors = [0xe6c26e, 0xd9868a, 0xb596ce, 0xf0df9a];
    return (
      <group>
        {Array.from({ length: 44 }, (_, index) => {
          const column = index % 11;
          const row = Math.floor(index / 11);
          return (
            <mesh
              key={`meadow-flower-${index}`}
              position={[
                -13.5 + column * 2.7 + (row % 2) * 0.6,
                0.04 + (index % 3) * 0.025,
                -7.5 + row * 5.1 + (column % 3) * 0.35,
              ]}
            >
              <dodecahedronGeometry args={[0.12 + (index % 2) * 0.05, 0]} />
              <meshStandardMaterial color={flowerColors[index % flowerColors.length]} />
            </mesh>
          );
        })}
      </group>
    );
  }

  return (
    <group>
      {[
        { x: -8.5, z: -6.5, sx: 1.4, sz: 1.1 },
        { x: 7.2, z: -5.5, sx: 1.1, sz: 1.4 },
        { x: -2.2, z: 7.5, sx: 1.65, sz: 1.0 },
        { x: 9.5, z: 8.5, sx: 0.85, sz: 0.9 },
      ].map((hill, index) => (
        <mesh
          key={`reserve-hill-${index}`}
          position={[hill.x, 0.12, hill.z]}
          scale={[hill.sx, 0.34, hill.sz]}
        >
          <sphereGeometry args={[3.8, 16, 10]} />
          <meshStandardMaterial color={index % 2 === 0 ? 0x71865d : 0x849468} roughness={0.99} />
        </mesh>
      ))}
      <ReserveTree x={-11} z={8.5} scale={1.05} color={0x446b48} />
      <ReserveTree x={4.2} z={1.5} scale={0.9} color={0x54764e} />
      <ReserveTree x={11.5} z={-10.5} scale={1.15} color={0x3e6848} />
    </group>
  );
}

function NeighbourhoodGroundGrid() {
  const tileSize = NEIGHBORHOOD_GROUND_SIZE - NEIGHBORHOOD_GROUND_GAP;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
        <planeGeometry args={[tileSize, tileSize]} />
        <meshStandardMaterial color={0xeccba9} roughness={0.92} metalness={0} />
      </mesh>

      {SURROUNDING_NEIGHBORHOOD_SLOTS.map((slot) => (
        <group
          key={`future-neighbourhood-${slot.id}`}
          position={[
            slot.dx * NEIGHBORHOOD_GROUND_SIZE,
            0,
            slot.dz * NEIGHBORHOOD_GROUND_SIZE,
          ]}
        >
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.085, 0]}>
            <planeGeometry args={[tileSize, tileSize]} />
            <meshStandardMaterial color={slot.color} roughness={0.96} metalness={0} />
          </mesh>
          <ReserveLandscape type={slot.reserveType} />
          <ReserveNeighbourhoodLabel
            number={slot.number}
            dx={slot.dx}
            dz={slot.dz}
          />
        </group>
      ))}
    </group>
  );
}

function Building({
  building,
  selected,
  growth,
  onSelectBuilder,
}: {
  building: CityBuilding;
  selected: boolean;
  growth: GrowthAnimation | null;
  onSelectBuilder: CityViewProps["onSelectBuilder"];
}) {
  const bodyRef = useRef<THREE.Mesh>(null);
  const roofRef = useRef<THREE.Mesh>(null);
  const roofLabelRef = useRef<THREE.Group>(null);
  const floorBandsRef = useRef<THREE.Group>(null);
  const animationRef = useRef<BuildingAnimation | null>(null);
  const growthTokenRef = useRef<number | null>(null);
  const [hovered, setHovered] = useState(false);
  const { gl, invalidate } = useThree();
  const targetHeight = floorHeight(building.floors);
  const roofColor = useMemo(
    () => new THREE.Color(building.builder.accentColor).offsetHSL(0, -0.05, 0.2),
    [building.builder.accentColor],
  );
  const floorBandColor = useMemo(
    () =>
      new THREE.Color(building.builder.accentColor).lerp(
        new THREE.Color(0xfff1d6),
        0.34,
      ),
    [building.builder.accentColor],
  );
  const roofLabelTexture = useMemo(() => {
    if (!selected) return null;

    const canvas = document.createElement("canvas");
    const textureScale = 4;
    canvas.width = 512 * textureScale;
    canvas.height = 512 * textureScale;
    const context = canvas.getContext("2d");
    if (!context) return null;

    // Draw at 4x density so the label stays crisp when the roof is viewed
    // obliquely, while keeping all layout measurements in logical pixels.
    context.scale(textureScale, textureScale);

    context.textAlign = "left";
    context.textBaseline = "top";
    context.strokeStyle = "rgba(255, 248, 232, 0.74)";
    context.lineWidth = 5;
    context.lineJoin = "round";
    context.fillStyle = "rgba(28, 30, 40, 0.7)";
    context.font = "800 64px Arial, sans-serif";
    context.strokeText("BUILDER", 28, 28);
    context.fillText("BUILDER", 28, 28);
    context.fillStyle = "#1c1e28";
    context.font = "900 104px Arial, sans-serif";

    const displayName = building.builder.displayName;
    const maxWidth = 456;
    const words = displayName.split(" ");
    const lines: string[] = [];
    let currentLine = "";
    words.forEach((word) => {
      const candidate = currentLine ? `${currentLine} ${word}` : word;
      if (context.measureText(candidate).width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = candidate;
      }
    });
    if (currentLine) lines.push(currentLine);
    lines.slice(0, 2).forEach((line, index) => {
      context.strokeText(line, 28, 106 + index * 112, maxWidth);
      context.fillText(line, 28, 106 + index * 112, maxWidth);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    texture.needsUpdate = true;
    return texture;
  }, [building.builder.displayName, gl, selected]);

  useEffect(
    () => () => {
      roofLabelTexture?.dispose();
    },
    [roofLabelTexture],
  );

  const applyHeight = (height: number) => {
    if (!bodyRef.current || !roofRef.current) return;
    bodyRef.current.scale.y = height;
    bodyRef.current.position.y = height / 2;
    roofRef.current.position.y = height + 0.08;
    if (roofLabelRef.current) roofLabelRef.current.position.y = height + 0.17;
    floorBandsRef.current?.children.forEach((band, index) => {
      const boundaryHeight = (index + 1) * FLOOR_HEIGHT;
      band.position.y = boundaryHeight;
      band.visible = boundaryHeight <= height + 0.025;
    });
  };

  useEffect(() => {
    const isNewGrowth =
      growth?.builderId === building.builder.id &&
      growth.token !== growthTokenRef.current;

    if (isNewGrowth) {
      growthTokenRef.current = growth.token;
      if (growth.toFloors > growth.fromFloors) {
        applyHeight(floorHeight(growth.fromFloors));
        animationRef.current = {
          from: floorHeight(growth.fromFloors),
          to: floorHeight(growth.toFloors),
          startedAt: performance.now(),
          duration: 720,
        };
        invalidate();
        return;
      }
    }

    animationRef.current = null;
    applyHeight(targetHeight);
    invalidate();
  }, [building.builder.id, growth, invalidate, targetHeight]);

  useEffect(() => {
    if (!hovered) return;
    const previousCursor = document.body.style.cursor;
    document.body.style.cursor = "pointer";
    return () => {
      document.body.style.cursor = previousCursor;
    };
  }, [hovered]);

  useFrame(() => {
    const animation = animationRef.current;
    if (!animation) return;

    const progress = Math.min(1, (performance.now() - animation.startedAt) / animation.duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    applyHeight(animation.from + (animation.to - animation.from) * eased);

    if (progress < 1) invalidate();
    else animationRef.current = null;
  });

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(true);
  };
  const handlePointerOut = () => setHovered(false);
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (event.delta > 4) return;
    onSelectBuilder(building.builder.id);
  };

  return (
    <group
      position={[building.plot.gx, 0, building.plot.gy]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <mesh ref={bodyRef} position={[0, targetHeight / 2, 0]} scale={[1, targetHeight, 1]}>
        <boxGeometry args={[BUILDING_SIZE, 1, BUILDING_SIZE]} />
        <meshStandardMaterial
          color={building.builder.accentColor}
          roughness={0.72}
          metalness={0.04}
          transparent={building.builder.status === "dormant"}
          opacity={building.builder.status === "dormant" ? 0.72 : 1}
          emissive={selected || hovered ? 0x55311f : 0x000000}
          emissiveIntensity={selected ? 0.55 : hovered ? 0.25 : 0}
        />
      </mesh>
      <mesh ref={roofRef} position={[0, targetHeight + 0.08, 0]}>
        <boxGeometry args={[BUILDING_SIZE * 1.05, 0.16, BUILDING_SIZE * 1.05]} />
        <meshStandardMaterial
          color={roofColor}
          roughness={0.62}
          emissive={selected ? 0xffffff : 0x000000}
          emissiveIntensity={selected ? 0.35 : 0}
        />
      </mesh>
      {roofLabelTexture && (
        <group
          ref={roofLabelRef}
          position={[0, targetHeight + 0.17, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[BUILDING_SIZE * 0.96, BUILDING_SIZE * 0.96]} />
            <meshBasicMaterial
              map={roofLabelTexture}
              transparent
              depthWrite={false}
              toneMapped={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}
      <group ref={floorBandsRef}>
        {Array.from({ length: Math.max(0, building.floors - 1) }, (_, index) => (
          <mesh key={`${building.builder.id}-floor-band-${index}`}>
            <boxGeometry
              args={[BUILDING_SIZE * 1.055, 0.055, BUILDING_SIZE * 1.055]}
            />
            <meshStandardMaterial
              color={floorBandColor}
              roughness={0.68}
              metalness={0.03}
              emissive={selected ? 0xffffff : 0x000000}
              emissiveIntensity={selected ? 0.16 : 0}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function BlockStreetReserve({
  block,
}: {
  block: Pick<CityCommunity, "id" | "gx" | "gy">;
}) {
  const streetPadSize = CITY_BLOCK_SIZE + CITY_SPATIAL_RULES.blockStreetWidth;

  return (
    <group position={[block.gx, 0, block.gy]}>
      <mesh position={[0, -0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[streetPadSize, streetPadSize]} />
        <meshBasicMaterial color={0xb88973} />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={`${block.id}-block-curb-${side}`}>
          <mesh position={[side * CITY_BLOCK_SIZE / 2, 0.012, 0]}>
            <boxGeometry args={[0.14, 0.03, CITY_BLOCK_SIZE]} />
            <meshStandardMaterial color={0xf0d7b7} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.013, side * CITY_BLOCK_SIZE / 2]}>
            <boxGeometry args={[CITY_BLOCK_SIZE, 0.03, 0.14]} />
            <meshStandardMaterial color={0xf0d7b7} roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function BlockRoadGrid({ community }: { community: CityCommunity }) {
  const laneCenters = [
    -CITY_SPATIAL_RULES.plotPitch / 2,
    CITY_SPATIAL_RULES.plotPitch / 2,
  ];

  return (
    <>
      <BlockStreetReserve block={community} />
      <group position={[community.gx, 0, community.gy]}>
      {laneCenters.map((offset) => (
        <group key={`${community.id}-plot-lanes-${offset}`}>
          <mesh position={[offset, 0.018, 0]}>
            <boxGeometry
              args={[CITY_SPATIAL_RULES.plotLaneWidth, 0.025, CITY_BLOCK_SIZE]}
            />
            <meshStandardMaterial color={0xe0c7a7} roughness={0.96} />
          </mesh>
          <mesh position={[0, 0.019, offset]}>
            <boxGeometry
              args={[CITY_BLOCK_SIZE, 0.025, CITY_SPATIAL_RULES.plotLaneWidth]}
            />
            <meshStandardMaterial color={0xe7cfad} roughness={0.96} />
          </mesh>
        </group>
      ))}
      </group>
    </>
  );
}

function Stadium({ stadium }: { stadium: CityStadium }) {
  const fieldLength = 4.25;
  const fieldWidth = 2.08;
  const fieldLineWidth = 0.04;
  const penaltyDepth = 0.72;
  const penaltyWidth = 1.18;
  const timberSlats = Array.from({ length: 64 }, (_, index) => {
    const row = Math.floor(index / 32);
    const column = index % 32;
    const angle = (column / 32) * Math.PI * 2 + row * (Math.PI / 32);
    return {
      angle,
      row,
      x: Math.cos(angle) * (2.76 + row * 0.04),
      z: Math.sin(angle) * (2.76 + row * 0.04),
    };
  });

  return (
    <group position={[stadium.gx, 0, stadium.gy]}>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[stadium.size, 0.1, stadium.size]} />
        <meshStandardMaterial color={0xf2b69f} roughness={0.82} />
      </mesh>
      <group
        rotation={[0, Math.PI / 4, 0]}
        scale={[STADIUM_MODEL_SCALE, STADIUM_MODEL_SCALE, STADIUM_MODEL_SCALE]}
      >
        <group scale={[1.24, 1, 0.82]}>
          <mesh position={[0, 0.68, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.22, 0.62, 20, 96]} />
            <meshStandardMaterial color={0x655f50} roughness={0.82} />
          </mesh>
          <mesh position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2.28, 0.42, 16, 96]} />
            <meshStandardMaterial color={0x987b59} roughness={0.86} />
          </mesh>
          <mesh position={[0, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.9, 0.2, 14, 72]} />
            <meshStandardMaterial color={0x35433d} roughness={0.76} />
          </mesh>

          {[0.47, 0.94, 1.4].map((height, index) => (
            <mesh
              key={`stadium-timber-eave-${index}`}
              position={[0, height, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <torusGeometry args={[2.62 + index * 0.035, 0.17, 12, 96]} />
              <meshStandardMaterial
                color={[0xc5a06f, 0xd6b987, 0xe3cda5][index]}
                roughness={0.88}
              />
            </mesh>
          ))}

          {timberSlats.map(({ angle, row, x, z }, index) => (
            <group
              key={`stadium-timber-slat-${index}`}
              position={[x, 0.66 + row * 0.47, z]}
              rotation={[0, -angle + Math.PI / 2, 0]}
            >
              <mesh>
                <boxGeometry args={[0.08, 0.42, 0.1]} />
                <meshStandardMaterial
                  color={index % 3 === 0 ? 0x8e704f : 0xc4a06f}
                  roughness={0.9}
                />
              </mesh>
            </group>
          ))}

          <group position={[0, 1.72, 0]} scale={[1, 0.36, 1]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[2.35, 0.45, 18, 96]} />
              <meshStandardMaterial color={0xe7dcc6} roughness={0.72} />
            </mesh>
          </group>
        </group>

        <mesh position={[0, 0.39, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.45, 2.25]} />
          <meshStandardMaterial color={0x5ca68f} roughness={0.94} />
        </mesh>
        <group position={[0, 0.415, 0]}>
          {[-1, 1].map((side) => (
            <group key={`stadium-field-outline-${side}`}>
              <mesh position={[0, 0, side * fieldWidth / 2]}>
                <boxGeometry args={[fieldLength, 0.018, fieldLineWidth]} />
                <meshBasicMaterial color={0xf8f0d4} />
              </mesh>
              <mesh position={[side * fieldLength / 2, 0, 0]}>
                <boxGeometry args={[fieldLineWidth, 0.018, fieldWidth]} />
                <meshBasicMaterial color={0xf8f0d4} />
              </mesh>
            </group>
          ))}
          <mesh>
            <boxGeometry args={[fieldLineWidth, 0.018, fieldWidth]} />
            <meshBasicMaterial color={0xf8f0d4} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.42, 0.025, 8, 48]} />
            <meshBasicMaterial color={0xf8f0d4} />
          </mesh>
          <mesh position={[0, 0.01, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.022, 12]} />
            <meshBasicMaterial color={0xf8f0d4} />
          </mesh>
          {[-1, 1].map((side) => (
            <group key={`stadium-field-penalty-${side}`}>
              <mesh position={[side * (fieldLength / 2 - penaltyDepth), 0, 0]}>
                <boxGeometry args={[fieldLineWidth, 0.018, penaltyWidth]} />
                <meshBasicMaterial color={0xf8f0d4} />
              </mesh>
              {[-1, 1].map((edge) => (
                <mesh
                  key={`stadium-field-penalty-${side}-${edge}`}
                  position={[
                    side * (fieldLength / 2 - penaltyDepth / 2),
                    0,
                    edge * penaltyWidth / 2,
                  ]}
                >
                  <boxGeometry args={[penaltyDepth, 0.018, fieldLineWidth]} />
                  <meshBasicMaterial color={0xf8f0d4} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}

function Commons({ community }: { community: CityCommunity }) {
  const shrubCount = Math.min(6, community.level + 1);

  return (
    <group position={[community.gx, 0, community.gy]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <planeGeometry args={[PLOT_SURFACE_SIZE, PLOT_SURFACE_SIZE]} />
        <meshStandardMaterial color={0x8fbe78} roughness={0.96} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.024, 0]}>
        <planeGeometry args={[2.5, 0.28]} />
        <meshBasicMaterial color={0xffe8c3} transparent opacity={0.78} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.025, 0]}>
        <planeGeometry args={[2.5, 0.28]} />
        <meshBasicMaterial color={0xffe8c3} transparent opacity={0.78} />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.12, 0.16, 0.92, 8]} />
        <meshStandardMaterial color={0x765038} roughness={0.96} />
      </mesh>
      <mesh position={[0, 1.16, 0]}>
        <dodecahedronGeometry args={[0.58, 0]} />
        <meshStandardMaterial
          color={0x4e8b54}
          emissive={0x315e38}
          emissiveIntensity={community.progress * 0.08}
          roughness={0.92}
        />
      </mesh>
      <mesh position={[-0.34, 1.02, 0.08]}>
        <dodecahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial color={0x68a861} roughness={0.94} />
      </mesh>
      <mesh position={[0.31, 1.04, -0.04]}>
        <dodecahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color={0x397849} roughness={0.94} />
      </mesh>
      {Array.from({ length: shrubCount }, (_, index) => {
        const angle = (index / shrubCount) * Math.PI * 2 + Math.PI / 4;
        return (
          <mesh
            key={`${community.id}-shrub-${index}`}
            position={[
              Math.cos(angle) * 0.94,
              0.15,
              Math.sin(angle) * 0.94,
            ]}
          >
            <dodecahedronGeometry args={[0.16 + (index % 2) * 0.035, 0]} />
            <meshStandardMaterial color={index % 2 === 0 ? 0x6daa5f : 0x4f8a55} />
          </mesh>
        );
      })}
    </group>
  );
}

function CityScene({
  buildings,
  plots,
  communities,
  stadium,
  selectedBuilderId,
  growth,
  onSelectBuilder,
}: Omit<CityViewProps, "onReady">) {
  return (
    <>
      <fog attach="fog" args={[0xf6c9a6, 22, 46]} />
      <hemisphereLight args={[0xfff0dd, 0x7c5c71, 2.1]} />
      <directionalLight color={0xffd0a0} intensity={2.8} position={[-9, 16, 10]} />

      <NeighbourhoodGroundGrid />

      <BlockStreetReserve block={stadium} />

      {communities.map((community) => (
        <BlockRoadGrid key={`road-grid-${community.id}`} community={community} />
      ))}

      <Stadium stadium={stadium} />

      {plots.map((plot, index) => {
        const occupied = buildings.some((building) => building.plot.id === plot.id);
        const community = communities.find((item) => item.id === plot.communityId);
        const plotColor = new THREE.Color(community?.accentColor ?? 0xeecfaf).lerp(
          new THREE.Color(index % 2 === 0 ? 0xf4ddc2 : 0xeecfaf),
          0.68,
        );
        return (
        <mesh
          key={`plot-${plot.id}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[plot.gx, 0, plot.gy]}
        >
          <planeGeometry args={[PLOT_SURFACE_SIZE, PLOT_SURFACE_SIZE]} />
          <meshBasicMaterial
            color={plotColor}
            transparent={!occupied}
            opacity={occupied ? 1 : 0.48}
          />
        </mesh>
        );
      })}

      {communities.map((community) => (
        <Commons key={community.id} community={community} />
      ))}

      {buildings.map((building) => (
        <Building
          key={building.builder.id}
          building={building}
          selected={building.builder.id === selectedBuilderId}
          growth={growth}
          onSelectBuilder={onSelectBuilder}
        />
      ))}
    </>
  );
}

export default function ThreeCityView(props: CityViewProps) {
  const [zoom, setZoom] = useState(CAMERA_DEFAULT_ZOOM);
  const verticalContentHeight = useMemo(
    () =>
      Math.max(
        0,
        ...props.buildings.map((building) => floorHeight(building.floors) + 0.35),
      ),
    [props.buildings],
  );
  const zoomPercent = Math.round(
    ((zoom - CAMERA_MIN_ZOOM) / (CAMERA_MAX_ZOOM - CAMERA_MIN_ZOOM)) * 100,
  );

  return (
    <div className="city-lab-canvas city-lab-canvas--3d">
      <Canvas
        orthographic
        dpr={[1, 1.5]}
        frameloop="demand"
        camera={{ position: [14, 16, 14], near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.domElement.setAttribute("aria-label", "City Zero 3D orthographic builder city");
        }}
      >
        <CameraRig
          zoom={zoom}
          verticalContentHeight={verticalContentHeight}
          onZoomChange={setZoom}
        />
        <ReadySignal onReady={props.onReady} />
        <CityScene
          buildings={props.buildings}
          plots={props.plots}
          communities={props.communities}
          stadium={props.stadium}
          selectedBuilderId={props.selectedBuilderId}
          growth={props.growth}
          onSelectBuilder={props.onSelectBuilder}
        />
      </Canvas>

      <label className="city-lab-zoom-control">
        <span>
          <b>ZOOM</b>
          <output>{zoomPercent}%</output>
        </span>
        <input
          type="range"
          min={CAMERA_MIN_ZOOM}
          max={CAMERA_MAX_ZOOM}
          step={CAMERA_ZOOM_STEP}
          value={zoom}
          aria-label="City zoom"
          aria-valuetext={`${zoomPercent}%`}
          onChange={(event) => setZoom(Number(event.target.value))}
        />
      </label>
    </div>
  );
}
