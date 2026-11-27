// The subset of Samsung's TV globals Verteles uses. They exist only on a TV,
// so every access goes through `samsungApis()` and may come back undefined.

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
}
