"use client";

import { useEffect, useRef, useState } from "react";
import { random, range } from "lodash";
import Victor from "victor";

const MAX_DEPTH = 8;
const MAX_SPRUCES = 3;
const MAX_NODES = 1000;

let nodeCount = 0;

type TreeNodeDrawInfo = {
  direction: Victor;
  angle: number;
  length: number;
};

type SpruceInfo = {
  growAt: number;
  easedGrowth: number;
  type?: "left" | "right" | "both";
}

type TreeNodeTreeInfo = {
  growSpeed: number;
  growth: number;
  grown: boolean;
  growAt: number;
  depth: number;
  spruces: SpruceInfo[];
}

type TreeNode = {
  drawInfo: TreeNodeDrawInfo;
  treeInfo: TreeNodeTreeInfo;
  children: TreeNode[];
}

type Rect = {
  x: number,
  y: number,
  width: number,
  height: number;
};

const easedValue = (value: number) => {
  return value * value * (3 - 2 * value);
}

const angleToRadians = (angle: number) => (angle * Math.PI) / 180;

const randomAngle = (middleDegrees: number, spreadDegrees: number) => {
  const angle = random(middleDegrees - spreadDegrees, middleDegrees + spreadDegrees);
  return angle;
}

const getAngle = (baseDirection: number, rootIsh: boolean) => {
  if (rootIsh) {
    return randomAngle(baseDirection, 10);
  }

  const useLeft = random(0, 1) < 0.5;
  if (useLeft) {
    return randomAngle(baseDirection - 20, 30);
  }

  return randomAngle(baseDirection + 20, 30);
}

const createTree = (parent: TreeNode | null, fromParent: number = 0): TreeNode => {
  const depth = parent == null ? 0 : parent.treeInfo.depth + 1;
  const rootAngle = parent?.drawInfo.angle ?? 90;

  const angle = getAngle(rootAngle, depth == 0 || fromParent == 1);

  const direction = new Victor(0, 1).rotateBy(angleToRadians(angle));
  const length = random(0.5, 1.0, true) * (1 / (depth + 1));
  const spruceCount = random(1, MAX_SPRUCES, true);
  const spruces: SpruceInfo[] = range(spruceCount).map(() => {
    const growAt = random(0.1, 0.9, true);

    return {
      growAt: growAt,
      easedGrowth: easedValue(growAt),
    }
  }).sort((a, b) => a.growAt - b.growAt);

  const drawInfo = {
    direction,
    angle,
    length,
  };

  const root: TreeNode = {
    drawInfo,
    treeInfo: {
      growAt: fromParent,
      growSpeed: random(1.2, 2.0, true),
      growth: 0,
      grown: false,
      depth,
      spruces,
    },
    children: [],
  }

  return root;
}

const updateTree = (node: TreeNode | null, parent: TreeNode | null, deltaSec: number): void => {
  if (node == null) {
    return;
  }

  for (const child of node.children) {
    updateTree(child, node, deltaSec);
  }

  if (node.treeInfo.grown) {
    return;
  }
  
  // -- Growth --
  const growthIncrease = deltaSec / node.treeInfo.growSpeed;
  const growEndAt = 0.85;
  const growEnd = node.treeInfo.growth < growEndAt && node.treeInfo.growth + growthIncrease >= growEndAt;
  node.treeInfo.growth = Math.min(1, node.treeInfo.growth + growthIncrease);
  node.treeInfo.grown = node.treeInfo.growth == 1;

  const { spruces } = node.treeInfo;
  const sprucesToHaveGrow = spruces.filter(s => s.growAt <= node.treeInfo.growth);
  const sprucesToGrow = sprucesToHaveGrow.slice(node.children.length);

  // -- Node Creation --
  if (nodeCount >= MAX_NODES || node.treeInfo.depth >= MAX_DEPTH) {
    return;
  }

  if (growEnd) {
    const newChild = createTree(node, 1);
    node.children.push(newChild);
    nodeCount++;
  }

  for (const spruce of sprucesToGrow) {
    const newChild = createTree(node, spruce.growAt);
    node.children.push(newChild);
    nodeCount++;
  }
}

const getColor = (value: number) => {
  const startColor = [78, 82, 91]; // Dark Gray
  const endColor = [75, 109, 206]; // Blue

  const inverseValue = 1 - value;
  const r = Math.round(startColor[0] * inverseValue + endColor[0] * value);
  const g = Math.round(startColor[1] * inverseValue + endColor[1] * value);
  const b = Math.round(startColor[2] * inverseValue + endColor[2] * value);

  return `rgb(${r}, ${g}, ${b})`;
}

const relativePosition = (base: Victor, direction: Victor, growth: number, length: number, baseSize: number): Victor => {
  const armSize = growth * length * baseSize;
  const dirVec = direction.clone().multiplyScalar(armSize);
  const endPosition = base.clone().add(dirVec);
  return endPosition;
}

const drawTree = (ctx: CanvasRenderingContext2D, node: TreeNode, basePosition: Victor, baseSize: number): void => {
  if (node.treeInfo.growth === 0) {
    return;
  }

  const { growth, depth } = node.treeInfo;
  const { direction, length } = node.drawInfo;

  const nodePosition = basePosition;
  const growthValue = easedValue(growth);
  const endPosition = relativePosition(basePosition, direction, growthValue, length, baseSize);

  for (const child of node.children) {
    const childPosition = relativePosition(basePosition, direction, child.treeInfo.growAt, length, baseSize);
    drawTree(ctx, child, childPosition, baseSize);
  }
  
  const depthFactor = (depth / MAX_DEPTH);
  const depthFactor2 = depthFactor * depthFactor;
  const depthFactorInv = 1 - depthFactor;
  const depthFactorInv2 = depthFactorInv * depthFactorInv;
  const depthFactorInv4 = depthFactorInv2 * depthFactorInv2;

  const colorValue = 0.5 + 0.5 * growthValue;
  const endVal = colorValue * depthFactorInv2;
  const startVal = colorValue * depthFactorInv;
  const gradient = ctx.createLinearGradient(nodePosition.x, nodePosition.y, endPosition.x, endPosition.y);
  gradient.addColorStop(0, getColor(startVal));
  gradient.addColorStop(1, getColor(endVal));

  ctx.strokeStyle = gradient;
  ctx.lineWidth = growthValue * depthFactorInv4 * 20;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(nodePosition.x, nodePosition.y);
  ctx.lineTo(endPosition.x, endPosition.y);
  ctx.stroke();
}

const getTimeInSeconds = () => Date.now() / 1000.0;


const getDrawSpace = (ctx: CanvasRenderingContext2D): Rect => {
  const rectSize = Math.min(ctx.canvas.width, ctx.canvas.height, 1000);
  const rectWidth = 3 * rectSize / 4;

  // 2/3rds
  const xOffset = Math.round(3 * (ctx.canvas.width - rectWidth) / 4);
  // bottom
  const yOffset = ctx.canvas.height - rectSize;

  return {
    x: xOffset,
    y: yOffset,
    width: rectWidth,
    height: rectSize,
  };
}

const draw = (ctx: CanvasRenderingContext2D, tree: TreeNode, timeSec: number, deltaSec: number) => {
  const drawSpace = getDrawSpace(ctx);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // ctx.fillStyle = "#000000AA";
  // ctx.fillRect(drawSpace.x, drawSpace.y, drawSpace.width, drawSpace.height);

  const rootPosition = new Victor(drawSpace.x + drawSpace.width / 2, drawSpace.y + drawSpace.height);
  const size = Math.min(drawSpace.width, drawSpace.height);

  updateTree(tree, null, deltaSec);
  drawTree(ctx, tree, rootPosition, size);
};

type TreeAnimationProps = {};
const TreeAnimation = (props: TreeAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tree = useRef<TreeNode>(createTree(null));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const onResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    window.addEventListener('resize', onResize);
    onResize();

    return () => {
      window.removeEventListener('resize', onResize);
    };

  }, [canvasRef]);

  console.log({
    tree: () => tree.current,
    treeRef: tree,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    if (!tree.current) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let animationFrameId: number;
    const startTime = getTimeInSeconds();
    let lastFrame = startTime;

    const render = () => {
      const time = getTimeInSeconds();
      const delta = time - lastFrame;
      lastFrame = time;

      draw(context, tree.current, time - startTime, delta);
      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw, canvasRef.current, tree.current]);

  return <canvas ref={canvasRef} className="w-full max-w-full h-full" {...props} />;
};

export default TreeAnimation;
