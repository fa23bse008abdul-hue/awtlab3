export interface FieldSelectionMeta {
  fieldsRequested: string[] | 'all';
  fieldsCount: number;
  originalPayloadBytes: number;
  filteredPayloadBytes: number;
  bytesSaved: number;
  savingsPercentage: number;
}

/**
 * Filter an object or array of objects by selected fields.
 * Example: fields=title,price,thumbnailUrl
 */
export function applyFieldSelection<T extends Record<string, any>>(
  data: T | T[],
  fieldsQuery?: string
): { filtered: any; meta: FieldSelectionMeta } {
  const originalJson = JSON.stringify(data);
  const originalPayloadBytes = Buffer.byteLength(originalJson, 'utf8');

  if (!fieldsQuery || fieldsQuery.trim() === '' || fieldsQuery.trim() === '*') {
    return {
      filtered: data,
      meta: {
        fieldsRequested: 'all',
        fieldsCount: Array.isArray(data) && data.length > 0 ? Object.keys(data[0]).length : Object.keys(data).length,
        originalPayloadBytes,
        filteredPayloadBytes: originalPayloadBytes,
        bytesSaved: 0,
        savingsPercentage: 0
      }
    };
  }

  const requestedFields = fieldsQuery
    .split(',')
    .map(f => f.trim())
    .filter(Boolean);

  // Always keep 'id' if available for client reconciliation, but don't force if not desired
  const fieldsSet = new Set(requestedFields);
  if (!fieldsSet.has('id')) {
    fieldsSet.add('id');
  }

  const filterSingle = (item: T) => {
    const result: Record<string, any> = {};
    for (const field of fieldsSet) {
      if (field in item) {
        result[field] = item[field];
      }
    }
    return result;
  };

  const filtered = Array.isArray(data) ? data.map(filterSingle) : filterSingle(data);
  const filteredJson = JSON.stringify(filtered);
  const filteredPayloadBytes = Buffer.byteLength(filteredJson, 'utf8');
  const bytesSaved = Math.max(0, originalPayloadBytes - filteredPayloadBytes);
  const savingsPercentage = originalPayloadBytes > 0 
    ? Number(((bytesSaved / originalPayloadBytes) * 100).toFixed(1))
    : 0;

  return {
    filtered,
    meta: {
      fieldsRequested: Array.from(fieldsSet),
      fieldsCount: fieldsSet.size,
      originalPayloadBytes,
      filteredPayloadBytes,
      bytesSaved,
      savingsPercentage
    }
  };
}
