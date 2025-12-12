import { useEffect } from "react";

function isRTLText(text = "") {
  const rtlRegex = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  return rtlRegex.test(text);
}

export default function useDirection({ lang, sampleText } = {}) {
  useEffect(() => {
    let dir = "ltr";

    if (lang) {
      const rtlLangs = ["ar", "he", "fa", "ur"];
      if (rtlLangs.includes(lang.split("-")[0])) {
        dir = "rtl";
      }
    }

    if (sampleText && isRTLText(sampleText)) {
      dir = "rtl";
    }

    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("data-lang", lang || "");
  }, [lang, sampleText]);
}
