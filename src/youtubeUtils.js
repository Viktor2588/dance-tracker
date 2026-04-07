// Sends a playback rate command to a YouTube iframe using postMessage API.
// Requires the iframe to have ?enablejsapi=1 in its src.
export function sendSpeedToYoutube(iframe, speed) {
  try {
    iframe?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: 'setPlaybackRate', args: [speed] }),
      '*'
    );
  } catch {
    // ignore cross-origin or missing iframe errors
  }
}

// Seeks to a specific time (in seconds) in a YouTube iframe.
export function seekToYoutube(iframe, seconds) {
  try {
    iframe?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: 'seekTo', args: [seconds, true] }),
      '*'
    );
  } catch {
    // ignore cross-origin or missing iframe errors
  }
}
