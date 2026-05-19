/** Request fullscreen on the root element if not already fullscreen. */
export function enterFullscreen(): void {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen({ navigationUI: 'hide' }).catch(() => {})
  }
}
