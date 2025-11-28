/**
 * Class Names Utility
 *
 * A utility function for conditionally joining class names together.
 * Similar to clsx/classnames packages but without external dependencies.
 */

type ClassValue = string | number | boolean | undefined | null | ClassValue[];

/**
 * Merge class names together, filtering out falsy values.
 *
 * @param classes - Class names to merge
 * @returns Merged class names string
 *
 * @example
 * ```typescript
 * cn('foo', 'bar') // 'foo bar'
 * cn('foo', false && 'bar') // 'foo'
 * cn('foo', undefined, 'bar') // 'foo bar'
 * cn('foo', ['bar', 'baz']) // 'foo bar baz'
 * ```
 */
export function cn(...classes: ClassValue[]): string {
  const result: string[] = [];

  for (const cls of classes) {
    if (!cls) continue;

    if (typeof cls === 'string' || typeof cls === 'number') {
      result.push(String(cls));
    } else if (Array.isArray(cls)) {
      const nested = cn(...cls);
      if (nested) {
        result.push(nested);
      }
    }
  }

  return result.join(' ');
}
