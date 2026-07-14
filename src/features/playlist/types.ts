export interface ParsedChannel {
  id: string;
  name: string;
  url: string;
  logo?: string;
  group?: string;
  fallbackColor?: string;
  fallbackText?: string;
  resolution?: string;
  program?: {
    title: string;
    start: string;
    end: string;
    progress: number;
  };
}

export interface PlaylistData {
  id: string;
  name: string;
  url: string;
  channels: ParsedChannel[];
  favoriteIds: string[];
}
