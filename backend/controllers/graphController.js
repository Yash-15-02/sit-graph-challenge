const identity = require('../config/identity');
const validateEdges = require('../utils/validateEdges');
const buildGraph = require('../utils/graphBuilder');

/**
 * Controller to handle POST /api/graph
 */
exports.processGraph = (req, res) => {
  try {
    const { edges } = req.body;

    if (!edges) {
      return res.status(400).json({
        error: "Missing 'edges' in request body."
      });
    }

    if (!Array.isArray(edges)) {
      return res.status(400).json({
        error: "'edges' must be an array of strings (e.g. ['A->B'])."
      });
    }

    // 1. Validate, filter, trim, deduplicate, check multi-parent
    const { validEdges, invalidEntries, duplicateEdges } = validateEdges(edges);

    // 2. Build graph components (trees/forests and cycle components)
    const { hierarchies, summary } = buildGraph(validEdges);

    // 3. Send structured response
    return res.status(200).json({
      user_id: identity.user_id,
      email_id: identity.email_id,
      enrollment_number: identity.enrollment_number,
      hierarchies,
      invalid_entries: invalidEntries,
      duplicate_edges: duplicateEdges,
      summary
    });

  } catch (error) {
    console.error("Error processing graph:", error);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
};
