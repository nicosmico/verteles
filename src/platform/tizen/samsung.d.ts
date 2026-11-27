// The subset of Samsung's TV globals Verteles uses. They exist only on a TV,
// so every access goes through optional chaining and may come back undefined.

export interface AvPlayListener {
  oncurrentplaytime?(milliseconds: number): void;
  onerror?(error: unknown): void;
  onstreamcompleted?(): void;
}

export interface AvPlay {
  open(url: string): void;
  close(): void;
  prepareAsync(onSuccess: () => void, onError: (error: unknown) => void): void;
  play(): void;
  stop(): void;
  setDisplayRect(x: number, y: number, width: number, height: number): void;
  setDisplayMethod(method: string): void;
  setListener(listener: AvPlayListener): void;
}

export interface SamsungWebApis {
  avplay?: AvPlay;
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
