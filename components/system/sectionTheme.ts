/** Shared horizontal padding for full-width marketing sections */
export const sectionPageX = "px-8";

/** Default vertical padding for major sections (hero-scale blocks) */
export const sectionPageY = "py-32";

/**
 * Standard vertical rhythm for a full marketing band (title + content).
 * Use for sections that are not “stacked” against the same background.
 */
export const sectionBandY = "py-20 md:py-24";

/** Slightly tighter band (e.g. belief intro after hero) */
export const sectionBandYCompact = "py-16 md:py-20";

/** Tighter vertical padding (legacy alias — prefer `sectionBandY`) */
export const sectionPageYTight = sectionBandY;

/** Margin below display-scale section titles (Selected Works, About) */
export const sectionTitleMarginDisplay = "mb-16";

/** Margin below compact section titles (Services band, Clients, variant headers) */
export const sectionTitleMarginCompact = "mb-10 md:mb-12";

/**
 * When two consecutive sections share the same background token, pair
 * **stack bottom** on the upper band with **stack top** on the lower band
 * so the seam does not read as double padding.
 */
export const sectionStackBottom = "pb-8 md:pb-10 lg:pb-12";
export const sectionStackTop = "pt-8 md:pt-10 lg:pt-12";
