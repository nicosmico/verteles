// The subset of Samsung's TV globals Verteles uses. They exist only on a TV,
// so every access goes through optional chaining and may come back undefined.

export interface SamsungWebApis {
  productinfo?: {
    getRealModel?(): string;
    getFirmware?(): string;
  };
}

export interface TizenApis {
  systeminfo?: {
    getCapability?(key: string): unknown;
  };
  tvinputdevice?: {
    registerKey?(keyName: string): void;
  };
  application?: {
    getCurrentApplication?(): { exit(): void };
  };
}

export interface SamsungGlobals {
  webapis?: SamsungWebApis;
  tizen?: TizenApis;
}
