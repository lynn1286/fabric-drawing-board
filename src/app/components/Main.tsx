'use client';

import { useEffect } from 'react';
import { fabric } from 'fabric';
import Editor from '@/core';
import WorkspacePlugin from '@/core/plugin/WorkspacePlugin';

const Main = () => {
  useEffect(() => {
    const canvasEditor = new Editor();

    // 初始化fabric
    const canvas = new fabric.Canvas('canvas', {
      fireRightClick: true, // 启用右键，button的数字为3
      stopContextMenu: true, // 禁止默认右键菜单
      controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
    });
    // 初始化编辑器
    canvasEditor.init(canvas);
    // 通过插件的形式拓展功能
    canvasEditor.use(WorkspacePlugin as unknown as IPluginClass);
  }, []);

  return (
    <div className="flex-1 bg-[#f1f1f1]" id="workspace">
      <div className="relative h-full w-full">
        <div className="pointer-events-none absolute z-[2] h-full w-full shadow-inside-shadow"></div>
        <canvas id="canvas"></canvas>
      </div>
    </div>
  );
};

export default Main;
