export const mergeWithoutDuplicates = (
  oldValues: any[] = [],
  newValues: any[] = [],
) => {
  const map = new Map();

  [...oldValues, ...newValues].forEach(post => {
    map.set(post.id, post);
  });

  return Array.from(map.values());
};
