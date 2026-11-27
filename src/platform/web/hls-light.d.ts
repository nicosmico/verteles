// hls.js ships its light build (no DRM, subtitles or alternate audio) without types; it has the same API.
declare module 'hls.js/light' {
  export * from 'hls.js';
  export { default } from 'hls.js';
}
