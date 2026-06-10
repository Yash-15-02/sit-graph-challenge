const hasCycle = require('./cycleDetector');
const calculateDepth = require('./depthCalculator');

/**
 * Builds the graph representation, groups into components, detects cycles/roots,
 * and formats the response according to the rules.
 * 
 * @param {Array} validEdges - Array of {source, target, original}
 * @returns {Object} - { hierarchies: Array, summary: Object }
 */
function buildGraph(validEdges) {
  // 1. Gather all unique nodes
  const nodesSet = new Set();
  for (const edge of validEdges) {
    nodesSet.add(edge.source);
    nodesSet.add(edge.target);
  }
  const allNodes = Array.from(nodesSet);

  if (allNodes.length === 0) {
    return {
      hierarchies: [],
      summary: {
        total_trees: 0,
        total_cycles: 0,
        largest_tree_root: ""
      }
    };
  }

  // 2. Build undirected adjacency list for component grouping
  const undiAdj = {};
  for (const node of allNodes) {
    undiAdj[node] = [];
  }
  for (const edge of validEdges) {
    undiAdj[edge.source].push(edge.target);
    undiAdj[edge.target].push(edge.source);
  }

  // 3. Find weakly connected components (using BFS/DFS on undirected adjacency)
  const visited = new Set();
  const components = []; // Array of arrays of node IDs

  for (const node of allNodes) {
    if (!visited.has(node)) {
      const comp = [];
      const queue = [node];
      visited.add(node);
      
      while (queue.length > 0) {
        const curr = queue.shift();
        comp.push(curr);
        
        for (const neighbor of undiAdj[curr]) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
      components.push(comp);
    }
  }

  // 4. Map each node to its component index
  const nodeToCompIdx = {};
  components.forEach((comp, idx) => {
    for (const node of comp) {
      nodeToCompIdx[node] = idx;
    }
  });

  // 5. Order components based on first appearance in validEdges
  const orderedCompIndices = [];
  const addedComps = new Set();
  for (const edge of validEdges) {
    const compIdx = nodeToCompIdx[edge.source];
    if (!addedComps.has(compIdx)) {
      addedComps.add(compIdx);
      orderedCompIndices.push(compIdx);
    }
  }

  // 6. Build directed adjacency list (parent -> [children]) and calculate in-degree
  const dirAdj = {};
  const inDegree = {};
  for (const node of allNodes) {
    dirAdj[node] = [];
    inDegree[node] = 0;
  }
  for (const edge of validEdges) {
    dirAdj[edge.source].push(edge.target);
    inDegree[edge.target]++;
  }

  // 7. Process each component in order
  const hierarchies = [];
  let totalTrees = 0;
  let totalCycles = 0;
  let maxDepth = -1;
  let largestTreeRoot = "";

  for (const compIdx of orderedCompIndices) {
    const compNodes = components[compIdx];

    // Check if this component has a cycle
    const cycleExists = hasCycle(compNodes, dirAdj);

    if (cycleExists) {
      totalCycles++;
      // If cycle exists, find lexicographically smallest node in component
      const rootNode = [...compNodes].sort()[0];
      hierarchies.push({
        root: rootNode,
        tree: {},
        has_cycle: true
      });
    } else {
      totalTrees++;
      // Root is the node with in-degree 0
      let rootNode = compNodes.find(node => inDegree[node] === 0);
      
      // Fallback: If no root found (shouldn't happen for cycle-free, but just in case)
      if (!rootNode) {
        rootNode = [...compNodes].sort()[0];
      }

      // Build nested tree structure
      function buildSubtree(node) {
        const subtree = {};
        const children = dirAdj[node] || [];
        const sortedChildren = [...children].sort();
        for (const child of sortedChildren) {
          subtree[child] = buildSubtree(child);
        }
        return subtree;
      }

      const treeObject = {
        [rootNode]: buildSubtree(rootNode)
      };

      const depth = calculateDepth(rootNode, dirAdj);

      hierarchies.push({
        root: rootNode,
        tree: treeObject,
        depth: depth
      });

      // Update largest tree details
      if (depth > maxDepth) {
        maxDepth = depth;
        largestTreeRoot = rootNode;
      } else if (depth === maxDepth) {
        // Tie breaker: lexicographically smaller root
        if (rootNode < largestTreeRoot) {
          largestTreeRoot = rootNode;
        }
      }
    }
  }

  return {
    hierarchies,
    summary: {
      total_trees: totalTrees,
      total_cycles: totalCycles,
      largest_tree_root: largestTreeRoot
    }
  };
}

module.exports = buildGraph;
