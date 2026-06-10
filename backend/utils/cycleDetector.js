/**
 * Detects if a directed cycle exists in a component of the graph.
 * Uses 3-color DFS algorithm:
 * 0 (unvisited)
 * 1 (visiting / in recursion stack)
 * 2 (visited / fully processed)
 * 
 * @param {Array} nodes - Array of node IDs in the component
 * @param {Object} adj - Directed adjacency list (parent -> [children])
 * @returns {Boolean} - True if a cycle exists, false otherwise
 */
function hasCycle(nodes, adj) {
  const visited = {}; // node -> status (0, 1, 2)

  // Initialize all nodes as unvisited
  for (const node of nodes) {
    visited[node] = 0;
  }

  function dfs(node) {
    visited[node] = 1; // mark as visiting (gray)

    const children = adj[node] || [];
    for (const child of children) {
      if (visited[child] === 1) {
        return true; // Cycle detected
      }
      if (visited[child] === 0) {
        if (dfs(child)) return true;
      }
    }

    visited[node] = 2; // mark as fully processed (black)
    return false;
  }

  // Run DFS from each node to ensure we cover all parts of the component
  for (const node of nodes) {
    if (visited[node] === 0) {
      if (dfs(node)) {
        return true;
      }
    }
  }

  return false;
}

module.exports = hasCycle;
