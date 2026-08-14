import { useEffect, useState, useCallback } from 'react';
import { useOnboardingStore } from '../../stores/useOnboardingStore';
import { useUIStore } from '../../stores/useUIStore';
import { translations } from '../../utils/translations';
import { ArrowRight, ArrowLeft, X, PartyPopper } from 'lucide-react';

export default function OnboardingTour() {
  const { currentStep, steps, nextStep, prevStep, skipTour, active } =
    useOnboardingStore();
  const language = useUIStore((s) => s.language);
  const [targetRect, setTargetRect] = useState(null);
  const step = steps[currentStep];

  const updatePosition = useCallback(() => {
    if (!step || !step.targetId) {
      setTargetRect(null);
      return;
    }
    const el = document.getElementById(step.targetId);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect({
        top: rect.top - 6,
        left: rect.left - 6,
        width: rect.width + 12,
        height: rect.height + 12,
      });
    } else {
      setTargetRect(null);
    }
  }, [step]);

  useEffect(() => {
    updatePosition();
    window.addEventListener('resize', updatePosition);
    const interval = setInterval(updatePosition, 500); // re-check in case of layout shifts
    return () => {
      window.removeEventListener('resize', updatePosition);
      clearInterval(interval);
    };
  }, [updatePosition, currentStep]);

  if (!active || !step) return null;

  const isLast = currentStep === steps.length - 1;
  const t = translations[language] || translations.en;

  // Calculate tooltip position relative to spotlight, clamped to stay fully on screen
  const getTooltipStyle = () => {
    if (!targetRect) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'fixed' };
    }
    const pos = step.position || 'bottom';
    const tooltipWidth = 340; // match CSS max-width
    const gap = 16;

    let left = targetRect.left;
    let top = targetRect.top;

    switch (pos) {
      case 'right':
        left = targetRect.left + targetRect.width + gap;
        top = targetRect.top;
        // If overflowing right edge, position on the left instead
        if (left + tooltipWidth > window.innerWidth) {
          left = targetRect.left - tooltipWidth - gap;
        }
        break;
      case 'left':
        left = targetRect.left - tooltipWidth - gap;
        top = targetRect.top;
        // If overflowing left edge, position on the right instead
        if (left < 16) {
          left = targetRect.left + targetRect.width + gap;
        }
        break;
      case 'top':
        top = targetRect.top - gap - 180; // approximate tooltip height
        left = targetRect.left + (targetRect.width - tooltipWidth) / 2;
        break;
      case 'bottom':
      default:
        top = targetRect.top + targetRect.height + gap;
        left = targetRect.left + (targetRect.width - tooltipWidth) / 2;
        break;
    }

    // Safety margins: clamp tooltip coordinates inside screen bounds
    left = Math.max(16, Math.min(window.innerWidth - tooltipWidth - 16, left));
    top = Math.max(16, Math.min(window.innerHeight - 250 - 16, top));

    return {
      top,
      left,
      position: 'fixed',
    };
  };

  // Localized texts
  const tourTitle = isLast
    ? t.tourDoneTitle
    : t[`tour${currentStep + 1}Title`] || step.title;
  const tourText = isLast
    ? t.tourDoneText
    : t[`tour${currentStep + 1}Text`] || step.text;

  return (
    <>
      {/* Spotlight */}
      {targetRect && (
        <div
          className="onboarding-spotlight"
          style={{
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
          }}
        />
      )}

      {/* Tooltip */}
      <div className="onboarding-tooltip" style={getTooltipStyle()}>
        {/* Close button */}
        <button
          onClick={skipTour}
          className="btn-icon"
          style={{ position: 'absolute', top: 8, right: 8 }}
        >
          <X size={16} />
        </button>

        {isLast ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <PartyPopper size={24} style={{ color: 'var(--warning)' }} />
              <span className="onboarding-tooltip-title">{tourTitle}</span>
            </div>
            <p className="onboarding-tooltip-text">{tourText}</p>
          </>
        ) : (
          <>
            <div className="onboarding-tooltip-title">{tourTitle}</div>
            <p className="onboarding-tooltip-text">{tourText}</p>
          </>
        )}

        <div className="onboarding-tooltip-footer">
          {/* Step dots */}
          <div className="onboarding-dots">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`onboarding-dot ${i === currentStep ? 'active' : ''}`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 8 }}>
            {currentStep > 0 && (
              <button className="btn btn-ghost btn-sm" onClick={prevStep}>
                <ArrowLeft size={14} /> {t.back}
              </button>
            )}
            <button className="btn btn-primary btn-sm" onClick={nextStep}>
              {isLast ? t.getStarted : t.next} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
