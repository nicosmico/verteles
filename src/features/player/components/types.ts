export interface PlayerProps {
  url: string;
  onError?: (errorMsg: string) => void;
  onBuffering?: (buffering: boolean) => void;
}
