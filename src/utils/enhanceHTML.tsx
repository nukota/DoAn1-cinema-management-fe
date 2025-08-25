// Enhance plain HTML appearance by injecting styles for better readability and formatting
// - Increases base text size
// - Adds dots before list items
// - Styles headings, paragraphs, and links

export function enhanceHTML(html: string): string {
  // CSS styles to inject
  const style = `
    <style>
      .enhanced-html-content {
        font-size: 0.95rem;
        line-height: 1.5;
        color: #222;
      }
      .enhanced-html-content ul {
        list-style-type: disc;
        margin-left: 1.5em;
        padding-left: 0.5em;
      }
      .enhanced-html-content ol {
        list-style-type: decimal;
        margin-left: 1.5em;
        padding-left: 0.5em;
      }
      .enhanced-html-content li {
        margin-bottom: 0.25em;
      }
      .enhanced-html-content h1 {
        font-size: 1.08rem;
        margin-top: 1em;
        margin-bottom: 0.5em;
      }
      .enhanced-html-content h2 {
        font-size: 1rem;
        margin-top: 0.9em;
        margin-bottom: 0.4em;
      }
      .enhanced-html-content h3 {
        font-size: 0.97rem;
        margin-top: 0.8em;
        margin-bottom: 0.3em;
      }
      .enhanced-html-content p {
        margin-bottom: 0.6em;
      }
      .enhanced-html-content a {
        color: #e53935;
        text-decoration: underline;
      }
    </style>
  `;
  // Wrap HTML in a div for scoping
  return `${style}<div class="enhanced-html-content">${html}</div>`;
}
