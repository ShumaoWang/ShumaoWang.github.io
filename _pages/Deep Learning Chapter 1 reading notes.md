---
permalink: /deep-dive/dl-ch1/
title: "Deep Learning Chapter 1 Reading Notes"
excerpt: ""
author_profile: false
---

# Deep Learning Chapter 1 Reading Notes

通过升维方法可以构造一个多项式函数来解决线性函数无法表示异或($XOR$)的问题，函数如下：

$$
4\left(\frac{\sqrt{2}}{2}x+\frac{\sqrt{2}}{2}y-\frac{\sqrt{2}}{2}\right)^{2}+2\left(-\frac{\sqrt{2}}{2}x+\frac{\sqrt{2}}{2}y\right)^{2}-1=z
$$

下面是 3D 曲面图：

<div id="xor-polynomial-plot" style="width: 100%; height: 420px;"></div>

<script src="https://cdn.plot.ly/plotly-2.26.0.min.js"></script>
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
        { x: 0, y: 1, label: "(0,1) on surface" },
        { x: 1, y: 0, label: "(1,0) on surface" }
      ];
      var belowSurface = [
        { x: 0, y: 0, label: "(0,0) below surface" },
        { x: 1, y: 1, label: "(1,1) below surface" }
      ];
      function buildPoints(points, useSurfaceZ) {
        var px = [];
        var py = [];
        var pz = [];
        var ptext = [];
        for (var pi = 0; pi < points.length; pi++) {
          px.push(points[pi].x);
          py.push(points[pi].y);
          pz.push(useSurfaceZ ? f(points[pi].x, points[pi].y) : 0);
          ptext.push(points[pi].label);
        }
        return { x: px, y: py, z: pz, text: ptext };
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
          mode: "markers+text",
          x: onData.x,
          y: onData.y,
          z: onData.z,
          text: onData.text,
          textposition: "top center",
          name: "On surface",
          marker: {
            size: 3,
            color: "#d1495b"
          }
        },
        {
          type: "scatter3d",
          mode: "markers+text",
          x: belowData.x,
          y: belowData.y,
          z: belowData.z,
          text: belowData.text,
          textposition: "top center",
          name: "Below surface",
          marker: {
            size: 3,
            color: "#2b6cb0"
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
