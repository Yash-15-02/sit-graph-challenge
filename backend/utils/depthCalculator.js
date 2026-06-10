/**
 * Calculates the depth of a tree starting from the root.
 * Depth is defined as the node count on the longest root-to-leaf path.
 * A single node has depth 1.
 * 
 * @param {String} node - Current node ID
 * @param {Object} adj - Directed adjacency list (parent -> [children])
 * @returns {Number} - The maximum depth of the tree
 */
function calculateDepth(node, adj) {
  const children = adj[node] || [];
  if (children.length === 0) {
    return 1;
  }
  
  let maxChildDepth = 0;
  for (const child of children) {
    maxChildDepth = Math.max(maxChildDepth, calculateDepth(child, adj));
  }
  
  return 1 + maxChildDepth;
}

module.exports = calculateDepth;
