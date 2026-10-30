import React, { useState, useMemo } from 'react';

/**
 * Extracts a clean 11-character YouTube video ID from various URL formats or raw IDs:
 * - https://www.youtube.com/watch?v=ABC123XYZ
 * - https://youtu.be/ABC123XYZ
 * - https://www.youtube.com/embed/ABC123XYZ
 * - https://www.youtube.com/shorts/ABC123XYZ
 * - ABC123XYZ (raw 11-character ID)
 *
 * @param {string} urlOrId
 * @returns {string} Clean YouTube Video ID or empty string
 */
export function extractYouTubeVideoId(urlOrId) {
  if (!urlOrId || typeof urlOrId !== 'string') return '';
  const trimmed = urlOrId.trim();

  // Pure 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // youtu.be/<id>
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // watch?v=<id> or embed/<id> or shorts/<id> or v/<id>
  const fullMatch = trimmed.match(/(?:v=|\/embed\/|\/shorts\/|\/v\/)([a-zA-Z0-9_-]{11})/);
  if (fullMatch) return fullMatch[1];

  return trimmed;
}

/**
 * YouTubeBackgroundVideo: High-performance, loop-forever embedded YouTube video player.
 * 
 * Replaces direct CDN/application MP4 video serving with zero UI degradation.
 * 
 * Capabilities:
 * - Autoplay & Muted: Automatically plays inline while satisfying browser autoplay policies.
 * - Single-Video Infinite Loop: Configures loop=1 & playlist={videoId} for continuous looping without related video transitions.
 * - Minimal Chrome: Completely hides player controls (controls=0), annotations, and keyboard events.
 * - Object-Fit Cover Equivalent: Fills and covers responsive containers without letterboxing or layout shift.
 * - Pointer-Events Isolation: Sits passively at z-0 without capturing clicks or blocking foreground CTAs.
 * - Resilience: Gracefully falls back to container branding if video ID is missing or blocked.
 *
 * @param {object} props
 * @param {string} props.videoId - YouTube video ID or full URL
 * @param {string} [props.className] - Additional CSS classes
 */
export function YouTubeBackgroundVideo({ videoId, className = '' }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const cleanVideoId = useMemo(() => extractYouTubeVideoId(videoId), [videoId]);

  // Construct secure, privacy-enhanced YouTube embed URL
  const embedUrl = useMemo(() => {
    if (!cleanVideoId) return null;

    const params = new URLSearchParams({
      autoplay: '1',
      mute: '1',
      loop: '1',
      playlist: cleanVideoId, // Required by YouTube for single-video looping
      controls: '0',
      showinfo: '0',
      rel: '0',
      iv_load_policy: '3',
      disablekb: '1',
      fs: '0',
      playsinline: '1',
      modestbranding: '1',
      enablejsapi: '1',
    });

    // Use youtube-nocookie.com for privacy and lower tracking overhead
    return `https://www.youtube-nocookie.com/embed/${cleanVideoId}?${params.toString()}`;
  }, [cleanVideoId]);

  if (!cleanVideoId || hasError || !embedUrl) {
    // Graceful fallback to dark hero background if video is unconfigured or blocked
    return null;
  }

  return (
    <div
      className={`absolute inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[#0B1F4D] ${className}`}
      aria-hidden="true"
    >
      {/* 
        Sizing geometry:
        Using min-w-[177.78vh] and min-h-[56.25vw] centered via translate(-50%, -50%)
        guarantees that 16:9 video completely covers the container across all aspect ratios,
        reproducing the native object-fit: cover visual effect.
      */}
      <iframe
        src={embedUrl}
        title="National Cyber Security Awareness Month Campaign Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen={false}
        tabIndex="-1"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] min-w-full min-h-full h-[56.25vw] max-w-none border-0 pointer-events-none filter brightness-[1] contrast-[1.05] transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

export default YouTubeBackgroundVideo;
