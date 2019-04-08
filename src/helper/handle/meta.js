export function loadMeta(meta, globl = null) {
  if (globl === null) {
    return;
  }

  if (typeof meta.date !== 'undefined') {
    return;
  }

  let session = sessionStorage.getItem(globl);
  session = JSON.parse(session);

  Object.assign(meta, session);
}

export function saveMeta(meta, globl = null) {
  if (globl === null) {
    return;
  }

  meta = JSON.stringify(meta);
  sessionStorage.setItem(globl, meta);
}
