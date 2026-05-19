/** Request fullscreen on the root element if not already fullscreen.
 *  iOS Safari does not support the Fullscreen API — silently skipped.
 *  Returns a promise that always resolves (never rejects) so callers can await it safely.
 */
export function enterFullscreen(): Promise<void> {
  const el = document.documentElement
  const requestFn =
    el.requestFullscreen ??
    (el as any).webkitRequestFullscreen ??
    (el as any).mozRequestFullScreen ??
    (el as any).msRequestFullscreen

  if (!requestFn || document.fullscreenElement) return Promise.resolve()

  return requestFn.call(el, { navigationUI: 'hide' }).catch(() => {})
}
