---
permalink: /deep-dive/dl-reading-notes/
title: "Deep Learning Reading Notes"
excerpt: ""
author_profile: false
---

# Deep Learning Reading Notes

来自《Deep Learning》一书的章节笔记与实验记录。

# Chapters
<div class="topic-cards">
  <article class="topic-card">
    <div class="topic-card__media topic-card__media--plot">
      <div id="dl-ch1-preview" class="topic-card__plot"></div>
    </div>
    <div class="topic-card__body">
      <h3 class="topic-card__title">
        <a href="{{ '/deep-dive/dl-ch1/' | relative_url }}" target="_self">Chapter 1: 深度学习的历史趋势</a>
      </h3>
      <p class="topic-card__meta">Notes and a polynomial surface demo for the XOR discussion in Chapter 1.</p>
    </div>
  </article>
</div>

<script src="{{ '/assets/vendor/plotly/plotly-2.26.0.min.js' | relative_url }}"></script>
<script>
  (function () {
    function renderPreview() {
      if (!window.Plotly) return;
      var s = Math.SQRT1_2;
      var steps = 35;
      var x = [];
      var y = [];
      for (var i = 0; i < steps; i++) {
        var v = -2 + (4 * i) / (steps - 1);
        x.push(v);
        y.push(v);
      }
      function f(xv, yv) {
        var t1 = s * xv + s * yv - s;
        var t2 = -s * xv + s * yv;
        return 4 * t1 * t1 + 2 * t2 * t2 - 1;
      }
      var z = [];
      for (var yi = 0; yi < y.length; yi++) {
        var row = [];
        for (var xi = 0; xi < x.length; xi++) {
          row.push(f(x[xi], y[yi]));
        }
        z.push(row);
      }
      var data = [
        {
          type: "surface",
          x: x,
          y: y,
          z: z,
          colorscale: "Viridis",
          showscale: false
        }
      ];
      var layout = {
        margin: { l: 0, r: 0, t: 0, b: 0 },
        scene: {
          xaxis: { visible: false },
          yaxis: { visible: false },
          zaxis: { visible: false },
          camera: { eye: { x: 1.4, y: 1.4, z: 0.8 } }
        },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)"
      };
      Plotly.newPlot("dl-ch1-preview", data, layout, {
        displayModeBar: false,
        responsive: true
      });

      var angle = 0;
      setInterval(function () {
        angle += 0.015;
        Plotly.relayout("dl-ch1-preview", {
          "scene.camera.eye": {
            x: 1.4 * Math.cos(angle),
            y: 1.4 * Math.sin(angle),
            z: 0.8
          }
        });
      }, 40);
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", renderPreview);
    } else {
      renderPreview();
    }
  })();
</script>
