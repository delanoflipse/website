import { random, range } from "lodash";
import Victor from "victor";
import { angleToRadians, randomAngle, rotateAngle } from "./utils/angles";
import {
  NormalizedValue,
  asNormalized,
  clamp,
  invert,
  lerp,
  normalise,
  normaliseRange,
  randomSample,
} from "./utils/easing";
import { integerNormalSample, normalSample } from "./utils/random";

export const MAX_DEPTH: number = 3;
export const MAX_CONTINUATION: [number, number][] = [
  [7, 7],
  [4, 2],
  [2, 1],
  [1, 1],
];
export const MAX_SIZES: number[] = [0.2, 0.1, 0.05, 0.02];

export const AVG_BRANCHES = 3;
export const BRANCH_VARIANCE = 1;
export const MAX_NODES = 1200;

// Average duration for a spruce to grow in seconds
export const GROWTH_RATE = 0.5;
const GROW_AT_END = 0.8;

export const getMaxContinuation = (depth: number, continuation: number) => {
  const range = MAX_CONTINUATION[depth] ?? [1, 1];
  const continuationRange = MAX_CONTINUATION[depth - 1] ?? [1, 1];
  const progress = normaliseRange(
    continuation,
    continuationRange[0],
    continuationRange[1]
  );
  const rangeSize = range[0] - range[1];
  return Math.round(range[0] + progress * rangeSize);
};

let nodeCount = 0;

// Variable properties
type TreeNodeProperties = {
  direction: Victor;
  angle: number;
  length: number;
  growSpeed: number;
  growAt: number;
  branches: BranchInfo[];
};

// Static, non dependent properties
type TreeNodeAttributes = {
  depth: number;
  isContinuation: boolean;
  continuationDepth: number;
  combinedDepth: number;
  maxContinuation: number;
};

type BranchInfo = {
  growAt: number;
  type?: "left" | "right" | "both";
};

type TreeNodeState = {
  grown: boolean;
  growth: NormalizedValue;
};

export type TreeNode = {
  properties: TreeNodeProperties;
  attributes: TreeNodeAttributes;
  state: TreeNodeState;
  children: TreeNode[];
};

const BRANCH_OFFSET = 50;
const BRANCH_SPREAD = 30;
const BRANCH_CONTINUATION_SPREAD = 20;

export const getAngle = (baseDirection: number, isContinuation: boolean) => {
  // If we must follow the direction, only deviate slightly
  if (isContinuation) {
    return randomAngle(baseDirection, BRANCH_CONTINUATION_SPREAD);
  }

  // Otherwise, grow to the left, or right.
  const useLeft = random(0, 1) < 0.5;
  const nextCenter = rotateAngle(
    baseDirection,
    useLeft ? -BRANCH_OFFSET : BRANCH_OFFSET
  );
  return randomAngle(nextCenter, BRANCH_SPREAD);
};

export const getSize = ({ depth }: TreeNodeAttributes) => {
  const maxSize = MAX_SIZES[depth] ?? 0;
  const value = normalSample(0.9 * maxSize, 0.15 * maxSize);
  return value;
};

const getNewTreeAttributes = (
  parent: TreeNode | null,
  isContinuation: boolean
): TreeNodeAttributes => {
  const parentDepth = parent?.attributes.depth ?? 0;
  const parentContinuationDepth = parent?.attributes.continuationDepth ?? 0;
  const parentCombinedDepth = parent?.attributes.combinedDepth ?? 0;
  const combinedDepth = parentCombinedDepth + 1;

  let depth = 0;
  let continuationDepth = 0;

  if (isContinuation) {
    depth = parentDepth;
    continuationDepth = parentContinuationDepth + 1;
  } else {
    depth = parentDepth + 1;
    continuationDepth = parentContinuationDepth;
  }

  const maxContinuation = getMaxContinuation(depth, continuationDepth);

  return {
    isContinuation,
    depth,
    continuationDepth,
    combinedDepth,
    maxContinuation,
  };
};

export const createTreeNode = (
  parent: TreeNode | null,
  isContinuation: boolean,
  fromParent: number = 0
): TreeNode => {
  const attributes: TreeNodeAttributes = getNewTreeAttributes(
    parent,
    isContinuation
  );

  const { depth, continuationDepth } = attributes;
  const rootAngle = parent?.properties.angle ?? 90;

  const angle = getAngle(rootAngle, isContinuation);

  const direction = new Victor(0, 1).rotateBy(angleToRadians(angle));
  const length = getSize(attributes);
  const branchCount = integerNormalSample(AVG_BRANCHES, BRANCH_VARIANCE);
  const branches: BranchInfo[] = range(branchCount)
    .map(() => {
      const growAt = randomSample(0.15, 0.85);

      return {
        growAt: growAt,
      };
    })
    .sort((a, b) => a.growAt - b.growAt);

  const growDepthFactor = lerp(normalise(depth, MAX_DEPTH), 1, 0.2);
  const growContinuationFactor = lerp(
    normalise(continuationDepth, parent?.attributes.maxContinuation ?? 1),
    1,
    0.2
  );
  const growSpeedFactor = 1;

  const node: TreeNode = {
    properties: {
      direction,
      angle,
      length,
      growSpeed: growDepthFactor * growSpeedFactor * growContinuationFactor,
      growAt: fromParent,
      branches,
    },
    attributes,
    state: {
      growth: asNormalized(0),
      grown: false,
    },
    children: [],
  };

  return node;
};

export const updateTree = (
  node: TreeNode | null,
  parent: TreeNode | null,
  deltaSec: number
): void => {
  if (node == null) {
    return;
  }

  // Recursively update children
  for (const child of node.children) {
    updateTree(child, node, deltaSec);
  }

  // Branch is fully grown
  if (node.state.grown) {
    return;
  }

  // -- Growth --
  const growthIncrease = (deltaSec * node.properties.growSpeed) / GROWTH_RATE;
  const growthBefore = node.state.growth;
  node.state.growth = clamp(node.state.growth + growthIncrease);
  node.state.grown = node.state.growth >= 1;

  // -- Node Creation --
  if (nodeCount >= MAX_NODES) {
    return;
  }

  // continuations
  const growEnd =
    growthBefore < GROW_AT_END && node.state.growth >= GROW_AT_END;
  const maxContinuationForDepth = getMaxContinuation(
    node.attributes.depth,
    node.attributes.continuationDepth
  );
  if (growEnd && node.attributes.continuationDepth < maxContinuationForDepth) {
    const newChild = createTreeNode(node, true, 1);
    node.children.push(newChild);
    nodeCount++;
  }

  // side branches
  if (node.attributes.depth >= MAX_DEPTH) {
    return;
  }

  const { branches: spruces } = node.properties;
  const sprucesToGrow = spruces.filter(
    (s) => growthBefore < s.growAt && node.state.growth >= s.growAt
  );

  for (const spruce of sprucesToGrow) {
    const newChild = createTreeNode(node, false, spruce.growAt);
    node.children.push(newChild);
    nodeCount++;
  }
};
