import Victor from "victor";
import { MAX_DEPTH, TreeNode, getMaxContinuation } from "./TreeAnimationState";
import {
  NormalizedValue,
  asNormalized,
  easedValue,
  invert,
  normalise,
} from "./utils/easing";

export const DEBUG_RENDER = false;

// Go from blue (0) to grey (1)
const getColor = (value: number) => {
  // const startColor = [75, 109, 206]; // Blue
  // const endColor = [78, 82, 91]; // Dark Gray
  const startColor = [59, 101, 222]; // Blue
  const endColor = [140, 140, 140]; // Dark Gray
  // lerp between start and end
  const inverseValue = 1 - value;
  const r = Math.round(startColor[0] * inverseValue + endColor[0] * value);
  const g = Math.round(startColor[1] * inverseValue + endColor[1] * value);
  const b = Math.round(startColor[2] * inverseValue + endColor[2] * value);

  return `rgb(${r}, ${g}, ${b})`;
};

const relativePosition = (
  base: Victor,
  direction: Victor,
  growth: NormalizedValue,
  length: number,
  baseSize: number
): Victor => {
  const growthValue = easedValue(growth);
  const armSize = growthValue * length * baseSize;
  const dirVec = direction.clone().multiplyScalar(armSize);
  const endPosition = base.clone().add(dirVec);
  return endPosition;
};

export const drawTreeNode = (
  ctx: CanvasRenderingContext2D,
  node: TreeNode,
  rootPos: Victor,
  baseSize: number
): void => {
  if (node.state.growth === 0) {
    return;
  }

  const { growth } = node.state;
  const { direction, length } = node.properties;
  const { depth, continuationDepth, combinedDepth } = node.attributes;

  const growthValue = growth;
  // const growthValue = easedValue(growth);
  const tipPosition = relativePosition(
    rootPos,
    direction,
    growthValue,
    length,
    baseSize
  );

  // Draw recursive children
  for (const child of node.children) {
    const growthOfChild = child.attributes.isContinuation
      ? growthValue
      : child.properties.growAt;
    const childPosition = relativePosition(
      rootPos,
      direction,
      asNormalized(growthOfChild),
      length,
      baseSize
    );
    drawTreeNode(ctx, child, childPosition, baseSize);
  }

  // Draw node
  const maxContinuation = getMaxContinuation(depth, continuationDepth);
  const depthFactor = normalise(depth, MAX_DEPTH);
  const invDepthFactor = invert(depthFactor);
  const continuationFactor = normalise(continuationDepth, maxContinuation);
  //   TODO
  const combinedFactor = normalise(combinedDepth, 99);
  const combinedFactor2 = normalise(combinedDepth + 1, 99);

  const startColorValue = combinedFactor;
  const endColorValue = combinedFactor2;

  const lineWidth = 1.5 + 5 * invDepthFactor;
  // console.log({
  //     depth, depthFactor,
  // })

  // Set styling
  const gradient = ctx.createLinearGradient(
    rootPos.x,
    rootPos.y,
    tipPosition.x,
    tipPosition.y
  );
  gradient.addColorStop(0, getColor(startColorValue));
  gradient.addColorStop(1, getColor(endColorValue));

  ctx.strokeStyle = gradient;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";

  // Draw line of node
  ctx.beginPath();
  ctx.moveTo(rootPos.x, rootPos.y);
  ctx.lineTo(tipPosition.x, tipPosition.y);
  ctx.stroke();
};

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** Determine a good region to render on */
const getDrawSpace = (ctx: CanvasRenderingContext2D): Rect => {
  const rectSize = Math.min(ctx.canvas.width, ctx.canvas.height, 1000);
  const rectWidth = (3 * rectSize) / 4;

  // 2/3rds
  const xOffset = Math.round((3 * (ctx.canvas.width - rectWidth)) / 4);
  // bottom
  const yOffset = ctx.canvas.height - rectSize;

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

  const rootPosition = new Victor(
    drawSpace.x + drawSpace.width / 2,
    drawSpace.y + drawSpace.height
  );
  const rootSize = Math.min(drawSpace.width, drawSpace.height);

  // Render new frame
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (DEBUG_RENDER) {
    // Render render space
    ctx.fillStyle = "#fff";
    ctx.fillRect(drawSpace.x, drawSpace.y, drawSpace.width, drawSpace.height);

    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    ctx.strokeRect(
      drawSpace.x + drawSpace.width / 2 - rootSize / 2,
      drawSpace.y + drawSpace.height - rootSize,
      rootSize,
      rootSize
    );
  }

  drawTreeNode(ctx, treeRoot, rootPosition, rootSize);
};
