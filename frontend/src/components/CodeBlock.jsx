import React, { useEffect, useRef, Suspense } from "react";
const Prism = React.lazy(() => import("prismjs"));
import "prismjs/themes/prism.css"; // lazy import still adds CSS; consider CSS-splitting

export default function CodeBlock({ language = "javascript", code = "" }) {
  const preRef = useRef();
  useEffect(() => {
    let mounted = true;
    import("prismjs/components/prism-" + language).catch(() => {});
    if (mounted) {
      // highlight after component mounts / language module loaded
      requestAnimationFrame(() => {
        if (preRef.current && window.Prism)
          window.Prism.highlightElement(preRef.current);
      });
    }
    return () => { mounted = false; };
  }, [language, code]);

  return (
    <Suspense fallback={<pre>{code}</pre>}>
      <pre aria-label="code block">
        <code ref={preRef} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </Suspense>
  );
}
