


/* =====================
   LOAD SENTICNET WORD LIST
   ===================== */

let positiveWords = new Set();
let negativeWords = new Set();

fetch("senticnet.txt")
  .then(r => r.text())
  .then(data => {

    data.split("\n").forEach(line => {

      let parts = line.trim().split(/\s+/);

      if (parts.length >= 2) {

        let polarity = parts[0];

        let word = parts[parts.length - 1].toLowerCase();

        if (polarity === "positive") positiveWords.add(word);
        if (polarity === "negative") negativeWords.add(word);

      }

    });

    console.log(
      "Loaded words:",
      positiveWords.size,
      negativeWords.size
    );

  });



/* =====================
   FIND UI ELEMENTS
   (wrapped in DOMContentLoaded so elements always exist)
   ===================== */

document.addEventListener("DOMContentLoaded", () => {

  /* FIX 1 — use IDs, not class selectors                      */
  /* FIX 2 — clearBtn was ".btn-secondary"; button is ".btn-ghost" */

  const analyzeBtn     = document.getElementById("analyze-btn");
  const clearBtn       = document.getElementById("clear-btn");
  const sampleBtn      = document.getElementById("sample-btn");
  const textarea       = document.getElementById("sentiment-input");
  const card           = document.getElementById("result-card");
  const label          = document.getElementById("result-label");
  const score          = document.getElementById("result-score");
  const confidenceFill = document.getElementById("confidence-fill");
  const confidencePct  = document.getElementById("confidence-text");
  const charCount      = document.getElementById("char-count");



  /* =====================
     LIVE CHAR COUNTER
     ===================== */

  textarea?.addEventListener("input", () => {
    if (charCount) charCount.textContent = textarea.value.length;
  });



  /* =====================
     ANALYZE FUNCTION
     ===================== */

  function runAnalysis() {

    if (!textarea) return;

    let words = textarea.value
      .toLowerCase()
      .split(/\W+/);

    let pos = 0;
    let neg = 0;

    words.forEach(w => {
      if (positiveWords.has(w)) pos++;
      if (negativeWords.has(w)) neg++;
    });

    let sentiment = "neutral";

    if (pos > neg) sentiment = "positive";
    else if (neg > pos) sentiment = "negative";


    /* SHOW CARD */

    if (card) {
      card.classList.remove("hidden");
      card.classList.add("revealed");
    }


    /* TEXT */

    if (label) label.textContent = sentiment.toUpperCase();

    if (score) score.textContent = "Positive: " + pos + " | Negative: " + neg;


    /* CONFIDENCE */

    let total = pos + neg;

    let confidence = total === 0
      ? 0
      : Math.round(Math.max(pos, neg) / total * 100);

    if (confidenceFill) confidenceFill.style.width = confidence + "%";
    if (confidencePct)  confidencePct.textContent  = confidence + "%";


    /* COLOUR */

    document.getElementById("app").classList.remove(
      "state-positive",
      "state-negative",
      "state-neutral"
    );

    card?.classList.remove(
      "card-positive",
      "card-negative",
      "card-neutral"
    );

    if (sentiment === "positive") {
      document.getElementById("app").classList.add("state-positive");
      card?.classList.add("card-positive");
    }
    else if (sentiment === "negative") {
      document.getElementById("app").classList.add("state-negative");
      card?.classList.add("card-negative");
    }
    else {
      card?.classList.add("card-neutral");
    }

  }



  /* =====================
     ANALYZE BUTTON
     ===================== */

  analyzeBtn?.addEventListener("click", () => {

    /* start loading */
    analyzeBtn.classList.add("btn-loading");

    /* small delay for animation */
    setTimeout(() => {

      runAnalysis();

      /* stop loading */
      analyzeBtn.classList.remove("btn-loading");

    }, 300);

  });

  /* Ctrl+Enter shortcut */
  textarea?.addEventListener("keydown", e => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      analyzeBtn?.click();
    }
  });



  /* =====================
     CLEAR BUTTON
     FIX: was querying ".btn-secondary" — button class is ".btn-ghost"
     FIX: also resets char counter
     ===================== */

  clearBtn?.addEventListener("click", () => {

    /* clear text */
    if (textarea) textarea.value = "";

    /* FIX 3 — reset char counter */
    if (charCount) charCount.textContent = "0";

    /* hide card */
    card?.classList.add("hidden");
    card?.classList.remove(
      "revealed",
      "card-positive",
      "card-negative",
      "card-neutral"
    );

    /* reset colour */
    document.getElementById("app").classList.remove(
      "state-positive",
      "state-negative",
      "state-neutral"
    );

    /* reset confidence */
    if (confidenceFill) confidenceFill.style.width = "0%";
    if (confidencePct)  confidencePct.textContent  = "0%";

    /* stop any loading state */
    analyzeBtn?.classList.remove("btn-loading");

    /* return focus to textarea */
    textarea?.focus();

  });

});
