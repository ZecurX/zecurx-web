import sanitizeHtml from 'sanitize-html';

export function sanitizeBlogContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'figure', 'figcaption', 'video', 'source',
      'iframe', 'pre', 'code', 'span', 'div',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'details', 'summary', 'mark', 'del', 'ins', 'sub', 'sup',
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['class', 'id', 'style'],
      'img': ['src', 'alt', 'title', 'width', 'height', 'loading'],
      'a': ['href', 'target', 'rel', 'title'],
      'iframe': ['src', 'width', 'height', 'frameborder', 'allowfullscreen', 'allow'],
      'video': ['src', 'controls', 'width', 'height', 'poster'],
      'source': ['src', 'type'],
      'code': ['class'],
      'pre': ['class'],
      'td': ['colspan', 'rowspan'],
      'th': ['colspan', 'rowspan'],
    },
    allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'player.vimeo.com'],
    allowedSchemes: ['http', 'https', 'mailto'],
    // Strip dangerous event handlers
    disallowedTagsMode: 'discard',
  });
}
