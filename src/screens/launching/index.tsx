import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { launchingService } from '@/services/launching.service';
import { useLaunchingStore, useLaunchingActions } from '@/stores/launching.store';

// Extended sports icons for circular ring animation
const SPORTS_ICONS = [
  'sports_soccer',
  'sports_basketball',
  'sports_volleyball',
  'sports',
  'sports_handball',
  'sports_tennis',
  'sports_cricket',
  'sports_golf'
];

// Particle component for background effect
interface Particle {
  id: number;
  left: string;
  size: number;
  delay: number;
  duration: number;
}

// Pre-generate particles with fixed values (seeded positions)
const generateParticles = (): Particle[] => {
  const particles: Particle[] = [];
  for (let i = 0; i < 20; i++) {
    // Use a simple pseudo-random based on index for consistency
    const seed = i * 7919; // Prime number for distribution
    const left = (seed % 100);
    const size = 2 + (seed % 4);
    const delay = (seed % 80) / 10;
    const duration = 6 + (seed % 4);
    particles.push({
      id: i,
      left: `${left}%`,
      size,
      delay,
      duration,
    });
  }
  return particles;
};

const PARTICLES = generateParticles();

function ParticleBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLES.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-[#3b82f6]/20 animate-particle-float"
          style={{
            left: particle.left,
            bottom: '-20px',
            width: particle.size,
            height: particle.size,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

// Sports ring component with rotating icons
function SportsRing() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SPORTS_ICONS.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const radius = 80;
  const centerX = 50;
  const centerY = 50;

  return (
    <div className="relative w-48 h-48 mx-auto mb-8">
      {/* Rotating ring */}
      <div className="absolute inset-0 animate-sports-ring">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Dashed circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius / 2}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="0.5"
            strokeDasharray="2 4"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Sports icons positioned in circle */}
      {SPORTS_ICONS.map((icon, index) => {
        const angle = (index * 360) / SPORTS_ICONS.length - 90;
        const radians = (angle * Math.PI) / 180;
        const x = 50 + 35 * Math.cos(radians);
        const y = 50 + 35 * Math.sin(radians);

        const isActive = index === activeIndex;

        return (
          <div
            key={icon}
            className="absolute transition-all duration-500"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Pulse ring effect for active icon */}
            {isActive && (
              <div className="absolute inset-0 -m-2 animate-pulse-ring">
                <div className="w-full h-full rounded-full bg-[#3b82f6]/30" />
              </div>
            )}

            {/* Icon */}
            <div
              className={`material-icons transition-all duration-500 ${
                isActive
                  ? 'text-[#3b82f6] text-2xl scale-125'
                  : 'text-gray-600 text-lg scale-100'
              }`}
            >
              {icon}
            </div>
          </div>
        );
      })}

      {/* Center glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-[#3b82f6]/20 blur-xl animate-pulse" />
      </div>
    </div>
  );
}

// Logo section with pulse animation
function LogoSection() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold mb-3 tracking-wide text-white animate-logo-pulse">
        CÁP KÈO SPORT
      </h1>
      <p className="text-gray-400 text-sm tracking-wider">
        Kết nối đam mê thể thao
      </p>
    </div>
  );
}

// Progress bar component
function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full max-w-xs mx-auto mb-8">
      <div className="relative h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white/30 animate-pulse" />
        </div>
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>Đang tải...</span>
        <span>{Math.round(progress)}%</span>
      </div>
    </div>
  );
}

// Loading state component
function LoadingState({ progress }: { progress: number }) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-dvh bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 text-white px-6 pt-safe pb-safe overflow-hidden">
      <ParticleBackground />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full max-w-md">
        <SportsRing />
        <LogoSection />
        <ProgressBar progress={progress} />

        {/* Loading dots animation */}
        <div className="flex gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-[#3b82f6] rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>

      {/* Version info */}
      <div className="relative z-10 mt-auto mb-4 text-xs text-gray-600">
        Version 1.0.0
      </div>
    </div>
  );
}

// Error state component
function ErrorState({ error, onRetry, onLoginAgain }: { error: string | null; onRetry: () => void; onLoginAgain: () => void }) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-dvh bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 text-white px-6 pt-safe pb-safe overflow-hidden">
      <ParticleBackground />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full max-w-md">
        {/* Error icon with animation */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
          <div className="material-icons text-red-500 text-7xl relative">
            error_outline
          </div>
        </div>

        {/* Error message */}
        <h2 className="text-xl font-semibold mb-3 text-center">
          Không thể tải dữ liệu
        </h2>
        <p className="text-gray-400 text-center mb-3 max-w-xs">
          {error || 'Có lỗi xảy ra khi tải dữ liệu'}
        </p>
        <p className="text-gray-500 text-sm mb-8 text-center">
          Kiểm tra kết nối mạng và thử lại
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <button
            onClick={onRetry}
            className="flex-1 px-6 py-3.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#3b82f6]/20 hover:shadow-[#3b82f6]/30 active:scale-95"
          >
            <span className="material-icons text-xl">refresh</span>
            Thử lại
          </button>
          <button
            onClick={onLoginAgain}
            className="flex-1 px-6 py-3.5 bg-gray-700/50 hover:bg-gray-700 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-gray-600/50 active:scale-95"
          >
            <span className="material-icons text-xl">login</span>
            Đăng nhập lại
          </button>
        </div>
      </div>

      {/* Version info */}
      <div className="relative z-10 mt-auto mb-4 text-xs text-gray-600">
        Version 1.0.0
      </div>
    </div>
  );
}

// Main launching screen component
export default function LaunchingScreen() {
  const navigate = useNavigate();
  const { status, error, retryCount } = useLaunchingStore();
  const { setStatus, setError, incrementRetry, setFontsLoaded } = useLaunchingActions();
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Simulate loading progress
  useEffect(() => {
    if (status === 'loading' || status === 'auth_checking' || status === 'loading_data') {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [status]);

  // Reset progress when status changes
  useEffect(() => {
    if (status === 'idle' || status === 'error') {
      setLoadingProgress(0);
    } else if (status === 'ready') {
      setLoadingProgress(100);
    }
  }, [status]);

  // Main initialization effect
  useEffect(() => {
    let mounted = true;

    const initializeApp = async () => {
      try {
        // Step 1: Load fonts
        setStatus('loading');
        await launchingService.loadFonts();
        if (!mounted) return;
        setFontsLoaded();
        setLoadingProgress(30);

        // Step 2: Check auth and load data
        setStatus('auth_checking');
        const result = await launchingService.initialize(retryCount);

        if (!mounted) return;
        setLoadingProgress(100);

        if (result.success) {
          if (result.shouldNavigate) {
            if (result.navigateTo === 'login') {
              navigate('/login', { replace: true });
            } else if (result.navigateTo === 'dashboard') {
              navigate('/dashboard', { replace: true });
            }
          } else {
            setStatus('ready');
          }
        } else {
          // Initialization failed, show error
          setError(result.error || 'Không thể tải dữ liệu');
        }
      } catch (err: unknown) {
        if (!mounted) return;
        const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
        setError(errorMessage);
      }
    };

    initializeApp();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryCount]);

  // Handle retry
  const handleRetry = () => {
    setError(null);
    incrementRetry();
  };

  // Handle login again
  const handleLoginAgain = () => {
    // Clear auth data and navigate to login
    launchingService.reset();
    navigate('/login', { replace: true });
  };

  // Render based on status
  if (status === 'error') {
    return <ErrorState error={error} onRetry={handleRetry} onLoginAgain={handleLoginAgain} />;
  }

  return <LoadingState progress={loadingProgress} />;
}
