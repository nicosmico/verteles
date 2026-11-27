/** A key of the TV remote, independent of how each Platform reports it. */
export type RemoteKey =
  | 'Up'
  | 'Down'
  | 'Left'
  | 'Right'
  | 'Ok'
  | 'Back'
  | 'ChannelUp'
  | 'ChannelDown'
  | 'PlayPause'
  | 'Play'
  | 'Pause'
  | 'Stop'
  | 'Red'
  | 'Green'
  | 'Yellow'
  | 'Blue'
  | `Digit${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`;
