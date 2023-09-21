'use client';

import { useEffect } from 'react';
import { fabric } from 'fabric';

const Main = () => {
  useEffect(() => {
    // 初始化fabric
    const canvas = new fabric.Canvas('canvas', {
      fireRightClick: true, // 启用右键，button的数字为3
      stopContextMenu: true, // 禁止默认右键菜单
      controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
    });

    console.log('🚀 ~  : Main -> canvas', canvas);
  }, []);

  return (
    <div className="flex-1">
      <div className="relative h-full w-full">
        <div className="absolute h-full w-full shadow-inside-shadow"></div>
        <canvas id="canvas"></canvas>
      </div>
    </div>
  );
};

export default Main;
