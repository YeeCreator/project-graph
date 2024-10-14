import { createStore, Store } from "@tauri-apps/plugin-store";

/**
 * 设置相关的操作
 * 有数据持久化机制
 */
export namespace Settings {
  let store: Store;
  export type Settings = {
    // 视觉相关
    lineStyle: "stright" | "bezier" | "vertical";
    theme: "";
    showGrid: boolean;
    windowBackgroundAlpha: number;
    showDebug: boolean;
    alwaysShowDetails: boolean;
    // 物理相关
    enableCollision: boolean;
    scaleExponent: number;
    moveAmplitude: number;
    moveFriction: number;
    // 性能相关
    historySize: number;
    // 自动命名相关
    autoNamerTemplate: string;
    // github 相关
    githubToken: string;
    githubUser: string;
  };
  const defaultSettings: Settings = {
    // 视觉相关
    lineStyle: "stright",
    theme: "",
    showGrid: true,
    windowBackgroundAlpha: 0.8,
    showDebug: true,
    alwaysShowDetails: false,
    // 物理相关
    enableCollision: true,
    scaleExponent: 1.1,
    moveAmplitude: 2,
    moveFriction: 0.1,
    // 性能相关
    historySize: 20,
    // 自动命名相关
    autoNamerTemplate: "...",
    // github 相关
    githubToken: "",
    githubUser: "",
  };

  export async function init() {
    store = await createStore("settings.json");
  }

  export async function get<K extends keyof Settings>(
    key: K,
  ): Promise<Settings[K]> {
    return (await store.get<Settings[K]>(key)) || defaultSettings[key];
  }

  const callbacks: {
    [key: string]: Array<(value: any) => void>;
  } = {};

  export function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    store.set(key, value);
    store.save();

    // 调用所有监听该键的回调函数
    if (callbacks[key]) {
      callbacks[key].forEach((callback) => callback(value));
    }
  }

  /**
   * 监听某个设置的变化，监听后会调用一次回调函数
   * @param key 要监听的设置键
   * @param callback 设置变化时的回调函数
   */
  export function watch<K extends keyof Settings>(
    key: K,
    callback: (value: Settings[K]) => void,
  ) {
    if (!callbacks[key]) {
      callbacks[key] = [];
    }
    callbacks[key].push(callback);
    get(key).then((value) => callback(value));
  }
}
