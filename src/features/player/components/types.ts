export interface PlayerProps {
  url: string;
  autoplay?: boolean;
  onPlayStateChange?: (playing: boolean) => void;
  onError?: (errorMsg: string) => void;
  onBuffering?: (buffering: boolean) => void;
}
