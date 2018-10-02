export default function renderMarkdown(node, name, format) {
  return node
    .text((d, i, n) => {
      const value = format(d, i, n, name);
      return typeof value === 'string' && value || null;
    })
    .html((d, i, n) => {
      if (n[i].textContent !== '') {
        return n[i].textContent;
      }

      const value = format(d, i, n, name);
      return value || '';
    });
}
