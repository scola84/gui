import { select } from 'd3';

function max(content, maxHeight) {
  let currentHeight = 0;

  select(content).selectAll('form').each((d, i, n) => {
    currentHeight += n[i].getBoundingClientRect().height;
  });

  const contentRect = content.getBoundingClientRect();

  return Math.min(
    contentRect.height - currentHeight - 16,
    maxHeight
  );
}

export default function grow(datum, textarea) {
  textarea.style('height', 0);

  const node = textarea.node();
  const content = node.closest('.content');

  let maxHeight = node.scrollHeight;

  if (datum.mode !== 'self') {
    maxHeight = max(content, maxHeight);
  }

  const height = Math.max(datum.height || 32, maxHeight);

  textarea.style('height', height + 'px');
}
