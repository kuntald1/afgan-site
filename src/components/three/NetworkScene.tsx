import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 190;
const MAX_LINK_DIST = 3.6;
const FIELD = { x: 34, y: 24, z: 70 };

// Distance from camera at which things start dissolving into the page.
// This is what lets the camera fly hard through the field without nodes
// becoming giant blobs on top of the copy.
const NEAR_FADE_START = 11;
const NEAR_FADE_FULL = 3.5;
const FAR_FADE_START = 42;

const ORANGE = new THREE.Color("#E0651F");
const SLATE = new THREE.Color("#5C7C90");
const PAGE_BG = new THREE.Color("#F4F2ED");

type NodeData = {
  base: THREE.Vector3;
  drift: THREE.Vector3;
  phase: number;
  scale: number;
};

/** Deterministic pseudo-random so the layout is stable across reloads. */
function seeded(i: number, salt: number) {
  const v = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return v - Math.floor(v);
}

/** 1 = fully visible, 0 = fully dissolved into the page. */
function depthVisibility(d: number) {
  if (d < NEAR_FADE_FULL) return 0;
  if (d < NEAR_FADE_START) {
    return (d - NEAR_FADE_FULL) / (NEAR_FADE_START - NEAR_FADE_FULL);
  }
  if (d > FAR_FADE_START) {
    return Math.max(0, 1 - (d - FAR_FADE_START) / 26);
  }
  return 1;
}

export default function NetworkScene({
  progressRef,
  reducedMotion,
}: {
  progressRef: React.RefObject<number>;
  reducedMotion: boolean;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmpColor = useMemo(() => new THREE.Color(), []);
  const camTarget = useMemo(() => new THREE.Vector3(), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);
  const localCam = useMemo(() => new THREE.Vector3(), []);
  const vecA = useMemo(() => new THREE.Vector3(), []);
  const vecB = useMemo(() => new THREE.Vector3(), []);
  const posA = useMemo(() => new THREE.Vector3(), []);

  /**
   * `vertexColors` must be on for per-instance colours to reach the fragment
   * shader; without a `color` attribute the shader reads the WebGL default
   * (black) and nodes render invisible. Filling with 1.0 lets the instance
   * colour pass through unchanged.
   */
  const nodeGeometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 10, 10);
    const count = geo.getAttribute("position").count;
    geo.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(count * 3).fill(1), 3)
    );
    return geo;
  }, []);

  const nodes = useMemo<NodeData[]>(
    () =>
      Array.from({ length: NODE_COUNT }, (_, i) => ({
        base: new THREE.Vector3(
          (seeded(i, 1) - 0.5) * FIELD.x,
          (seeded(i, 2) - 0.5) * FIELD.y,
          (seeded(i, 3) - 0.5) * FIELD.z
        ),
        drift: new THREE.Vector3(
          (seeded(i, 4) - 0.5) * 0.7,
          (seeded(i, 5) - 0.5) * 0.7,
          (seeded(i, 6) - 0.5) * 0.5
        ),
        phase: seeded(i, 7) * Math.PI * 2,
        scale: 0.05 + seeded(i, 8) * 0.075,
      })),
    []
  );

  const linkPairs = useMemo(() => {
    const pairs: Array<[number, number]> = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (nodes[i].base.distanceTo(nodes[j].base) < MAX_LINK_DIST) {
          pairs.push([i, j]);
        }
      }
    }
    return pairs;
  }, [nodes]);

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(linkPairs.length * 6), 3)
    );
    geo.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(linkPairs.length * 6), 3)
    );
    return geo;
  }, [linkPairs.length]);

  useFrame((state) => {
    const p = progressRef.current ?? 0;
    const t = reducedMotion ? 0 : state.clock.elapsedTime;

    // DRAMATIC camera path: a long flight straight through the field, with
    // a banking sweep left/right and a rising/falling arc. Readability is
    // protected by the near-field dissolve below, not by holding back here.
    camTarget.set(
      Math.sin(p * Math.PI * 2.2) * 9,
      Math.sin(p * Math.PI * 1.4) * 5.5,
      32 - p * 62
    );
    camera.position.lerp(camTarget, reducedMotion ? 1 : 0.06);

    // Look slightly ahead of the travel direction so it feels like flight.
    lookTarget.set(
      Math.sin(p * Math.PI * 2.2 + 0.6) * 5,
      Math.sin(p * Math.PI * 1.4 + 0.5) * 3,
      camera.position.z - 14
    );
    camera.lookAt(lookTarget);
    camera.rotation.z = Math.sin(p * Math.PI * 1.8) * 0.22;

    if (groupRef.current) {
      groupRef.current.rotation.y = p * Math.PI * 0.8 + t * 0.02;
      groupRef.current.rotation.x = Math.sin(p * Math.PI) * 0.18;
    }

    const mesh = meshRef.current;
    if (!mesh) return;

    // Camera position expressed in the rotating group's local space, so
    // depth fading stays correct as the field spins.
    const group = groupRef.current;
    if (group) {
      group.updateMatrixWorld();
      localCam.copy(camera.position);
      group.worldToLocal(localCam);
    } else {
      localCam.copy(camera.position);
    }

    const activation = 0.25 + p * 0.75;

    for (let i = 0; i < NODE_COUNT; i++) {
      const n = nodes[i];
      const wobble = reducedMotion ? 0 : Math.sin(t * 0.5 + n.phase) * 0.5;
      posA.set(
        n.base.x + n.drift.x * wobble,
        n.base.y + n.drift.y * wobble,
        n.base.z + n.drift.z * wobble
      );

      const vis = depthVisibility(localCam.distanceTo(posA));
      const isLit = activation > i / NODE_COUNT;
      const pulse = reducedMotion ? 1 : 1 + Math.sin(t * 1.1 + n.phase) * 0.1;

      dummy.position.copy(posA);
      // Shrink as it dissolves, so nothing ever looms large in the frame.
      dummy.scale.setScalar(n.scale * pulse * (isLit ? 1.2 : 0.75) * vis);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      tmpColor
        .copy(isLit ? ORANGE : SLATE)
        .lerp(PAGE_BG, 1 - vis * (isLit ? 0.75 : 0.5));
      mesh.setColorAt(i, tmpColor);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    const linePos = lineGeometry.getAttribute("position") as THREE.BufferAttribute;
    const lineCol = lineGeometry.getAttribute("color") as THREE.BufferAttribute;

    for (let k = 0; k < linkPairs.length; k++) {
      const [i, j] = linkPairs[k];
      const ni = nodes[i];
      const nj = nodes[j];
      const wi = reducedMotion ? 0 : Math.sin(t * 0.5 + ni.phase) * 0.5;
      const wj = reducedMotion ? 0 : Math.sin(t * 0.5 + nj.phase) * 0.5;

      vecA.set(
        ni.base.x + ni.drift.x * wi,
        ni.base.y + ni.drift.y * wi,
        ni.base.z + ni.drift.z * wi
      );
      vecB.set(
        nj.base.x + nj.drift.x * wj,
        nj.base.y + nj.drift.y * wj,
        nj.base.z + nj.drift.z * wj
      );

      linePos.setXYZ(k * 2, vecA.x, vecA.y, vecA.z);
      linePos.setXYZ(k * 2 + 1, vecB.x, vecB.y, vecB.z);

      const bothLit = activation > Math.max(i, j) / NODE_COUNT;
      const visA = depthVisibility(localCam.distanceTo(vecA));
      const visB = depthVisibility(localCam.distanceTo(vecB));


      tmpColor
        .copy(bothLit ? ORANGE : SLATE)
        .lerp(PAGE_BG, 1 - visA * (bothLit ? 0.55 : 0.3));
      lineCol.setXYZ(k * 2, tmpColor.r, tmpColor.g, tmpColor.b);

      tmpColor
        .copy(bothLit ? ORANGE : SLATE)
        .lerp(PAGE_BG, 1 - visB * (bothLit ? 0.55 : 0.3));
      lineCol.setXYZ(k * 2 + 1, tmpColor.r, tmpColor.g, tmpColor.b);
    }
    linePos.needsUpdate = true;
    lineCol.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={meshRef}
        args={[nodeGeometry, undefined, NODE_COUNT]}
        frustumCulled={false}
      >
        <meshBasicMaterial vertexColors toneMapped={false} />
      </instancedMesh>

      <lineSegments geometry={lineGeometry} frustumCulled={false}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.75}
          toneMapped={false}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
