import javascript from "shiki/langs/javascript.mjs";
import githubDark from "shiki/themes/github-dark.mjs";
import githubLight from "shiki/themes/github-light.mjs";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

let highlighterPromise: ReturnType<typeof createHighlighterCore> | undefined;

function getHighlighter() {
  highlighterPromise ??= createHighlighterCore({
    themes: [githubLight, githubDark],
    langs: [javascript],
    engine: createJavaScriptRegexEngine(),
  });

  return highlighterPromise;
}

export async function highlightJavaScript(code: string) {
  const highlighter = await getHighlighter();

  return highlighter.codeToTokens(code, {
    lang: "javascript",
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    defaultColor: false,
  }).tokens;
}
