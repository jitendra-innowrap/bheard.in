/**
 * Hero Spline scene URL (ends with `/scene.splinecode`).
 *
 * Prefer `SPLINE_HERO_SCENE` in `.env.local` (server — read on each request when the page is dynamic).
 * `NEXT_PUBLIC_SPLINE_HERO_SCENE` also works (inlined at build time for static bundles).
 */
export function getSplineHeroSceneUrl(): string {
  return (
    process.env.SPLINE_HERO_SCENE ??
    process.env.NEXT_PUBLIC_SPLINE_HERO_SCENE ??
    "https://prod.spline.design/74Cna2592-n-e5cl/scene.splinecode"
  );
}
