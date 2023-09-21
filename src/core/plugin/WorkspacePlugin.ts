import { fabric } from 'fabric';
import { throttle } from 'lodash-es';
import type Editor from '../core';

type IEditor = Editor;

/**
 * @description: 工作区插件
 * @return {*}
 */
class WorkspacePlugin {
  /**
   * @description: 画布
   * @return {*}
   */
  public canvas: fabric.Canvas | undefined;

  /**
   * @description: 编辑器
   * @return {*}
   */
  public editor: IEditor;

  /**
   * @description: 插件名
   * @return {*}
   */
  static pluginName = 'WorkspacePlugin';

  /**
   * @description: 事件集合
   * @return {*}
   */
  static events = ['sizeChange'];

  /**
   * @description: API 集合
   * @return {*}
   */
  static apis = ['big', 'small', 'auto', 'one', 'setSize'];

  /**
   * @description: 工作区元素
   * @return {*}
   */
  workspaceEl: HTMLElement | undefined;

  /**
   * @description: 工作区
   * @return {*}
   */
  workspace: null | fabric.Rect | undefined;

  /**
   * @description: 配置
   * @return {*}
   */
  option: { width: number; height: number } | undefined;

  /**
   * @description: 构造函数
   * @param {fabric} canvas
   * @param {IEditor} editor
   * @return {*}
   */
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
    this.init({
      width: 1200,
      height: 2000,
    });
  }

  /**
   * @description: 初始化工作区
   * @param {object} option
   * @return {*}
   */
  init(option: { width: number; height: number }) {
    const workspaceEl = document.querySelector('#workspace') as HTMLElement;

    if (!workspaceEl) {
      throw new Error('#workspace 元素丢失,请检查!');
    }
    this.workspaceEl = workspaceEl;
    this.workspace = null;
    this.option = option;
    this._initBackground();
    this._initWorkspace();
    this._initResizeObserve();
    this._bindWheel();
  }

  /**
   * @description: 初始化背景
   * @return {*}
   */
  _initBackground() {
    if (!this.canvas) throw new Error('请检查是否正确初始化画布');
    if (!this.workspaceEl) throw new Error('#workspace 元素丢失,请检查!');

    this.canvas.backgroundImage = '';
    this.canvas.setWidth(this.workspaceEl.offsetWidth);
    this.canvas.setHeight(this.workspaceEl.offsetHeight);
  }

  /**
   * @description: 初始化画布工作区
   * @return {*}
   */
  _initWorkspace() {
    if (!this.canvas) throw new Error('请检查是否正确初始化画布');

    const { width, height } = this.option ?? { width: 1200, height: 2000 };

    const workspace = new fabric.Rect({
      // @ts-ignore
      id: 'workspace', // 重要标识符
      fill: 'rgba(255,255,255,1)',
      width,
      height,
    });
    workspace.set('selectable', false);
    workspace.set('hasControls', false);
    workspace.hoverCursor = 'default';
    this.canvas.add(workspace);
    this.canvas.renderAll();

    this.workspace = workspace;
    this.auto();
  }

  /**
   * @description: 获取缩放值
   * @return {*}
   */
  _getScale() {
    if (!this.canvas) throw new Error('请检查是否正确初始化画布');
    if (!this.workspaceEl) throw new Error('#workspace 元素丢失,请检查!');

    const { width, height } = this.option ?? { width: 900, height: 2000 };

    const viewPortWidth = this.workspaceEl.offsetWidth;
    const viewPortHeight = this.workspaceEl.offsetHeight;

    // 如果工作区的宽高比小于画布的宽高比, 则按照宽度缩放
    if (viewPortWidth / viewPortHeight < width / height) {
      return viewPortWidth / width;
    }

    // 按照高度缩放
    return viewPortHeight / height;
  }

  /**
   * @description: 设置自动缩放
   * @param {number} scale
   * @param {function} cb
   * @return {*}
   */
  setZoomAuto(scale: number, cb?: (left?: number, top?: number) => void) {
    const { workspaceEl } = this;
    if (!this.canvas) throw new Error('请检查是否正确初始化画布');
    if (!workspaceEl) throw new Error('#workspace 元素丢失,请检查!');

    const width = workspaceEl.offsetWidth;
    const height = workspaceEl.offsetHeight;
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    const center = this.canvas.getCenter();
    this.canvas.setViewportTransform(fabric.iMatrix.concat());
    this.canvas.zoomToPoint(new fabric.Point(center.left, center.top), scale);
    if (!this.workspace) return;
    this.setCenterFromObject(this.workspace);

    // 超出画布不展示
    this.workspace.clone((cloned: fabric.Rect) => {
      if (!this.canvas) throw new Error('请检查是否正确初始化画布');

      this.canvas.clipPath = cloned;
      this.canvas.requestRenderAll();
    });

    if (cb) cb(this.workspace.left, this.workspace.top);
  }

  /**
   * @description: 设置画布中心到指定对象中心点上
   * @param {fabric} obj
   * @return {*}
   */
  setCenterFromObject(obj: fabric.Rect) {
    const { canvas } = this;
    if (!canvas) throw new Error('请检查是否正确初始化画布');

    const objCenter = obj.getCenterPoint();
    const viewportTransform = canvas.viewportTransform;
    if (canvas.width === undefined || canvas.height === undefined || !viewportTransform) return;
    viewportTransform[4] = canvas.width / 2 - objCenter.x * viewportTransform[0];
    viewportTransform[5] = canvas.height / 2 - objCenter.y * viewportTransform[3];
    canvas.setViewportTransform(viewportTransform);
    canvas.renderAll();
  }

  /**
   * @description: 监听页面尺寸变化
   * @return {*}
   */
  _initResizeObserve() {
    if (!this.workspaceEl) return;

    const resizeObserver = new ResizeObserver(
      throttle(() => {
        this.auto();
      }, 50),
    );
    resizeObserver.observe(this.workspaceEl);
  }

  /**
   * @description: 监听鼠标滚轮事件
   * @return {*}
   */
  _bindWheel() {
    if (!this.canvas) return;

    this.canvas.on('mouse:wheel', function (this: fabric.Canvas, opt) {
      const delta = opt.e.deltaY;
      let zoom = this.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      const center = this.getCenter();
      this.zoomToPoint(new fabric.Point(center.left, center.top), zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
  }

  /**
   * @description: 对外暴露放大 API
   * @return {*}
   */
  big() {
    if (!this.canvas) return;

    let zoomRatio = this.canvas.getZoom();
    zoomRatio += 0.05;
    const center = this.canvas.getCenter();
    this.canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoomRatio);
  }

  /**
   * @description: 对外暴露缩小 API
   * @return {*}
   */
  small() {
    if (!this.canvas) return;

    let zoomRatio = this.canvas.getZoom();
    zoomRatio -= 0.05;
    const center = this.canvas.getCenter();
    this.canvas.zoomToPoint(
      new fabric.Point(center.left, center.top),
      zoomRatio < 0 ? 0.01 : zoomRatio,
    );
  }

  /**
   * @description: 对外暴露自动缩放 API
   * @return {*}
   */
  auto() {
    const scale = this._getScale();
    this.setZoomAuto(scale - 0.08);
  }

  // 1:1 放大
  /**
   * @description: 对外暴露 1:1 放大 API
   * @return {*}
   */
  one() {
    if (!this.canvas) return;

    this.setZoomAuto(0.8 - 0.08);
    this.canvas.requestRenderAll();
  }

  /**
   * @description: 对外暴露设置尺寸 API
   * @param {number} width
   * @param {number} height
   * @return {*}
   */
  setSize(width: number, height: number) {
    if (!this.canvas) return;

    this._initBackground();
    this.option!.width = width;
    this.option!.height = height;
    // 重新设置 workspace
    this.workspace = this.canvas
      .getObjects()
      .find((item) => (item as any).id === 'workspace') as fabric.Rect;
    this.workspace.set('width', width);
    this.workspace.set('height', height);
    this.auto();
  }

  static destroy() {
    console.log('[WorkspacePlugin]: WorkspacePlugin 卸载');
  }
}

export default WorkspacePlugin;
