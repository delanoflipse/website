"use client";

import { useEffect, useRef } from "react";

import { TreeNode, createTreeNode, updateTree } from "./TreeAnimationState";
import { drawTree } from "./TreeAnimationRender";


const draw = (ctx: CanvasRenderingContext2D, tree: TreeNode, timeSec: number, deltaSec: number) => {
  updateTree(tree, null, deltaSec);
  drawTree(ctx, tree);
};

const getTimeInSeconds = () => Date.now() / 1000.0;

type TreeAnimationProps = {};
const TreeAnimation = (props: TreeAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tree = useRef<TreeNode>(createTreeNode(null, true));

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
  }, []);

  return <canvas ref={canvasRef} className="w-full max-w-full h-full" {...props} />;
};

export default TreeAnimation;
