import React, { useState } from 'react';
import { Icon } from './';
import { ICONS } from '@/constants/design';
import { useUIStore } from '@/stores/ui.store';

export interface MatchBookingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'chat' | 'approach' | 'confirm';

/**
 * MatchBookingGuideModal Component
 *
 * Standalone modal showing step-by-step guide for match confirmation workflow.
 * Horizontal swipeable carousel with 3 steps.
 * Displays before ConfirmMatchModal for first-time users.
 */
export const MatchBookingGuideModal: React.FC<MatchBookingGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('chat');
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const setHideMatchBookingGuide = useUIStore((state) => state.setHideMatchBookingGuide);

  const steps: Step[] = ['chat', 'approach', 'confirm'];
  const stepIndex = steps.indexOf(currentStep);

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1]);
    } else {
      handleContinue();
    }
  };

  const handlePrevious = () => {
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1]);
    }
  };

  const handleContinue = () => {
    if (dontShowAgain) {
      setHideMatchBookingGuide(true);
    }
    onClose();
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDontShowAgain(e.target.checked);
  };

  // Step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'chat':
        return (
          <div className="flex flex-col items-center text-center w-full px-4">
            {/* Icon */}
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Icon name={ICONS.chat_bubble} className="text-white" size="3xl" />
              </div>
              {/* Decorative dots */}
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-300 animate-pulse" />
              <div className="absolute -bottom-1 -left-3 w-4 h-4 rounded-full bg-blue-400 animate-pulse delay-100" />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Trao đổi với đội bạn
            </h3>

            {/* Description */}
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm">
              Nhắn tin với admin đội đối thủ để thống nhất{' '}
              <span className="font-semibold text-blue-600 dark:text-blue-400">ngày, giờ</span> và{' '}
              <span className="font-semibold text-blue-600 dark:text-blue-400">địa điểm</span> thi đấu
            </p>

            {/* Tip box */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 w-full">
              <div className="flex items-start gap-3">
                <Icon name="lightbulb" className="text-blue-500 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Mẹo</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Nên trao đổi rõ ràng về loại sân (5 người/7 người) và khung giờ mong muốn
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'approach':
        return (
          <div className="flex flex-col items-center w-full px-4">
            {/* Title */}
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">
              Chọn cách thức chốt kèo
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Tình trạng của bạn hiện tại?
            </p>

            {/* Two approach cards */}
            <div className="grid grid-cols-2 gap-4 w-full">
              {/* Option A: Have stadium */}
              <div
                className="relative p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border-2 border-green-200 dark:border-green-800/50 cursor-pointer hover:border-green-400 dark:hover:border-green-600 transition-all active:scale-95"
                onClick={handleNext}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 mb-3">
                    <Icon name={ICONS.stadium} className="text-white" size="xl" />
                  </div>
                  <h4 className="text-base font-bold text-green-700 dark:text-green-300 mb-2">
                    Đã có sân
                  </h4>
                  <p className="text-xs text-green-600 dark:text-green-400 leading-snug">
                    Biết sân sẽ đá và có thông tin rõ ràng
                  </p>
                </div>
                {/* Check indicator */}
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <Icon name="check" size="xs" className="text-white" />
                </div>
              </div>

              {/* Option B: Need to agree */}
              <div
                className="relative p-5 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl border-2 border-orange-200 dark:border-orange-800/50 cursor-pointer hover:border-orange-400 dark:hover:border-orange-600 transition-all active:scale-95"
                onClick={handleNext}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 mb-3">
                    <Icon name={ICONS.groups} className="text-white" size="xl" />
                  </div>
                  <h4 className="text-base font-bold text-orange-700 dark:text-orange-300 mb-2">
                    Chưa có sân
                  </h4>
                  <p className="text-xs text-orange-600 dark:text-orange-400 leading-snug">
                    Cần trao đổi thêm về thời gian, địa điểm
                  </p>
                </div>
                {/* Check indicator */}
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                  <Icon name="check" size="xs" className="text-white" />
                </div>
              </div>
            </div>

            {/* Instruction */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
              Chọn một trong hai trường hợp trên để tiếp tục
            </p>
          </div>
        );

      case 'confirm':
        return (
          <div className="flex flex-col items-center text-center w-full px-4">
            {/* Icon */}
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Icon name={ICONS.handshake} className="text-white" size="3xl" />
              </div>
              {/* Decorative dots */}
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-300 animate-pulse" />
              <div className="absolute -bottom-1 -left-3 w-4 h-4 rounded-full bg-purple-400 animate-pulse delay-100" />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Chốt kèo trận đấu
            </h3>

            {/* Description */}
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm mb-6">
              Sau khi đã thống nhất, nhập{' '}
              <span className="font-semibold text-purple-600 dark:text-purple-400">ngày, giờ</span> và{' '}
              <span className="font-semibold text-purple-600 dark:text-purple-400">chọn sân</span> để hoàn tất
            </p>

            {/* Steps summary */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-200 dark:border-blue-800">
                <Icon name={ICONS.chat_bubble} size="xs" className="text-blue-500" />
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Chat</span>
              </div>
              <Icon name="arrow_forward" size="xs" className="text-gray-400" />
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800">
                <Icon name={ICONS.stadium} size="xs" className="text-green-500" />
                <span className="text-xs font-medium text-green-700 dark:text-green-300">Thống nhất</span>
              </div>
              <Icon name="arrow_forward" size="xs" className="text-gray-400" />
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-full border border-purple-200 dark:border-purple-800">
                <Icon name={ICONS.handshake} size="xs" className="text-purple-500" />
                <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Chốt kèo</span>
              </div>
            </div>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={handleContinue}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-surface-dark rounded-3xl p-6 pb-safe animate-slide-up shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <Icon name="school" className="text-white text-sm" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Hướng dẫn chốt kèo
              </h3>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                Bước {stepIndex + 1} / {steps.length}
              </p>
            </div>
          </div>
          <button
            onClick={handleContinue}
            className="size-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            <Icon name="close" className="text-gray-500 dark:text-gray-400 text-sm" />
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === stepIndex
                  ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-500'
                  : index < stepIndex
                  ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-500/30'
                  : 'w-2 bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="min-h-[320px] flex items-center justify-center px-4">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3 mt-6 px-4">
          {/* Previous button */}
          {stepIndex > 0 ? (
            <button
              onClick={handlePrevious}
              className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-all active:scale-95"
            >
              Quay lại
            </button>
          ) : (
            <div className="flex-1" />
          )}

          {/* Next/Continue button */}
          <button
            onClick={handleNext}
            className="flex-[2] py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg shadow-blue-500/25 active:scale-95 flex items-center justify-center gap-2"
          >
            {stepIndex === steps.length - 1 ? (
              <>
                <Icon name="check_circle" size="sm" />
                Đã hiểu
              </>
            ) : (
              <>
                Tiếp tục
                <Icon name="arrow_forward" size="sm" />
              </>
            )}
          </button>
        </div>

        {/* Checkbox */}
        {stepIndex === steps.length - 1 && (
          <label className="flex items-center justify-center gap-2 mt-4 px-4 cursor-pointer">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={handleCheckboxChange}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Không hiện hướng dẫn này lại
            </span>
          </label>
        )}
      </div>
    </div>
  );
};

export default MatchBookingGuideModal;
