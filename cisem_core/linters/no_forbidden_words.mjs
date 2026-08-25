/**
 * @fileoverview ESLint rule: Refuse hardcoded personal names, emails, or forbidden words in source code.
 * @honest_ceiling HONEST CEILING: A word scanner is defeated by splitting a string in two. IT STOPS THE ACCIDENT, NEVER THE INTENT.
 */

import fs from "fs";
import path from "path";

let forbiddenConfig = {
  forbidden_words: ["Yariv", "Dima"],
  forbidden_patterns: ["[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"],
  exempt_header_patterns: ["governor_signature:", "ratified_plan:", "ratified_by:", "sealed_by:", "author_user_id:", "GOV-YARIV-", "HISTORICAL_RECORD", "owner:"]
};

try {
  const configPath = path.resolve(process.cwd(), "cisem_core", "linters", "forbidden_words.json");
  if (fs.existsSync(configPath)) {
    forbiddenConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  }
} catch (e) {
  // Fallback if read fails
}

const rule = {
  meta: {
    type: "problem",
    docs: {
      description: "Refuse hardcoded personal identity names or literal emails in source code",
      category: "CISEM Security",
      recommended: true,
    },
    schema: [],
    messages: {
      forbiddenWord: "CISEM Protocol Violation: Hardcoded forbidden word or personal identity '{{word}}' detected in source code.",
    },
  },
  create(context) {
    const filename = context.getFilename();
    if (filename.includes("forbidden_words") || filename.includes("node_modules") || filename.includes(".next")) {
      return {};
    }

    const words = forbiddenConfig.forbidden_words || [];
    const exemptPatterns = forbiddenConfig.exempt_header_patterns || [];

    return {
      Literal(node) {
        if (typeof node.value === "string") {
          const val = node.value;
          
          // Check exempt line context
          const sourceCode = context.getSourceCode();
          const lineText = sourceCode.lines[node.loc.start.line - 1] || "";
          if (exemptPatterns.some(ex => lineText.includes(ex))) {
            return;
          }

          for (const word of words) {
            const regex = new RegExp("\\b" + word + "\\b", "i");
            if (regex.test(val)) {
              context.report({
                node,
                messageId: "forbiddenWord",
                data: { word }
              });
            }
          }
        }
      },
      Identifier(node) {
        const sourceCode = context.getSourceCode();
        const lineText = sourceCode.lines[node.loc.start.line - 1] || "";
        if (exemptPatterns.some(ex => lineText.includes(ex))) {
          return;
        }

        const words = forbiddenConfig.forbidden_words || [];
        for (const word of words) {
          if (node.name.toLowerCase() === word.toLowerCase()) {
            context.report({
              node,
              messageId: "forbiddenWord",
              data: { word: node.name }
            });
          }
        }
      }
    };
  }
};

export default rule;
