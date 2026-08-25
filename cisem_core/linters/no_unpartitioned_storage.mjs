/**
 * @fileoverview ESLint rule M1: Refuse unpartitioned browser storage outside tenantStorageAdapter
 * @author CISEM Antigravity
 */

function getStoragePropertyName(node) {
  if (!node) return null;
  if (node.type === 'Identifier') return node.name;
  if (node.type === 'Literal' && typeof node.value === 'string') return node.value;
  return null;
}

function isLocalStorageNode(node) {
  if (!node) return false;
  if (node.type === 'Identifier' && node.name === 'localStorage') return true;
  if (node.type === 'MemberExpression') {
    const propName = getStoragePropertyName(node.property);
    if (propName === 'localStorage') {
      let root = node.object;
      while (root && root.type === 'MemberExpression') {
        root = root.object;
      }
      if (root && root.type === 'Identifier' && ['window', 'globalThis', 'self'].includes(root.name)) {
        return true;
      }
    }
  }
  return false;
}

const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Refuse direct localStorage calls outside tenantStorageAdapter',
      category: 'CISEM Security',
      recommended: true,
    },
    schema: [],
    messages: {
      noDirectStorage: 'CISEM Protocol Violation (M1): Direct localStorage.{{method}} call prohibited outside tenantStorageAdapter.js. Use tenantStorageAdapter instead.',
    },
  },
  create(context) {
    const filename = context.getFilename();
    if (filename.includes('tenantStorageAdapter') || filename.includes('test_')) {
      return {};
    }

    const TARGET_METHODS = ['getItem', 'setItem', 'removeItem', 'clear'];

    return {
      MemberExpression(node) {
        const propName = getStoragePropertyName(node.property);
        if (propName && TARGET_METHODS.includes(propName)) {
          if (isLocalStorageNode(node.object)) {
            context.report({
              node,
              messageId: 'noDirectStorage',
              data: { method: propName }
            });
          }
        }
      },
      VariableDeclarator(node) {
        if (node.id && node.id.type === 'ObjectPattern' && node.init && isLocalStorageNode(node.init)) {
          node.id.properties.forEach((prop) => {
            const propName = getStoragePropertyName(prop.key || prop.value);
            if (propName && TARGET_METHODS.includes(propName)) {
              context.report({
                node: prop,
                messageId: 'noDirectStorage',
                data: { method: propName }
              });
            }
          });
        }
      }
    };
  }
};

export default rule;
