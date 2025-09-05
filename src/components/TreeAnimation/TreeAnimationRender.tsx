import Victor from "victor";
import { MAX_DEPTH, TreeNode } from "./TreeAnimationState";
import {
  NormalizedValue,
  asNormalized,
  easedValue,
  invert,
  lerper,
  normalise,
} from "./utils/easing";

export const DEBUG_RENDER = false;
const TARGET_SIZE = 1024;
const WIDTH_HEIGHT_RATIO = 3 / 4;

// Go from blue (0) to grey (1)
const getColor = (value: number) => {
  const startColor = [59, 101, 222]; // Blue
  const endColor = [140, 140, 140]; // Dark Gray

  // lerp between start and end
  const inverseValue = 1 - value;
  const r = Math.round(startColor[0] * inverseValue + endColor[0] * value);
  const g = Math.round(startColor[1] * inverseValue + endColor[1] * value);
  const b = Math.round(startColor[2] * inverseValue + endColor[2] * value);

  return `rgb(${r}, ${g}, ${b})`;
};

type RenderArgs = {
  ctx: CanvasRenderingContext2D;
  unit: number;
  size: number;
  drawSpace: Rect;
};

const relativePosition = (
  base: Victor,
  direction: Victor,
  growth: NormalizedValue,
  length: number
): Victor => {
  const growthValue = easedValue(growth);
  const armSize = growthValue * length;
  const dirVec = direction.clone().multiplyScalar(armSize);
  const endPosition = base.clone().add(dirVec);
  return endPosition;
};

const toPosition = (vec: Victor, { drawSpace, size }: RenderArgs): Victor => {
  const x = drawSpace.x + vec.x * size;
  const y = drawSpace.y + vec.y * size;
  return new Victor(x, y);
};

const toSize = (value: number, { unit }: RenderArgs): number => {
  return value * unit;
};

type BranchRenderInfo = {
  start: Victor;
  end: Victor;
  width: number;
  startValue: number;
  endValue: number;
};

const renderBranch = (
  render: RenderArgs,
  { start, end, width, startValue, endValue }: BranchRenderInfo
) => {
  const { ctx } = render;

  // Determine real positions and sizes
  const lineWidth = toSize(width, render);
  const realStartPos = toPosition(start, render);
  const realEndPos = toPosition(end, render);

  // Set styling
  const gradient = ctx.createLinearGradient(
    realStartPos.x,
    realStartPos.y,
    realEndPos.x,
    realEndPos.y
  );
  gradient.addColorStop(0, getColor(startValue));
  gradient.addColorStop(1, getColor(endValue));

  ctx.strokeStyle = gradient;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";

  // Draw line of node
  ctx.beginPath();
  ctx.moveTo(realStartPos.x, realStartPos.y);
  ctx.lineTo(realEndPos.x, realEndPos.y);
  ctx.stroke();
};

const branchRenderValues = (
  node: TreeNode,
  currentPos: Victor
): BranchRenderInfo => {
  const { direction, length } = node.properties;
  const { depth, continuationDepth, combinedDepth } = node.attributes;

  // depth
  const depthFactor = normalise(depth, MAX_DEPTH);
  const invDepthFactor = invert(depthFactor);

  // continuation
  const maxDepth = node.attributes.maxCombinedDepth + 1;
  const contLerper = lerper(0, maxDepth);
  const continuationStart = contLerper(combinedDepth);
  const continuationEnd = contLerper(combinedDepth + node.state.growth);

  // position
  const tipPosition = relativePosition(
    currentPos,
    direction,
    node.state.growth,
    length
  );

  // size
  const width = invDepthFactor * 5 + 1.5;

  // progress
  const startValue = continuationStart;
  const endValue = continuationEnd;

  return { start: currentPos, end: tipPosition, width, startValue, endValue };
};

export const drawTreeNode = (
  render: RenderArgs,
  node: TreeNode,
  currentPos: Victor
): void => {
  if (node.state.growth === 0) {
    return;
  }

  const { growth } = node.state;
  const { direction, length } = node.properties;

  // Draw recursive children
  for (const child of node.children) {
    const growthOfChild = child.attributes.isContinuation
      ? growth
      : child.properties.growAt;

    const childPosition = relativePosition(
      currentPos,
      direction,
      asNormalized(growthOfChild),
      length
    );

    drawTreeNode(render, child, childPosition);
  }

  renderBranch(render, branchRenderValues(node, currentPos));
};

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const getNormalisedUnit = (size: number) => {
  const dpi = window.devicePixelRatio ?? 1;
  const baseSize = WIDTH_HEIGHT_RATIO * TARGET_SIZE;
  const normalisedSize = size / baseSize;

  return dpi * normalisedSize;
};

/** Determine a good region to render on */
const getDrawSpace = (ctx: CanvasRenderingContext2D): Rect => {
  const rectSize = Math.min(ctx.canvas.width, ctx.canvas.height, TARGET_SIZE);
  const rectWidth = WIDTH_HEIGHT_RATIO * rectSize;

  // 2/3rds
  const xOffset = Math.round((3 * (ctx.canvas.width - rectWidth)) / 4);
  // bottom
  const yOffset = ctx.canvas.height - rectWidth;

  return {
    x: xOffset,
    y: yOffset,
    width: rectWidth,
    height: rectSize,
  };
};

/** Render the tree on a context */
export const drawTree = (
  ctx: CanvasRenderingContext2D,
  treeRoot: TreeNode
): void => {
  const drawSpace = getDrawSpace(ctx);

  const size = Math.min(drawSpace.width, drawSpace.height);
  const unit = getNormalisedUnit(size);

  // Render new frame
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (DEBUG_RENDER) {
    // Render render space
    ctx.fillStyle = "#fff";
    ctx.fillRect(drawSpace.x, drawSpace.y, drawSpace.width, drawSpace.height);

    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    ctx.strokeRect(
      drawSpace.x + drawSpace.width / 2 - size / 2,
      drawSpace.y + drawSpace.height - size,
      size,
      size
    );
  }

  const renderArgs: RenderArgs = {
    ctx,
    unit,
    size,
    drawSpace,
  };

  const rootPosition = new Victor(0.5, 1);
  drawTreeNode(renderArgs, treeRoot, rootPosition);
};
