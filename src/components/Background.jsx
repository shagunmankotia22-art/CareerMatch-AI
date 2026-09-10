import React, { useEffect, useRef, useState } from "react";

const particles = [
  { x: 12, y: 25, size: 7, note: 261.63, delay: -1 },
  { x: 19, y: 36, size: 5, note: 293.66, delay: -4 },
  { x: 28, y: 23, size: 8, note: 329.63, delay: -7 },
  { x: 37, y: 28, size: 5, note: 392.0, delay: -2 },

  { x: 65, y: 24, size: 7, note: 440.0, delay: -5 },
  { x: 74, y: 31, size: 5, note: 493.88, delay: -8 },
  { x: 83, y: 23, size: 8, note: 523.25, delay: -3 },
  { x: 90, y: 36, size: 5, note: 587.33, delay: -6 },

  { x: 10, y: 49, size: 5, note: 329.63, delay: -9 },
  { x: 19, y: 58, size: 8, note: 392.0, delay: -3 },
  { x: 29, y: 49, size: 5, note: 440.0, delay: -6 },

  { x: 71, y: 48, size: 7, note: 493.88, delay: -4 },
  { x: 81, y: 56, size: 5, note: 523.25, delay: -7 },
  { x: 90, y: 48, size: 8, note: 659.25, delay: -2 },

  { x: 13, y: 69, size: 7, note: 392.0, delay: -5 },
  { x: 23, y: 77, size: 5, note: 440.0, delay: -8 },
  { x: 32, y: 70, size: 7, note: 523.25, delay: -1 },

  { x: 68, y: 70, size: 5, note: 493.88, delay: -6 },
  { x: 78, y: 77, size: 7, note: 587.33, delay: -3 },
  { x: 88, y: 68, size: 5, note: 659.25, delay: -9 },

  { x: 39, y: 70, size: 5, note: 349.23, delay: -4 },
  { x: 61, y: 70, size: 7, note: 415.30, delay: -7 },
];

const orbitNotes = [
  349.23,
  415.30,
  493.88,
  523.25,
];

export default function Background() {
  const audioContext = useRef(null);
  const masterGain = useRef(null);
  const lastSound = useRef(0);

  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [activeParticle, setActiveParticle] = useState(null);
  const [activeOrbit, setActiveOrbit] = useState(null);

  /*
   * Create the audio system.
   */
  const unlockAudio = async () => {
    try {
      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContext) {
        console.log("Web Audio API unavailable");
        return null;
      }

      if (!audioContext.current) {
        const ctx = new AudioContext();

        const gain = ctx.createGain();

        gain.gain.value = 0.38;

        gain.connect(ctx.destination);

        audioContext.current = ctx;
        masterGain.current = gain;
      }

      const ctx = audioContext.current;

      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      setAudioUnlocked(true);

      return ctx;
    } catch (error) {
      console.error("Audio error:", error);
      return null;
    }
  };

  /*
   * Browser audio needs a user gesture.
   *
   * The FIRST click anywhere unlocks the audio.
   * After that, hover can trigger sounds.
   */
  useEffect(() => {
    const firstInteraction = () => {
      unlockAudio();
    };

    window.addEventListener(
      "pointerdown",
      firstInteraction,
      { once: true }
    );

    return () => {
      window.removeEventListener(
        "pointerdown",
        firstInteraction
      );
    };
  }, []);

  /*
   * Play one musical note.
   */
  const playNote = async (frequency, type = "particle") => {
    const currentTime = Date.now();

    /*
     * Prevent sound spam when cursor stays
     * around an object.
     */
    if (currentTime - lastSound.current < 220) {
      return;
    }

    lastSound.current = currentTime;

    const ctx = await unlockAudio();

    if (!ctx) return;

    const now = ctx.currentTime;

    /*
     * Main sound
     */
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type =
      type === "orbit"
        ? "triangle"
        : "sine";

    oscillator.frequency.setValueAtTime(
      frequency,
      now
    );

    gain.gain.setValueAtTime(
      0.0001,
      now
    );

    gain.gain.exponentialRampToValueAtTime(
      type === "orbit" ? 0.22 : 0.3,
      now + 0.025
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + 1.0
    );

    oscillator.connect(gain);
    gain.connect(masterGain.current);

    oscillator.start(now);
    oscillator.stop(now + 1.05);

    /*
     * Soft high harmonic.
     */
    const harmonic = ctx.createOscillator();
    const harmonicGain = ctx.createGain();

    harmonic.type = "sine";

    harmonic.frequency.setValueAtTime(
      frequency * 2,
      now
    );

    harmonicGain.gain.setValueAtTime(
      0.0001,
      now
    );

    harmonicGain.gain.exponentialRampToValueAtTime(
      0.06,
      now + 0.02
    );

    harmonicGain.gain.exponentialRampToValueAtTime(
      0.001,
      now + 0.65
    );

    harmonic.connect(harmonicGain);
    harmonicGain.connect(masterGain.current);

    harmonic.start(now);
    harmonic.stop(now + 0.7);
  };

  /*
   * Particle interaction.
   */
  const handleParticleEnter = (particle, index) => {
    setActiveParticle(index);

    playNote(
      particle.note,
      "particle"
    );
  };

  /*
   * Orbit interaction.
   */
  const handleOrbitEnter = (index) => {
    setActiveOrbit(index);

    playNote(
      orbitNotes[index],
      "orbit"
    );

    setTimeout(() => {
      setActiveOrbit(null);
    }, 500);
  };

  return (
    <div className="ai-ambient">

      {/* =================================================
          SOFT LIGHT
          ================================================= */}

      <div className="ambient-light light-one"></div>
      <div className="ambient-light light-two"></div>


<div className="corner-orbits">

  <div
    className={`corner-orbit corner-orbit-one ${
      activeOrbit === 0 ? "orbit-active" : ""
    }`}
    onPointerEnter={() => handleOrbitEnter(0)}
  />

  <div
    className={`corner-orbit corner-orbit-two ${
      activeOrbit === 1 ? "orbit-active" : ""
    }`}
    onPointerEnter={() => handleOrbitEnter(1)}
  />

  <div
    className={`corner-orbit corner-orbit-three ${
      activeOrbit === 2 ? "orbit-active" : ""
    }`}
    onPointerEnter={() => handleOrbitEnter(2)}
  />

  <div
    className={`corner-orbit corner-orbit-four ${
      activeOrbit === 3 ? "orbit-active" : ""
    }`}
    onPointerEnter={() => handleOrbitEnter(0)}
  />

</div>


      {/* =================================================
          PARTICLES
          ================================================= */}

      <div className="particle-field">

        {particles.map((particle, index) => (
          <button
            key={index}
            className={`ai-particle ${
              activeParticle === index
                ? "particle-active"
                : ""
            }`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
            }}
            onPointerEnter={() =>
              handleParticleEnter(
                particle,
                index
              )
            }
            onPointerLeave={() =>
              setActiveParticle(null)
            }
            onClick={(event) => {
              event.stopPropagation();

              playNote(
                particle.note,
                "particle"
              );
            }}
            aria-label="Interactive sound particle"
          />
        ))}

      </div>


      {/* =================================================
          AUDIO STATUS
          Only appears after first interaction.
          ================================================= */}

      {audioUnlocked && (
        <div className="sound-status">
          <span className="sound-status-dot"></span>
          <span>Ambient sound</span>
        </div>
      )}

    </div>
  );
}