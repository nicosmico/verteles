import React from 'react';
import { isTizen } from '../../../utils/platform';
import { TizenPlayer } from './TizenPlayer';
import { WebPlayer } from './WebPlayer';
import type { PlayerProps } from './types';

export const VideoPlayer: React.FC<PlayerProps> = (props) => {
  const tizenEnv = isTizen();

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        // In web view we use black, in Tizen transparency is preferred for the root layer.
        backgroundColor: tizenEnv ? 'transparent' : 'black',
      }}
    >
      {tizenEnv ? <TizenPlayer {...props} /> : <WebPlayer {...props} />}
    </div>
  );
};
