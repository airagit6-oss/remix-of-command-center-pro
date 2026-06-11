/**
 * Celebration Components - Level Up, Badge Unlock, Trophy Unlock
 * With animations, sounds, and particles
 */

import React, { useEffect, useState } from 'react';
import { X, Sparkles, Trophy, Award } from 'lucide-react';

// ============================================================================
// SOUND EFFECTS UTILITY
// ============================================================================

const SOUNDS = {
  XP_GAIN: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj==',
  LEVEL_UP: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBg==',
  BADGE_UNLOCK: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBg==',
  TROPHY_UNLOCK: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBg==',
};

export function playSound(soundType: keyof typeof SOUNDS, volume: number = 0.5) {
  try {
    const audio = new Audio(SOUNDS[soundType]);
    audio.volume = volume;
    audio.play().catch(() => {
      // Silently fail if audio can't play (e.g., browser autoplay policy)
    });
  } catch (error) {
    console.error('Error playing sound:', error);
  }
}

// ============================================================================
// LEVEL UP CELEBRATION (Full Screen)
// ============================================================================

interface LevelUpProps {
  level: number;
  rank: string;
  onClose: () => void;
}

export const LevelUpCelebration: React.FC<LevelUpProps> = ({ level, rank, onClose }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    playSound('LEVEL_UP', 0.8);

    // Generate particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setParticles(newParticles);

    // Auto close after 3 seconds
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 bg-yellow-400 rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `float-up ${2 + Math.random()}s ease-out forwards`,
          }}
        />
      ))}

      {/* Main celebration box */}
      <div className="relative">
        <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl transform transition-all animate-bounce max-w-md">
          <div className="text-6xl mb-4 animate-spin" style={{ animationDuration: '2s' }}>
            ✨
          </div>

          <h1 className="text-5xl font-black mb-2">LEVEL UP!</h1>
          <p className="text-3xl font-bold mb-4">Level {level}</p>

          <div className="bg-white/20 backdrop-blur rounded-xl p-4 mb-6">
            <p className="text-lg">New Rank Unlocked</p>
            <p className="text-4xl font-black text-yellow-300 mt-2">{rank}</p>
          </div>

          <div className="text-2xl animate-pulse">
            🎉 🏆 🎊 🏆 🎉
          </div>
        </div>

        {/* Floating emojis */}
        <div className="absolute inset-0 pointer-events-none">
          {['🎉', '🏆', '⭐', '✨', '🎊'].map((emoji, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-bounce"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + (i % 2) * 20}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {emoji}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-200px) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// BADGE UNLOCK MODAL
// ============================================================================

interface BadgeUnlockProps {
  badge: {
    name: string;
    icon: string;
    category: string;
    rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  };
  onClose: () => void;
}

export const BadgeUnlockModal: React.FC<BadgeUnlockProps> = ({ badge, onClose }) => {
  useEffect(() => {
    playSound('BADGE_UNLOCK', 0.7);
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const rarityColors = {
    COMMON: 'from-gray-400 to-gray-600',
    RARE: 'from-blue-400 to-blue-600',
    EPIC: 'from-purple-400 to-purple-600',
    LEGENDARY: 'from-yellow-400 to-yellow-600',
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-in fade-in slide-in-from-bottom-4">
      <div className={`bg-gradient-to-br ${rarityColors[badge.rarity]} rounded-2xl p-6 text-white shadow-2xl max-w-xs`}>
        <div className="flex items-center gap-4">
          <div className="text-5xl animate-bounce">{badge.icon}</div>
          <div>
            <p className="text-sm text-white/80">NEW BADGE UNLOCKED!</p>
            <p className="text-xl font-bold">{badge.name}</p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs px-2 py-1 bg-white/20 rounded">{badge.category}</span>
              <span className="text-xs px-2 py-1 bg-white/20 rounded">{badge.rarity}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TROPHY UNLOCK FULL SCREEN
// ============================================================================

interface TrophyUnlockProps {
  trophy: {
    name: string;
    icon: string;
    category: string;
  };
  rank?: number;
  onClose: () => void;
}

export const TrophyUnlockCelebration: React.FC<TrophyUnlockProps> = ({ trophy, rank, onClose }) => {
  useEffect(() => {
    playSound('TROPHY_UNLOCK', 0.9);
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-black/70 to-transparent backdrop-blur-md">
      <div className="text-center">
        {/* Trophy icon - large and animated */}
        <div className="text-9xl mb-6 animate-bounce" style={{ animationDuration: '1s' }}>
          🏆
        </div>

        {/* Trophy name */}
        <h1 className="text-5xl font-black text-white mb-2">TROPHY UNLOCKED!</h1>
        <p className="text-3xl text-yellow-300 font-bold mb-4">{trophy.name}</p>

        {/* Category and rank */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-6 inline-block mb-6">
          <p className="text-white text-lg">Category: <span className="text-yellow-300 font-bold">{trophy.category}</span></p>
          {rank && (
            <p className="text-white text-lg mt-2">Rank: <span className="text-yellow-300 font-bold">#{rank}</span></p>
          )}
        </div>

        {/* Celebration text */}
        <p className="text-white text-2xl animate-pulse">Congratulations! 🎉</p>

        {/* Fireworks effect */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                left: '50%',
                top: '50%',
                animation: `explode ${1.5}s ease-out forwards`,
                animationDelay: `${i * 0.1}s`,
                transformOrigin: '0 0',
                transform: `rotate(${(i / 20) * 360}deg) translateY(0)`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes explode {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// XP GAIN TOAST
// ============================================================================

interface XPGainToastProps {
  amount: number;
  reason: string;
  onClose: () => void;
}

export const XPGainToast: React.FC<XPGainToastProps> = ({ amount, reason, onClose }) => {
  useEffect(() => {
    playSound('XP_GAIN', 0.5);
    const timer = setTimeout(onClose, 1500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-8 right-8 z-40 animate-in fade-in slide-in-from-top-2">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-4 shadow-lg flex items-center gap-3">
        <Sparkles size={24} className="animate-spin" style={{ animationDuration: '2s' }} />
        <div>
          <p className="font-bold">+{amount} XP</p>
          <p className="text-sm text-blue-100">{reason}</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ACHIEVEMENT NOTIFICATION SYSTEM
// ============================================================================

interface AchievementNotification {
  id: string;
  type: 'level-up' | 'badge' | 'trophy' | 'xp';
  data: any;
}

interface NotificationManagerProps {
  notifications: AchievementNotification[];
  onRemove: (id: string) => void;
}

export const AchievementNotificationManager: React.FC<NotificationManagerProps> = ({
  notifications,
  onRemove,
}) => {
  return (
    <>
      {notifications.map((notification) => {
        if (notification.type === 'level-up') {
          return (
            <LevelUpCelebration
              key={notification.id}
              level={notification.data.level}
              rank={notification.data.rank}
              onClose={() => onRemove(notification.id)}
            />
          );
        }

        if (notification.type === 'badge') {
          return (
            <BadgeUnlockModal
              key={notification.id}
              badge={notification.data}
              onClose={() => onRemove(notification.id)}
            />
          );
        }

        if (notification.type === 'trophy') {
          return (
            <TrophyUnlockCelebration
              key={notification.id}
              trophy={notification.data}
              rank={notification.data.rank}
              onClose={() => onRemove(notification.id)}
            />
          );
        }

        if (notification.type === 'xp') {
          return (
            <XPGainToast
              key={notification.id}
              amount={notification.data.amount}
              reason={notification.data.reason}
              onClose={() => onRemove(notification.id)}
            />
          );
        }

        return null;
      })}
    </>
  );
};

export default {
  playSound,
  LevelUpCelebration,
  BadgeUnlockModal,
  TrophyUnlockCelebration,
  XPGainToast,
  AchievementNotificationManager,
};
