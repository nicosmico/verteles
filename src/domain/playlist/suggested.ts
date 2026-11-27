/** A Lista sugerida: an imported Lista the app offers ready to add. See CONTEXT.md. */
export interface SuggestedPlaylist {
  name: string;
  url: string;
  /** Keep only Channels of this País. */
  country: string;
}

/** Added and active by default. Curated by Alplox; the source also has a few non-Chilean channels. */
export const CHILE: SuggestedPlaylist = {
  name: 'Chile',
  url: 'https://raw.githubusercontent.com/Alplox/json-teles/refs/heads/main/channels.m3u',
  country: 'CL',
};
