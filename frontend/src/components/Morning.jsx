import Mist from '../scene/Mist';
import { useAmbientSun } from '../scene/sun';
import { useTier } from '../scene/tier';
import '../scene/scene.css';

/**
 * The morning behind every inner page: the same sun as the journey, standing
 * where the visitor's own clock puts it, and a little mist along the ground.
 */
export default function Morning({ mist = true }) {
  const tier = useTier();
  useAmbientSun();
  return (
    <div className="morning" aria-hidden="true">
      {mist && <Mist bands={tier === 'full' ? 2 : 1} />}
    </div>
  );
}
