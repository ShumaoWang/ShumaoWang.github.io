---
permalink: /deep-dive/ml-supervised/
title: "Supervised Machine Learning: Regression and Classification"
excerpt: ""
author_profile: false
---

# Supervised Machine Learning: Regression and Classification - Study Notes

[Back to Machine Learning Specialization]({{ '/deep-dive/ml-specialization/' | relative_url }})

<div class="toc-mobile">
  <input class="toc-toggle" type="checkbox" id="toc-toggle">
  <label class="toc-toggle__button" for="toc-toggle"><i class="fas fa-list" aria-hidden="true"></i><span class="sr-only">Contents</span></label>
  <label class="toc-backdrop" for="toc-toggle"></label>
  <div class="toc-drawer" role="dialog" aria-labelledby="toc-mobile-title">
    <div class="toc-drawer__inner">
      <p id="toc-mobile-title" class="toc-block__title">Table of Contents</p>
      <ul class="toc-block__list">
        <li><a href="#array-ambiguity">一维数组的歧义</a></li>
        <li><a href="#gradient-descent">梯度下降与凸函数</a></li>
        <li><a href="#numpy-dim">numpy 维度理解</a></li>
      </ul>
    </div>
  </div>
</div>

<div class="article-layout">
  <div class="article-main" markdown="1">

## 一维数组的歧义 {#array-ambiguity}
使用一维数组表示样本和特征具有二义性  
例如：

  ```python
  x = np.array([1.0,2.0,3.0])
  ```

  你没有办法区分这表示的是 `具有三个特征的一个样本`
  $\textbf{x}=\begin{bmatrix} 1 & 2 & 3 \end{bmatrix}$
  还是 `各具有一个特征的三个样本`
  $\mathbf{x}=\begin{bmatrix} 1 \\ 2 \\ 3\end{bmatrix}$。

  所以更好的方式是统一写成二维数组：

  ```python
  x = np.array([[1.0],[2.0],[3.0]])
  ```

## 梯度下降与凸函数 {#gradient-descent}
只要当前函数局部是凸函数，使用 $(w, b)-\alpha \vec{grad}$ 的下降方式，
在 $\vec{grad}\ J\neq 0$ 且步长 $\alpha$ 足够小时，总会使更新后的 $(w,b)$
沿梯度方向向局部极小值点下降。

同时梯度下降的一个特点是 $\vec{grad}\ J$ 本身会随着逼近极小值点而逐渐趋于 0，
所以在 $\alpha$ 固定的情况下，当 $(w,b)$ 趋于极小值点时，步长会逐渐减小。

## numpy 维度理解 {#numpy-dim}
关于 `numpy` 中的 `array`，我对其中维度的含义感到困惑：
- 对于**数组的**维度：若定位数组中的一个数据需要 n 个索引，则该数组为 n 维数组。
  对于矩阵来说，我们定位矩阵中的一个元素只需要两个索引，所以用二维数组表示。
  定义数组时，n 重括号对应 n 维数组，如 `x = np.array([[[1]]])` 为三维数组，
  使用 `x[0][0][0]` 定位，本质上就是索引的维度。
- 当我们使用二维数组定义好矩阵之后，对于**矩阵中**的维度，指的是每一个样本的特征维度
  (feature dimension)，即列数。此时说样本是高维数据指的是其特征维度较大。
  如一张 28*28 的灰度图片作为一个样本时，具有 784 个特征维度
  (每一个特征维度可能的取值为 0~255)。本质上就是每一个样本的特征维度。

</div>
  <aside class="article-toc">
    <details class="toc-panel" open>
      <summary class="toc-panel__toggle">Contents</summary>
      <div class="toc-block">
        <p class="toc-block__title">Table of Contents</p>
        <ul class="toc-block__list">
          <li><a href="#array-ambiguity">一维数组的歧义</a></li>
          <li><a href="#gradient-descent">梯度下降与凸函数</a></li>
          <li><a href="#numpy-dim">numpy 维度理解</a></li>
        </ul>
      </div>
    </details>
  </aside>
</div>
