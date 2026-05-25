import type { ProjectFile } from "./types";

/**
 * Build a single-document HTML string that the live-preview iframe can render
 * via the `srcDoc` attribute. CSS files are inlined into <style>. JS files are
 * inlined into <script>. Other relative references in index.html (e.g.
 * <link rel="stylesheet" href="styles.css">) are rewritten so they don't 404.
 */
export function buildPreviewSrcDoc(files: ProjectFile[]): string {
  const index = files.find((f) => f.path === "index.html");
  if (!index) {
    return fallbackHtml("index.html missing — generate a project to see a preview.");
  }

  let html = index.content;

  const cssFiles = files.filter((f) => /\.css$/i.test(f.path));
  const jsFiles = files.filter((f) => /\.m?js$/i.test(f.path));

  // Strip <link> tags pointing at our css files & <script src> at our js files
  for (const f of cssFiles) {
    const re = new RegExp(
      `<link[^>]+href=["']\\.?/?${escapeRe(f.path)}["'][^>]*>`,
      "gi"
    );
    html = html.replace(re, "");
  }
  for (const f of jsFiles) {
    const re = new RegExp(
      `<script[^>]+src=["']\\.?/?${escapeRe(f.path)}["'][^>]*></script>`,
      "gi"
    );
    html = html.replace(re, "");
  }

  const cssBlob = cssFiles
    .map((f) => `<style data-path="${f.path}">\n${f.content}\n</style>`)
    .join("\n");

  const jsBlob = jsFiles
    .map(
      (f) =>
        `<script data-path="${f.path}">\ntry {\n${f.content}\n} catch (e) { window.parent.postMessage({type:'preview-error', message: String(e && e.message || e), stack: e && e.stack}, '*'); }\n</script>`
    )
    .join("\n");

  const consoleBridge = `<script>
    (function(){
      var orig = { log: console.log, warn: console.warn, error: console.error };
      function send(level, args){
        try {
          var msg = Array.prototype.map.call(args, function(a){
            try { return typeof a === 'string' ? a : JSON.stringify(a); } catch(e){ return String(a); }
          }).join(' ');
          window.parent.postMessage({type:'preview-log', level: level, message: msg}, '*');
        } catch(e){}
      }
      ['log','warn','error'].forEach(function(l){
        console[l] = function(){ send(l, arguments); orig[l].apply(console, arguments); };
      });
      window.addEventListener('error', function(e){
        window.parent.postMessage({type:'preview-error', message: e.message, stack: e.error && e.error.stack}, '*');
      });
      window.addEventListener('unhandledrejection', function(e){
        window.parent.postMessage({type:'preview-error', message: 'Unhandled promise rejection: ' + (e.reason && e.reason.message || e.reason), stack: e.reason && e.reason.stack}, '*');
      });
    })();
  </script>`;

  // Inject style/script into <head>/<body>
  if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `${consoleBridge}\n${cssBlob}\n</head>`);
  } else {
    html = `${consoleBridge}\n${cssBlob}\n${html}`;
  }
  if (/<\/body>/i.test(html)) {
    html = html.replace(/<\/body>/i, `${jsBlob}\n</body>`);
  } else {
    html = `${html}\n${jsBlob}`;
  }
  return html;
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function fallbackHtml(message: string) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>Preview</title>
<style>body{font:14px/1.5 system-ui,sans-serif;background:#0b0b12;color:#9aa3b2;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;padding:24px;text-align:center}</style>
</head><body><div>${message}</div></body></html>`;
}
