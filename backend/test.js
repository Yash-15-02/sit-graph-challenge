const assert = require('assert').strict;
const validateEdges = require('./utils/validateEdges');
const buildGraph = require('./utils/graphBuilder');

const testCases = [
  {
    name: "1. Simple Valid Tree construction and Depth calculation",
    input: ["A->B", "A->C", "B->D"],
    expected: {
      invalid_entries: [],
      duplicate_edges: [],
      summary: {
        total_trees: 1,
        total_cycles: 0,
        largest_tree_root: "A"
      },
      hierarchies: [
        {
          root: "A",
          tree: {
            "A": {
              "B": {
                "D": {}
              },
              "C": {}
            }
          },
          depth: 3
        }
      ]
    }
  },
  {
    name: "2. Edge cases of Validation (invalid entries)",
    input: ["hello", "1->2", "AB->C", "A-B", "A->", "A->A", "", "  B->C  "],
    expected: {
      invalid_entries: ["hello", "1->2", "AB->C", "A-B", "A->", "A->A", ""],
      duplicate_edges: [],
      hierarchies: [
        {
          root: "B",
          tree: {
            "B": {
              "C": {}
            }
          },
          depth: 2
        }
      ],
      summary: {
        total_trees: 1,
        total_cycles: 0,
        largest_tree_root: "B"
      }
    }
  },
  {
    name: "3. Duplicate handling (only once in duplicate_edges)",
    input: ["A->B", "A->B", "A->B", "A->C"],
    expected: {
      invalid_entries: [],
      duplicate_edges: ["A->B"],
      hierarchies: [
        {
          root: "A",
          tree: {
            "A": {
              "B": {},
              "C": {}
            }
          },
          depth: 2
        }
      ],
      summary: {
        total_trees: 1,
        total_cycles: 0,
        largest_tree_root: "A"
      }
    }
  },
  {
    name: "4. Multi-parent rule (first parent wins, silently ignore later)",
    input: ["A->D", "B->D", "A->C"],
    expected: {
      invalid_entries: [],
      duplicate_edges: [],
      hierarchies: [
        {
          root: "A",
          tree: {
            "A": {
              "C": {},
              "D": {}
            }
          },
          depth: 2
        }
      ],
      summary: {
        total_trees: 1,
        total_cycles: 0,
        largest_tree_root: "A"
      }
    }
  },
  {
    name: "5. Cycle detection (using DFS)",
    input: ["A->B", "B->C", "C->A"],
    expected: {
      invalid_entries: [],
      duplicate_edges: [],
      hierarchies: [
        {
          root: "A", // lexicographically smallest node in cycle component
          tree: {},
          has_cycle: true
        }
      ],
      summary: {
        total_trees: 0,
        total_cycles: 1,
        largest_tree_root: ""
      }
    }
  },
  {
    name: "6. Multiple disconnected trees (forest) & preserving order",
    input: ["X->Y", "A->B", "A->C"],
    expected: {
      invalid_entries: [],
      duplicate_edges: [],
      hierarchies: [
        {
          root: "X",
          tree: {
            "X": {
              "Y": {}
            }
          },
          depth: 2
        },
        {
          root: "A",
          tree: {
            "A": {
              "B": {},
              "C": {}
            }
          },
          depth: 2
        }
      ],
      summary: {
        total_trees: 2,
        total_cycles: 0,
        largest_tree_root: "A" // Tie-breaker: A < X
      }
    }
  }
];

function runTests() {
  console.log("=== RUNNING BACKEND UNIT TESTS ===");
  let passed = 0;
  let failed = 0;

  for (const tc of testCases) {
    try {
      console.log(`\nTest Case: ${tc.name}`);
      
      const { validEdges, invalidEntries, duplicateEdges } = validateEdges(tc.input);
      const { hierarchies, summary } = buildGraph(validEdges);

      // Verify invalid entries
      assert.deepEqual(invalidEntries, tc.expected.invalid_entries, "Invalid entries mismatch");
      
      // Verify duplicate edges
      assert.deepEqual(duplicateEdges, tc.expected.duplicate_edges, "Duplicate edges mismatch");

      // Verify summary
      assert.deepEqual(summary, tc.expected.summary, "Summary mismatch");

      // Verify hierarchies
      assert.equal(hierarchies.length, tc.expected.hierarchies.length, "Hierarchies count mismatch");
      
      for (let i = 0; i < hierarchies.length; i++) {
        const actualH = hierarchies[i];
        const expectedH = tc.expected.hierarchies[i];
        
        assert.equal(actualH.root, expectedH.root, `Root mismatch at index ${i}`);
        assert.deepEqual(actualH.tree, expectedH.tree, `Tree structure mismatch at index ${i}`);
        
        if (expectedH.has_cycle) {
          assert.equal(actualH.has_cycle, true, `Expected cycle flag at index ${i}`);
        } else {
          assert.equal(actualH.depth, expectedH.depth, `Depth mismatch at index ${i}`);
        }
      }

      console.log("🟢 Passed");
      passed++;
    } catch (err) {
      console.error("🔴 Failed");
      console.error(err);
      failed++;
    }
  }

  console.log(`\n=== TEST SUMMARY: ${passed} passed, ${failed} failed ===`);
  if (failed > 0) {
    process.exit(1);
  } else {
    console.log("All backend tests passed successfully!");
  }
}

runTests();
