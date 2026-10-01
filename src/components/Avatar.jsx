
import React, { useState, useEffect, useRef } from 'react';

// --- Avatar Constants ---
const CONTAINER_WIDTH = 180;
const CONTAINER_HEIGHT = 220;

const HEAD_WIDTH = 100;
const HEAD_HEIGHT = 108;
const HEAD_TOP_OFFSET = 50;

const EYE_SOCKET_WIDTH = 30;
const EYE_SOCKET_HEIGHT = 35;
const EYE_SOCKET_TOP_PERCENT = 0.34;
const EYE_SOCKET_LEFT_PERCENT = 0.20;
const EYE_SOCKET_RIGHT_PERCENT = 0.20;

const LEFT_EYE_SOCKET_TOP = HEAD_HEIGHT * EYE_SOCKET_TOP_PERCENT;
const LEFT_EYE_SOCKET_LEFT = HEAD_WIDTH * EYE_SOCKET_LEFT_PERCENT;

const RIGHT_EYE_SOCKET_TOP = HEAD_HEIGHT * EYE_SOCKET_TOP_PERCENT;
const RIGHT_EYE_SOCKET_LEFT =
  HEAD_WIDTH * (1 - EYE_SOCKET_RIGHT_PERCENT) - EYE_SOCKET_WIDTH;

const PUPIL_WIDTH = 12;
const PUPIL_HEIGHT = 12;

const MAX_PUPIL_OFFSET_X =
  (EYE_SOCKET_WIDTH / 2) - (PUPIL_WIDTH / 2);

const MAX_PUPIL_OFFSET_Y =
  (EYE_SOCKET_HEIGHT / 2) - (PUPIL_HEIGHT / 2);

const MAX_AVATAR_TILT_ANGLE = 10;

const Avatar = () => {
  const [leftPupilTransform, setLeftPupilTransform] =
    useState('translate(-50%, -50%)');

  const [rightPupilTransform, setRightPupilTransform] =
    useState('translate(-50%, -50%)');

  const [avatarTiltTransform, setAvatarTiltTransform] =
    useState('perspective(800px) rotateX(0deg) rotateY(0deg)');

  const avatarRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!avatarRef.current) return;

      const avatarRect = avatarRef.current.getBoundingClientRect();

      // --- 3D Avatar Tilt ---
      const avatarCenterX =
        avatarRect.left + avatarRect.width / 2;

      const avatarCenterY =
        avatarRect.top + avatarRect.height / 2;

      const deltaXAvatar = event.clientX - avatarCenterX;
      const deltaYAvatar = event.clientY - avatarCenterY;

      let rotateY =
        (deltaXAvatar / (avatarRect.width / 2)) *
        MAX_AVATAR_TILT_ANGLE;

      let rotateX =
        (-deltaYAvatar / (avatarRect.height / 2)) *
        MAX_AVATAR_TILT_ANGLE;

      rotateX = Math.max(
        -MAX_AVATAR_TILT_ANGLE,
        Math.min(MAX_AVATAR_TILT_ANGLE, rotateX)
      );

      rotateY = Math.max(
        -MAX_AVATAR_TILT_ANGLE,
        Math.min(MAX_AVATAR_TILT_ANGLE, rotateY)
      );

      setAvatarTiltTransform(
        `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      );

      // --- Eye Tracking ---
      const headActualLeft =
        (CONTAINER_WIDTH - HEAD_WIDTH) / 2;

      const headViewportX = avatarRect.left + headActualLeft;
      const headViewportY = avatarRect.top + HEAD_TOP_OFFSET;

      const calculatePupil = (eyeLeft) => {
        const eyeCenterX =
          headViewportX + eyeLeft + EYE_SOCKET_WIDTH / 2;

        const eyeCenterY =
          headViewportY +
          HEAD_HEIGHT * EYE_SOCKET_TOP_PERCENT +
          EYE_SOCKET_HEIGHT / 2;

        const dx = event.clientX - eyeCenterX;
        const dy = event.clientY - eyeCenterY;
        const distance = Math.hypot(dx, dy);

        if (distance === 0) {
          return 'translate(-50%, -50%)';
        }

        const x =
          (dx / distance) *
          Math.min(distance, MAX_PUPIL_OFFSET_X);

        const y =
          (dy / distance) *
          Math.min(distance, MAX_PUPIL_OFFSET_Y);

        return `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
      };

      setLeftPupilTransform(
        calculatePupil(LEFT_EYE_SOCKET_LEFT)
      );

      setRightPupilTransform(
        calculatePupil(RIGHT_EYE_SOCKET_LEFT)
      );
    };

    const handleMouseLeave = () => {
      setAvatarTiltTransform(
        'perspective(800px) rotateX(0deg) rotateY(0deg)'
      );

      setLeftPupilTransform('translate(-50%, -50%)');
      setRightPupilTransform('translate(-50%, -50%)');
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const styles = {
    container: {
      width: CONTAINER_WIDTH,
      height: CONTAINER_HEIGHT,
      position: 'relative',
      transform: avatarTiltTransform,
      transformStyle: 'preserve-3d',
      transition: 'transform 0.12s ease-out',
      margin: '0 auto',
      flexShrink: 0,
    },

    hoodie: {
      width: 160,
      height: 82,
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%) translateZ(2px)',
      background: 'linear-gradient(145deg, #252b3b, #10131d)',
      borderRadius: '55px 55px 0 0',
      zIndex: 1,
      boxShadow: 'inset 0 5px 12px rgba(255,255,255,0.08)',
      overflow: 'hidden',
    },

    hoodieInner: {
      position: 'absolute',
      width: 65,
      height: 48,
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      borderRadius: '0 0 35px 35px',
      border: '2px solid #414b60',
      borderTop: 'none',
    },

    hoodieStringLeft: {
      position: 'absolute',
      width: 2,
      height: 28,
      top: 28,
      left: '42%',
      background: '#77849a',
      borderRadius: 5,
    },

    hoodieStringRight: {
      position: 'absolute',
      width: 2,
      height: 28,
      top: 28,
      right: '42%',
      background: '#77849a',
      borderRadius: 5,
    },

    neck: {
      width: 34,
      height: 30,
      position: 'absolute',
      top: 130,
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#bfc3ca',
      zIndex: 2,
    },

    head: {
      width: HEAD_WIDTH,
      height: HEAD_HEIGHT,
      position: 'absolute',
      top: HEAD_TOP_OFFSET,
      left: '50%',
      transform: 'translateX(-50%) translateZ(8px)',
      background: 'linear-gradient(145deg, #e1e4e9, #b9bec7)',
      borderRadius: '46% 46% 45% 45%',
      boxShadow:
        'inset -7px -5px 12px rgba(60,70,90,0.16), 0 8px 15px rgba(0,0,0,0.16)',
      zIndex: 3,
      overflow: 'hidden',
    },

    faceHighlight: {
      position: 'absolute',
      width: 28,
      height: 65,
      top: 15,
      left: 8,
      borderRadius: '50%',
      background:
        'linear-gradient(90deg, rgba(255,255,255,0.35), transparent)',
      pointerEvents: 'none',
    },

    hair: {
      width: 108,
      height: 58,
      position: 'absolute',
      top: 35,
      left: '50%',
      transform: 'translateX(-50%) translateZ(12px)',
      background: 'linear-gradient(145deg, #292d38, #10131b)',
      borderRadius: '55% 55% 28% 25%',
      zIndex: 5,
      boxShadow: '0 3px 6px rgba(0,0,0,0.25)',
      clipPath: 'polygon(0 0, 100% 0, 100% 65%, 87% 58%, 76% 73%, 65% 55%, 52% 68%, 39% 53%, 25% 68%, 12% 58%, 0 75%)',
    },

    hairHighlight: {
      position: 'absolute',
      top: 43,
      left: 62,
      width: 40,
      height: 15,
      background: 'rgba(255,255,255,0.10)',
      borderRadius: '50%',
      transform: 'rotate(-20deg)',
      zIndex: 6,
      pointerEvents: 'none',
    },

    headphoneBand: {
      width: 124,
      height: 78,
      position: 'absolute',
      top: 15,
      left: '50%',
      transform: 'translateX(-50%) translateZ(5px)',
      border: '7px solid #202633',
      borderBottom: 'none',
      borderRadius: '75px 75px 0 0',
      zIndex: 4,
      boxSizing: 'border-box',
    },

    headphoneAccent: {
      width: 90,
      height: 52,
      position: 'absolute',
      top: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      border: '2px solid #4d9dff',
      borderBottom: 'none',
      borderRadius: '55px 55px 0 0',
      opacity: 0.9,
    },

    leftEarcup: {
      width: 29,
      height: 48,
      position: 'absolute',
      top: 62,
      left: 9,
      background: 'linear-gradient(90deg, #111722, #30394b)',
      border: '3px solid #171c27',
      borderRadius: '11px',
      zIndex: 7,
      boxShadow: '0 3px 8px rgba(0,0,0,0.28)',
    },

    rightEarcup: {
      width: 29,
      height: 48,
      position: 'absolute',
      top: 62,
      right: 9,
      background: 'linear-gradient(90deg, #30394b, #111722)',
      border: '3px solid #171c27',
      borderRadius: '11px',
      zIndex: 7,
      boxShadow: '0 3px 8px rgba(0,0,0,0.28)',
    },

    earcupAccent: {
      position: 'absolute',
      width: 5,
      height: 22,
      top: 10,
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#4d9dff',
      borderRadius: 5,
      boxShadow: '0 0 8px rgba(77,157,255,0.65)',
    },

    leftEyeSocket: {
      width: EYE_SOCKET_WIDTH,
      height: EYE_SOCKET_HEIGHT,
      position: 'absolute',
      top: `${EYE_SOCKET_TOP_PERCENT * 100}%`,
      left: `${EYE_SOCKET_LEFT_PERCENT * 100}%`,
      background: '#f8fafc',
      borderRadius: '45%',
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.12)',
      zIndex: 2,
      overflow: 'hidden',
    },

    rightEyeSocket: {
      width: EYE_SOCKET_WIDTH,
      height: EYE_SOCKET_HEIGHT,
      position: 'absolute',
      top: `${EYE_SOCKET_TOP_PERCENT * 100}%`,
      right: `${EYE_SOCKET_RIGHT_PERCENT * 100}%`,
      background: '#f8fafc',
      borderRadius: '45%',
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.12)',
      zIndex: 2,
      overflow: 'hidden',
    },

    pupil: {
      width: PUPIL_WIDTH,
      height: PUPIL_HEIGHT,
      position: 'absolute',
      top: '50%',
      left: '50%',
      background: '#151923',
      borderRadius: '50%',
      transition: 'transform 0.04s linear',
      boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
    },

    pupilShine: {
      width: 4,
      height: 4,
      position: 'absolute',
      top: 2,
      left: 2,
      borderRadius: '50%',
      background: '#ffffff',
    },

    eyebrow: {
      position: 'absolute',
      width: 26,
      height: 4,
      top: 24,
      background: '#353945',
      borderRadius: 5,
      zIndex: 3,
    },

    leftEyebrow: {
      left: 19,
      transform: 'rotate(-5deg)',
    },

    rightEyebrow: {
      right: 19,
      transform: 'rotate(5deg)',
    },

    nose: {
      position: 'absolute',
      width: 8,
      height: 10,
      top: 67,
      left: '50%',
      transform: 'translateX(-50%)',
      borderRight: '1px solid rgba(90,95,105,0.4)',
      borderBottom: '1px solid rgba(90,95,105,0.4)',
      borderRadius: '0 0 5px 0',
      zIndex: 3,
    },

    mouth: {
      position: 'absolute',
      width: 20,
      height: 7,
      top: 85,
      left: '50%',
      transform: 'translateX(-50%)',
      borderBottom: '2px solid #555b66',
      borderRadius: '0 0 50% 50%',
      zIndex: 3,
    },
  };

  return (
    <div
      ref={avatarRef}
      style={styles.container}
      aria-label="Interactive developer avatar"
    >
      {/* Hoodie and shoulders */}
      <div style={styles.hoodie}>
        <div style={styles.hoodieInner} />
        <div style={styles.hoodieStringLeft} />
        <div style={styles.hoodieStringRight} />
      </div>

      {/* Neck */}
      <div style={styles.neck} />

      {/* Headphones behind the head */}
      <div style={styles.headphoneBand}>
        <div style={styles.headphoneAccent} />
      </div>

      {/* Head */}
      <div style={styles.head}>
        <div style={styles.faceHighlight} />

        {/* Eyebrows */}
        <div
          style={{
            ...styles.eyebrow,
            ...styles.leftEyebrow,
          }}
        />
        <div
          style={{
            ...styles.eyebrow,
            ...styles.rightEyebrow,
          }}
        />

        {/* Eyes */}
        <div style={styles.leftEyeSocket}>
          <div
            style={{
              ...styles.pupil,
              transform: leftPupilTransform,
            }}
          >
            <div style={styles.pupilShine} />
          </div>
        </div>

        <div style={styles.rightEyeSocket}>
          <div
            style={{
              ...styles.pupil,
              transform: rightPupilTransform,
            }}
          >
            <div style={styles.pupilShine} />
          </div>
        </div>

        {/* Nose and smile */}
        <div style={styles.nose} />
        <div style={styles.mouth} />
      </div>

      {/* Hair */}
      <div style={styles.hair} />
      <div style={styles.hairHighlight} />

      {/* Headphone earcups */}
      <div style={styles.leftEarcup}>
        <div style={styles.earcupAccent} />
      </div>
      <div style={styles.rightEarcup}>
        <div style={styles.earcupAccent} />
      </div>
    </div>
  );
};

export default Avatar;
