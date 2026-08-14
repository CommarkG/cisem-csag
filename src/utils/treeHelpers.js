// Tree utility functions for hierarchical data

/**
 * Get all children (direct) of a given parentId
 */
export const getChildren = (items, parentId) => {
  return items
    .filter((item) => item.parentId === parentId)
    .sort((a, b) => a.order - b.order);
};

/**
 * Get all descendants (recursive) of a given parentId
 */
export const getDescendants = (items, parentId) => {
  const children = items.filter((item) => item.parentId === parentId);
  let descendants = [...children];
  children.forEach((child) => {
    descendants = [...descendants, ...getDescendants(items, child.id)];
  });
  return descendants;
};

/**
 * Get ancestor chain from root to the given item
 */
export const getAncestors = (items, itemId) => {
  const ancestors = [];
  let current = items.find((i) => i.id === itemId);
  while (current && current.parentId) {
    const parent = items.find((i) => i.id === current.parentId);
    if (parent) {
      ancestors.unshift(parent);
      current = parent;
    } else {
      break;
    }
  }
  return ancestors;
};

/**
 * Get the full path as an array of items from root to item
 */
export const getPath = (items, itemId) => {
  const item = items.find((i) => i.id === itemId);
  if (!item) return [];
  return [...getAncestors(items, itemId), item];
};

/**
 * Build a tree structure from flat items list
 */
export const buildTree = (items, parentId = null) => {
  return getChildren(items, parentId).map((item) => ({
    ...item,
    children: buildTree(items, item.id),
  }));
};

/**
 * Flatten a tree structure back to flat items
 */
export const flattenTree = (tree) => {
  let flat = [];
  tree.forEach((node) => {
    const { children, ...item } = node;
    flat.push(item);
    if (children && children.length > 0) {
      flat = [...flat, ...flattenTree(children)];
    }
  });
  return flat;
};

/**
 * Get all tasks (leaf items) from the hierarchy under a given node
 */
export const getTasksUnder = (items, nodeId) => {
  if (!nodeId) {
    return items.filter((i) => i.type === 'task');
  }
  const node = items.find((i) => i.id === nodeId);
  if (!node) return [];
  if (node.type === 'task') return [node];
  const descendants = getDescendants(items, nodeId);
  return descendants.filter((i) => i.type === 'task');
};

/**
 * Check if moving a node under a target would create a circular reference
 */
export const wouldCreateCycle = (items, nodeId, targetParentId) => {
  if (!targetParentId) return false;
  if (nodeId === targetParentId) return true;
  const descendants = getDescendants(items, nodeId);
  return descendants.some((d) => d.id === targetParentId);
};

/**
 * Get the allowed child type for a given parent type
 */
export const getAllowedChildType = (parentType) => {
  const map = {
    topic: 'subtopic',
    subtopic: 'project',
    project: 'subproject',
    subproject: 'task',
    task: null,
  };
  return parentType ? map[parentType] : 'topic';
};

/**
 * Get the next order number for a new item under a parent
 */
export const getNextOrder = (items, parentId) => {
  const siblings = getChildren(items, parentId);
  if (siblings.length === 0) return 0;
  return Math.max(...siblings.map((s) => s.order)) + 1;
};

/**
 * Count tasks by status under a node
 */
export const countByStatus = (items, nodeId) => {
  const tasks = getTasksUnder(items, nodeId);
  const counts = {};
  tasks.forEach((t) => {
    counts[t.status] = (counts[t.status] || 0) + 1;
  });
  counts._total = tasks.length;
  return counts;
};
