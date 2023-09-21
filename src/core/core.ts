import EventEmitter from 'events';
import hotkeys from 'hotkeys-js';
import type { AsyncSeriesHook } from 'tapable';

/**
 * @description: 封装 fabric
 * @return {*}
 */
class Editor extends EventEmitter {
  /**
   * @description: 画布
   * @return {*}
   */
  canvas: fabric.Canvas | undefined;

  /**
   * @description: 插件集合
   * @return {*}
   */
  private pluginMap: { [propName: string]: IPluginTempl } = {};

  /**
   * @description: 自定义事件
   * @return {*}
   */
  private customEvents: string[] = [];

  /**
   * @description: 自定义 API
   * @return {*}
   */
  private customApis: string[] = [];

  /**
   * @description: 生命周期函数名
   * @return {*}
   */
  private hooks: IEditorHooksType[] = [
    'hookImportBefore',
    'hookImportAfter',
    'hookSaveBefore',
    'hookSaveAfter',
  ];

  /**
   * @description: 钩子实体
   * @return {*}
   */
  private hooksEntity: { [propName: string]: AsyncSeriesHook<string, string> } = {};

  /**
   * @description: 初始化编辑器
   * @param {fabric} canvas
   * @return {*}
   */
  init(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  /**
   * @description: 添加插件
   * @param {IPluginClass} plugin
   * @param {IPluginOption} options
   * @return {*}
   */
  use(plugin: IPluginClass, options: IPluginOption = {}) {
    if (!this.canvas) throw new Error('请检查是否正确初始化画布');

    if (this._checkPlugin(plugin)) {
      this._saveCustomAttr(plugin);
      const pluginRunTime = new plugin(this.canvas, this, options);
      this.pluginMap[plugin.pluginName] = pluginRunTime;
      this._bindingHooks(pluginRunTime);
      Editor._bindingHotkeys(pluginRunTime);
      this._bindingApis(pluginRunTime);
    }
  }

  /**
   * @description: 校验插件
   * @param {IPluginClass} plugin
   * @return {*}
   */
  private _checkPlugin(plugin: IPluginClass) {
    const { pluginName, events = [], apis = [] } = plugin;

    // 检查插件命名
    if (this.pluginMap[pluginName]) {
      throw new Error(
        `[checkPlugin]:  ${pluginName}已存在,请确定您没有重复初始化同个插件或者检查您的插件命名是否存在重复`,
      );
    }

    // 检查事件命名
    events.forEach((eventName: string) => {
      if (this.customEvents.find((info) => info === eventName)) {
        throw new Error(
          `[customEvents]: ${pluginName}插件中已存在${eventName},请检查您的事件命名是否重复`,
        );
      }
    });

    // 检查 api 命名
    apis.forEach((apiName: string) => {
      if (this.customApis.find((info) => info === apiName)) {
        throw new Error(
          `[customApis]: ${pluginName}插件中已存在${apiName},请检查您的API命名是否重复`,
        );
      }
    });

    return true;
  }

  /**
   * @description: 保存插件自定义事件与API
   * @param {IPluginClass} plugin
   * @return {*}
   */
  private _saveCustomAttr(plugin: IPluginClass) {
    const { events = [], apis = [] } = plugin;
    this.customApis = this.customApis.concat(apis);
    this.customEvents = this.customEvents.concat(events);
  }

  /**
   * @description: 绑定hooks方法
   * @param {IPluginTempl} plugin
   * @return {*}
   */
  private _bindingHooks(plugin: IPluginTempl) {
    this.hooks.forEach((hookName) => {
      const hook = plugin[hookName];
      if (hook) {
        this.hooksEntity[hookName].tapPromise(`${plugin.pluginName}${hookName}`, function () {
          // eslint-disable-next-line prefer-rest-params
          return hook.apply(plugin, [...arguments]);
        });
      }
    });
  }

  /**
   * @description: 绑定快捷键
   * @param {IPluginTempl} plugin
   * @return {*}
   */
  private static _bindingHotkeys(plugin: IPluginTempl) {
    plugin?.hotkeys?.forEach((keyName: string) => {
      hotkeys(keyName, { keyup: true }, (e) => plugin.hotkeyEvent(keyName, e));
    });
  }

  /**
   * @description: 代理API事件
   * @param {IPluginTempl} pluginRunTime
   * @return {*}
   */
  private _bindingApis(pluginRunTime: IPluginTempl) {
    // const { apis = [] } = pluginRunTime.constructor;
    const { apis = [] } = pluginRunTime;
    apis.forEach((apiName) => {
      (this as Record<string, any>)[apiName] = function () {
        // eslint-disable-next-line prefer-rest-params
        return pluginRunTime[apiName].apply(pluginRunTime, [...arguments]);
      };
    });
  }
}

export default Editor;
