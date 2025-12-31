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
        <li><a href="#normal-equation">谈一谈正规方程</a></li>
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

## 谈一谈正规方程 {#normal-equation}

+ 正规方程与梯度下降都是找寻成本函数 $J({\mathbf{w},b};\mathbf{X},\mathbf{y})$ 极小值点的方法。他们之间的区别是正规方程一步到位直接求出最小值点，而梯度下降是沿梯度方向逐步逼近极小值点。但正规方程只适用于参数为线性且代价函数为平方误差的模型，可以求其成本函数 $J=\frac{1}{2m}\sum(\mathbf{w^T x}+b-\mathbf{y})^2$ 的最小值点。

+ 下面做一个分情形推导，统一把 $\mathbf{x}^{(i)}$ 视为第 $i$ 个样本的**行向量**：

    设样本数为 $m$ , 特征维度为 $n$ .

    + 对于特征维度为 1 且忽略偏置 $b$ 的情况

        **① $n=1$，忽略 $b$**

        设 $\mathbf{x}^{(i)} = [x^{(i)}] \in \mathbb{R}^{1\times 1}$ 为第 $i$ 个样本的特征**行向量**，$y^{(i)}$ 为标签(target)。

        目标函数：

        $$J(w) = \frac{1}{2m} \sum_{i=1}^m (w x^{(i)} - y^{(i)})^2 \tag{1}$$

        求导并令其为 0：

        $$\frac{d J}{d w} = \frac{1}{m} \sum_{i=1}^m (w x^{(i)} - y^{(i)}) x^{(i)} = 0 \tag{2}$$

        向量化形式 (Vectorization)：

        令列向量 $\mathbf{x} \in \mathbb{R}^{m}$，$\mathbf{y} \in \mathbb{R}^{m}$ 为堆叠后的样本与标签向量。

        将式(2)转化为：

        $$\mathbf{x}^T (w \mathbf{x} - \mathbf{y}) = 0 \tag{3}$$

        $$w (\mathbf{x}^T \mathbf{x}) = \mathbf{x}^T \mathbf{y} \tag{4}$$

        解析解：

        $$w = \frac{\mathbf{x}^T \mathbf{y}}{\mathbf{x}^T \mathbf{x}} \tag{5}$$

    + 引入偏置 $b$ (With Bias)

        **② $n=1$，引入 $b$**，样本数为 $m$

        $$J = \frac{1}{2m} \sum (wx + b - y)^2 \tag{6}$$
    
        为了方便计算，我们将 $w\mathbf{x}+b$ 转化为 $X\theta$，其中

        $$X = \begin{bmatrix} 1 & x^{(1)} \\ \vdots & \vdots \\ 1 & x^{(m)} \end{bmatrix}, \quad
        \theta = \begin{bmatrix} b \\ w \end{bmatrix}, \quad
        \mathbf{x}^{(i)} = \begin{bmatrix} 1 & x^{(i)} \end{bmatrix}$$

        $$J = \frac{1}{2m} \sum (\mathbf{x}_{1\times 2}^{(i)}\theta_{2\times 1} - y^{(i)})^2 \tag{7}$$

        $$\frac{\partial J}{\partial \theta} = \frac{1}{m} \sum (\mathbf{x}^{(i)}\theta - y^{(i)}) (\mathbf{x}^{(i)})^T = 0 \tag{8}$$
    
        将样本 $\mathbf{x}^{(i)}$ 按行拼接为 $X$，从而去掉 $\sum$ 符号：

        $$X = \begin{bmatrix} \mathbf{x}^{(1)} \\ \vdots  \\ \mathbf{x}^{(m)} \end{bmatrix}
        = \begin{bmatrix} 1 & x^{(1)} \\ \vdots & \vdots \\ 1 & x^{(m)} \end{bmatrix}$$

        $$X^T (X\theta - y) = 0 \tag{9}$$

        $$X^T X \theta = X^T y \tag{10}$$

        $$\theta = (X^T X)^{-1} X^T y \tag{11}$$

        即：

        $$\begin{bmatrix} b \\ w \end{bmatrix} = (X^T X)^{-1} X^T y \tag{12}$$

        **为什么可以将 $\begin{cases} \frac{\partial J}{\partial w} = 0 \\ \frac{\partial J}{\partial b} = 0 \end{cases}$ 转化为 $\frac{\partial J}{\partial \theta} = 0$ ?**

        $$\frac{\partial J}{\partial \theta} = 0 \iff \begin{bmatrix} \frac{\partial J}{\partial b} \\ \frac{\partial J}{\partial w} \end{bmatrix} = \mathbf{0} \iff \vec{grad} \ J = \mathbf{0} \quad \tag{13}$$

    + 推广到多元线性回归，样本特征维度为 $n$

        **③ $n>1$**

        $$J = \frac{1}{2m} \sum (\mathbf{x}^{(i)}\theta - y^{(i)})^2 \tag{14}$$

        其中:

        $$X = \begin{bmatrix} \mathbf{x}^{(1)} \\ \vdots  \\ \mathbf{x}^{(m)} \end{bmatrix}
        = \underbrace{\begin{bmatrix} 1 & x_1^{(1)} & x_2^{(1)} & \cdots & x_n^{(1)} \\ 1 & x_1^{(2)} & x_2^{(2)} & \cdots & x_n^{(2)} \\ \vdots & \vdots & \vdots & \ddots & \vdots \\ 1 & x_1^{(m)} & x_2^{(m)} & \cdots & x_n^{(m)} \end{bmatrix}}_{m \times (n+1)} \quad$$
        $$\theta = \underbrace{\begin{bmatrix} b \\ w_1 \\ w_2 \\ \vdots \\ w_n \end{bmatrix}}_{(n+1) \times 1} \tag{15}$$

        同理得:

        $$X^T (X\theta - y) = 0 \tag{16}$$

        $$\theta = (X^T X)^{-1} X^T y \tag{17}$$

    综上, 对于任意一种情况都有正规方程的形式永远不变。使得成本函数$J({\mathbf{w},b};\mathbf{X},\mathbf{y})$取得最小值的点为: 
    
    $$\theta = (X^T X)^{-1} X^T y \tag{18}$$

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
          <li><a href="#normal-equation">谈一谈正规方程</a></li>
        </ul>
      </div>
    </details>
  </aside>
</div>



