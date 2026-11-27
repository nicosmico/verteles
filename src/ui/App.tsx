import { platform } from '@platform';
import { Diagnostics } from './diagnostics/Diagnostics';
import { Stage } from './stage/Stage';

export function App() {
  return (
    <Stage>
      <Diagnostics info={platform.systemInfo()} />
    </Stage>
  );
}
