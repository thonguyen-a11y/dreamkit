/**
 * Minimal className joiner — filters out falsy values and joins with a space.
 * Avoids pulling in a dependency for a single trivial utility.
 */
export function cn(
  ...values: ReadonlyArray<string | false | null | undefined>
): string {
  return values.filter(Boolean).join(" ");
}
