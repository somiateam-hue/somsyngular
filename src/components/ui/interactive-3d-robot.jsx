import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

const Spline = lazy(() => import('@splinetool/react-spline'));

export function InteractiveRobotSpline({ scene, className = '' }) {
  return (
    <Suspense
      fallback={
        <div className={`w-full h-full flex items-center justify-center ${className}`}
             style={{ background: 'transparent' }}>
          <Loader2 className="animate-spin h-8 w-8" style={{ color: '#A855F7' }} />
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}
