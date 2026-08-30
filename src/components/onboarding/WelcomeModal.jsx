import { useOnboardingStore } from '../../stores/useOnboardingStore';
import { useUIStore } from '../../stores/useUIStore';
import { useAuthSession } from '../../hooks/useAuthSession';
import { translations } from '../../utils/translations';
import { Sparkles } from 'lucide-react';

export default function WelcomeModal() {
  const { session } = useAuthSession();
  const startTour = useOnboardingStore((s) => s.startTour);
  const skipTour = useOnboardingStore((s) => s.skipTour);
  const language = useUIStore((s) => s.language);

  if (!session || (typeof window !== 'undefined' && window.location.hash.includes('signin'))) {
    return null;
  }

  const t = translations[language] || translations.en;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ textAlign: 'center', maxWidth: 480 }}>
        <div
          style={{
            width: 72,
            height: 72,
            margin: '0 auto 20px',
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Sparkles size={36} color="white" />
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>
          {t.welcomeTitle}
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 8 }}>
          {t.welcomeSubtitle}
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: 24 }}>
          {t.welcomeDesc}
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={startTour} style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
            <Sparkles size={18} /> {t.startTour}
          </button>
          <button className="btn btn-ghost" onClick={skipTour} style={{ padding: '12px 20px' }}>
            {t.skipExplore}
          </button>
        </div>
      </div>
    </div>
  );
}
