import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { launchingService } from '@/services/launching.service';
import { useLaunchingStore, useLaunchingActions } from '@/stores/launching.store';

// Sports icons for bouncing animation
const SPORTS_ICONS = ['sports_tennis', 'table_tennis', 'sports_volleyball', 'sports_tennis'];

export default function LaunchingScreen() {
  const navigate = useNavigate();
  const { status, error, retryCount } = useLaunchingStore();
  const { setStatus, setError, incrementRetry, setFontsLoaded } = useLaunchingActions();

  const [currentIconIndex, setCurrentIconIndex] = useState(0);

  // Animate sports icons
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prev) => (prev + 1) % SPORTS_ICONS.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

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

        // Step 2: Check auth and load data
        setStatus('auth_checking');
        const result = await launchingService.initialize(retryCount);

        if (!mounted) return;

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
      } catch (err: any) {
        if (!mounted) return;
        setError(err.message || 'Có lỗi xảy ra');
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

  // Render loading state
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-6 pt-safe pb-safe">
      {/* Bouncing sports icons */}
      <div className="flex gap-3 mb-8">
        {SPORTS_ICONS.map((icon, index) => (
          <div
            key={icon}
            className={`material-icons text-4xl transition-all duration-300 ${
              index === currentIconIndex
                ? 'scale-125 text-[#11d473]'
                : 'scale-100 text-gray-500'
            }`}
            style={{
              transform: index === currentIconIndex ? 'translateY(-8px)' : 'translateY(0)',
            }}
          >
            {icon}
          </div>
        ))}
      </div>

      {/* Logo */}
      <h1 className="text-3xl font-bold mb-4 tracking-wide text-center">CÁP KÈO SPORT</h1>

      {/* Loading text with pulse animation */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-[#11d473] rounded-full animate-pulse"></div>
        <p className="text-gray-400 animate-pulse">Đang tải...</p>
      </div>
    </div>
  );

  // Render error state
  const renderError = () => (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-6 pt-safe pb-safe">
      {/* Error icon */}
      <div className="material-icons text-red-500 text-6xl mb-6">error_outline</div>

      {/* Error message */}
      <h2 className="text-xl font-semibold mb-2 text-center">Không thể tải dữ liệu</h2>
      <p className="text-gray-400 text-center mb-8">{error}</p>

      {/* Hint text */}
      <p className="text-gray-500 text-sm mb-8 text-center">
        Kiểm tra kết nối mạng và thử lại
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <button
          onClick={handleRetry}
          className="flex-1 px-6 py-3 bg-[#11d473] hover:bg-[#0ea65e] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-icons text-xl">refresh</span>
          Thử lại
        </button>
        <button
          onClick={handleLoginAgain}
          className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-icons text-xl">login</span>
          Đăng nhập lại
        </button>
      </div>
    </div>
  );

  // Render based on status
  if (status === 'error') {
    return renderError();
  }

  return renderLoading();
}
