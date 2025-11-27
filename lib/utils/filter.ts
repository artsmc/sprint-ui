/**
 * PocketBase Filter Utilities
 *
 * Utilities for safely building PocketBase filter queries.
 * Prevents filter injection attacks by properly escaping values.
 */

/**
 * Escape a string value for use in PocketBase filter queries.
 *
 * Escapes double quotes and backslashes to prevent filter injection.
 *
 * @param value - The string value to escape
 * @returns The escaped string safe for use in filters
 *
 * @example
 * const filter = `name = "${escapeFilterValue(userInput)}"`;
 */
export function escapeFilterValue(value: string): string {
  // Escape backslashes first, then double quotes
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/**
 * Build a safe equality filter for a string field.
 *
 * @param field - The field name to filter on
 * @param value - The value to match
 * @returns A safe filter string
 *
 * @example
 * const filter = filterEquals('user_id', untrustedUserId);
 * // Returns: user_id = "escaped_value"
 */
export function filterEquals(field: string, value: string): string {
  return `${field} = "${escapeFilterValue(value)}"`;
}

/**
 * Build a safe "contains" filter for a string field.
 *
 * @param field - The field name to filter on
 * @param value - The value to search for
 * @returns A safe filter string using the ~ operator
 *
 * @example
 * const filter = filterContains('title', searchTerm);
 * // Returns: title ~ "escaped_value"
 */
export function filterContains(field: string, value: string): string {
  return `${field} ~ "${escapeFilterValue(value)}"`;
}

/**
 * Build a safe "in" filter for checking if a field value is in a list.
 *
 * @param field - The field name to filter on
 * @param values - Array of values to match against
 * @returns A safe filter string using OR conditions
 *
 * @example
 * const filter = filterIn('status', ['active', 'voting']);
 * // Returns: (status = "active" || status = "voting")
 */
export function filterIn(field: string, values: string[]): string {
  if (values.length === 0) {
    return 'false'; // No values means no matches
  }
  if (values.length === 1) {
    return filterEquals(field, values[0]);
  }
  const conditions = values.map((v) => filterEquals(field, v));
  return `(${conditions.join(' || ')})`;
}

/**
 * Combine multiple filter conditions with AND.
 *
 * @param filters - Array of filter strings to combine
 * @returns Combined filter string
 *
 * @example
 * const filter = filterAnd([
 *   filterEquals('sprint_id', sprintId),
 *   filterEquals('user_id', userId),
 * ]);
 * // Returns: (sprint_id = "..." && user_id = "...")
 */
export function filterAnd(filters: string[]): string {
  const validFilters = filters.filter((f) => f && f !== 'true');
  if (validFilters.length === 0) {
    return '';
  }
  if (validFilters.length === 1) {
    return validFilters[0];
  }
  return `(${validFilters.join(' && ')})`;
}

/**
 * Combine multiple filter conditions with OR.
 *
 * @param filters - Array of filter strings to combine
 * @returns Combined filter string
 *
 * @example
 * const filter = filterOr([
 *   filterEquals('status', 'active'),
 *   filterEquals('status', 'voting'),
 * ]);
 * // Returns: (status = "active" || status = "voting")
 */
export function filterOr(filters: string[]): string {
  const validFilters = filters.filter((f) => f && f !== 'false');
  if (validFilters.length === 0) {
    return '';
  }
  if (validFilters.length === 1) {
    return validFilters[0];
  }
  return `(${validFilters.join(' || ')})`;
}
