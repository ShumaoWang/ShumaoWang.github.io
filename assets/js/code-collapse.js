(function () {
  function countLines(block) {
    var code = block.querySelector("pre code");
    if (!code) {
      code = block.querySelector("pre");
    }
    var text = code ? code.textContent : block.textContent;
    if (!text) {
      return 0;
    }
    var normalized = text.replace(/\r/g, "").replace(/\n+$/g, "");
    if (!normalized) {
      return 0;
    }
    return normalized.split("\n").length;
  }

  function wrapCodeBlocks() {
    var selectors = [
      ".page__content div.highlighter-rouge",
      ".page__content figure.highlight"
    ];
    var blocks = document.querySelectorAll(selectors.join(","));

    blocks.forEach(function (block) {
      if (block.closest("details.code-block")) {
        return;
      }

      var lineCount = countLines(block);
      var details = document.createElement("details");
      details.className = "code-block";
      if (lineCount <= 20) {
        details.open = true;
      }

      var summary = document.createElement("summary");
      summary.textContent = "Code";

      details.appendChild(summary);
      block.parentNode.insertBefore(details, block);
      details.appendChild(block);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wrapCodeBlocks);
  } else {
    wrapCodeBlocks();
  }
})();
