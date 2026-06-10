/**
 * Validates the input edges array according to the rules:
 * - Format must be X->Y where X and Y are single uppercase letters A-Z
 * - Trim whitespace first
 * - Reject self loops (A->A)
 * - Detect and extract duplicates once
 * - Multi-parent handling: First parent wins, subsequent parent assignments are silently ignored
 * 
 * @param {Array} rawEdges - Array of edge strings
 * @returns {Object} - { validEdges: Array of objects {source, target, original}, invalidEntries: Array, duplicateEdges: Array }
 */
function validateEdges(rawEdges) {
  const invalidEntries = [];
  const duplicateEdges = [];
  const validEdges = [];
  
  if (!Array.isArray(rawEdges)) {
    return { validEdges, invalidEntries, duplicateEdges };
  }

  const seenEdges = new Set();
  const duplicateSet = new Set();
  const childToParent = {}; // Keep track of child -> parent to enforce first parent wins

  for (const edge of rawEdges) {
    if (typeof edge !== 'string') {
      invalidEntries.push(String(edge));
      continue;
    }

    const trimmed = edge.trim();
    
    // Check format A-Z -> A-Z
    const match = trimmed.match(/^([A-Z])->([A-Z])$/);
    if (!match) {
      invalidEntries.push(trimmed);
      continue;
    }

    const source = match[1];
    const target = match[2];

    // Reject self loops
    if (source === target) {
      invalidEntries.push(trimmed);
      continue;
    }

    // Check duplicate edge
    if (seenEdges.has(trimmed)) {
      if (!duplicateSet.has(trimmed)) {
        duplicateSet.add(trimmed);
        duplicateEdges.push(trimmed);
      }
      continue;
    }

    seenEdges.add(trimmed);

    // Multi-parent rule: Keep first parent, silently ignore later assignments
    if (childToParent[target] !== undefined) {
      // Child already has a parent. Silently ignore.
      continue;
    }

    // Assign parent
    childToParent[target] = source;
    validEdges.push({ source, target, original: trimmed });
  }

  return { validEdges, invalidEntries, duplicateEdges };
}

module.exports = validateEdges;
