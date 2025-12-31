---
permalink: /deep-dive/dl-ch1/
title: "Chapter 1: 深度学习的历史趋势"
excerpt: ""
author_profile: false
---

# Chapter 1: 深度学习的历史趋势
[Back to Deep Learning Reading Notes]({{ '/deep-dive/dl-reading-notes/' | relative_url }})

<div class="toc-mobile">
  <input class="toc-toggle" type="checkbox" id="toc-toggle">
  <label class="toc-toggle__button" for="toc-toggle"><i class="fas fa-list" aria-hidden="true"></i><span class="sr-only">Contents</span></label>
  <label class="toc-backdrop" for="toc-toggle"></label>
  <div class="toc-drawer" role="dialog" aria-labelledby="toc-mobile-title">
    <div class="toc-drawer__inner">
      <p id="toc-mobile-title" class="toc-block__title">Table of Contents</p>
      <ul class="toc-block__list">
        <li><a href="#background">Background</a></li>
        <li><a href="#xor-polynomial">XOR Polynomial</a></li>
        <li><a href="#visualization">Visualization</a></li>
      </ul>
    </div>
  </div>
</div>

<div class="article-layout">
  <div class="article-main" markdown="1">

## Background {#background}
本节来自《Deep Learning》一书的第 1 章笔记。

## XOR Polynomial {#xor-polynomial}
我通过升维的方式构造了一个多项式函数来处理 XOR 问题，函数如下：

$$
z = 4\Bigl(\frac{1}{\sqrt{2}}x+\frac{1}{\sqrt{2}}y-\frac{1}{\sqrt{2}}\Bigr)^{2}
  + 2\Bigl(-\frac{1}{\sqrt{2}}x+\frac{1}{\sqrt{2}}y\Bigr)^{2}
  - 1 \tag{1}
$$

## Visualization {#visualization}
下面是 3D 曲面图（可拖动旋转/缩放）：

<div id="xor-polynomial-plot" style="width: 100%; height: 65vh; max-height: 420px;"></div>

<script src="{{ '/assets/vendor/plotly/plotly-2.26.0.min.js' | relative_url }}"></script>
<script>
  (function () {
    function renderPlot() {
      if (!window.Plotly) return;
      var s = Math.SQRT1_2;
      var steps = 60;
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
          var xv = x[xi];
          var yv = y[yi];
          row.push(f(xv, yv));
        }
        z.push(row);
      }
      var onSurface = [
        { x: 0, y: 1 },
        { x: 1, y: 0 }
      ];
      var belowSurface = [
        { x: 0, y: 0 },
        { x: 1, y: 1 }
      ];
      function buildPoints(points, useSurfaceZ) {
        var px = [];
        var py = [];
        var pz = [];
        for (var pi = 0; pi < points.length; pi++) {
          px.push(points[pi].x);
          py.push(points[pi].y);
          pz.push(useSurfaceZ ? f(points[pi].x, points[pi].y) : 0);
        }
        return { x: px, y: py, z: pz };
      }
      var onData = buildPoints(onSurface, true);
      var belowData = buildPoints(belowSurface, false);
      var data = [
        {
          type: "surface",
          x: x,
          y: y,
          z: z,
          colorscale: "Viridis",
          contours: {
            z: {
              show: true,
              start: 0,
              end: 0,
              size: 1,
              color: "#ffffff"
            }
          },
          showscale: false
        },
        {
          type: "scatter3d",
          mode: "markers",
          x: onData.x,
          y: onData.y,
          z: onData.z,
          name: "On surface",
          marker: {
            size: 3,
            color: "#d1495b"
          }
        },
        {
          type: "scatter3d",
          mode: "markers",
          x: belowData.x,
          y: belowData.y,
          z: belowData.z,
          name: "Below surface",
          marker: {
            size: 3,
            color: "#2f855a"
          }
        }
      ];
      var layout = {
        margin: { l: 0, r: 0, t: 20, b: 0 },
        showlegend: true,
        scene: {
          xaxis: { title: "x", showline: true, zeroline: true },
          yaxis: { title: "y", showline: true, zeroline: true },
          zaxis: { title: "z", showline: true, zeroline: true }
        }
      };
      Plotly.newPlot("xor-polynomial-plot", data, layout, { responsive: true });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", renderPlot);
    } else {
      renderPlot();
    }
  })();
</script>

</div>
  <aside class="article-toc">
    <details class="toc-panel" open>
      <summary class="toc-panel__toggle">Contents</summary>
      <div class="toc-block">
        <p class="toc-block__title">Table of Contents</p>
        <ul class="toc-block__list">
          <li><a href="#background">Background</a></li>
          <li><a href="#xor-polynomial">XOR Polynomial</a></li>
          <li><a href="#visualization">Visualization</a></li>
        </ul>
      </div>
    </details>
  </aside>
</div>
