---
permalink: /deep-dive/ml-supervised/
title: "Supervised Machine Learning: Regression and Classification"
excerpt: ""
author_profile: false
description: "监督学习课程笔记，涵盖正规方程、梯度下降、特征缩放与多项式回归。"
schema_type: "Article"
lang: "zh-CN"
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
        <li><a href="#rescaling">rescaling 是一个很妙的优化方法</a></li>
        <li><a href="#why-feature-scaling">为什么我们可以对特征做标准化/均值归一化?</a></li>
        <li><a href="#polynomial-regression">使用多项式回归方法(Polynomial Regression)在线性回归模型中解决非线性问题</a></li>
        <li><a href="#feature-selection">梯度下降方法也可以便于我们选出合适的特征</a></li>
        <li><a href="#question">Question</a></li>
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
        \mathbf{x}^{(i)} = \begin{bmatrix} 1 & x^{(i)} \end{bmatrix} \tag{7}$$

        $$J = \frac{1}{2m} \sum (\mathbf{x}_{1\times 2}^{(i)}\theta_{2\times 1} - y^{(i)})^2 \tag{8}$$

        $$\frac{\partial J}{\partial \theta} = \frac{1}{m} \sum (\mathbf{x}^{(i)}\theta - y^{(i)}) (\mathbf{x}^{(i)})^T = 0 \tag{9}$$
    
        将样本 $\mathbf{x}^{(i)}$ 按行拼接为 $X$，从而去掉 $\sum$ 符号：

        $$X = \begin{bmatrix} \mathbf{x}^{(1)} \\ \vdots  \\ \mathbf{x}^{(m)} \end{bmatrix}
        = \begin{bmatrix} 1 & x^{(1)} \\ \vdots & \vdots \\ 1 & x^{(m)} \end{bmatrix} \tag{10}$$

        $$X^T (X\theta - y) = 0 \tag{11}$$

        $$X^T X \theta = X^T y \tag{12}$$

        $$\theta = (X^T X)^{-1} X^T y \tag{13}$$

        即：

        $$\begin{bmatrix} b \\ w \end{bmatrix} = (X^T X)^{-1} X^T y \tag{14}$$

        **为什么可以将 $\begin{cases} \frac{\partial J}{\partial w} = 0 \\ \frac{\partial J}{\partial b} = 0 \end{cases}$ 转化为 $\frac{\partial J}{\partial \theta} = 0$ ?**

        $$\frac{\partial J}{\partial \theta} = 0 \iff \begin{bmatrix} \frac{\partial J}{\partial b} \\ \frac{\partial J}{\partial w} \end{bmatrix} = \mathbf{0} \iff \vec{grad} \ J = \mathbf{0} \quad \tag{15}$$

    + 推广到多元线性回归，样本特征维度为 $n$

        **③ $n>1$**

        $$J = \frac{1}{2m} \sum (\mathbf{x}^{(i)}\theta - y^{(i)})^2 \tag{16}$$

        其中:

        $$X = \begin{bmatrix} \mathbf{x}^{(1)} \\ \vdots  \\ \mathbf{x}^{(m)} \end{bmatrix}
        = \underbrace{\begin{bmatrix} 1 & x_1^{(1)} & x_2^{(1)} & \cdots & x_n^{(1)} \\ 1 & x_1^{(2)} & x_2^{(2)} & \cdots & x_n^{(2)} \\ \vdots & \vdots & \vdots & \ddots & \vdots \\ 1 & x_1^{(m)} & x_2^{(m)} & \cdots & x_n^{(m)} \end{bmatrix}}_{m \times (n+1)} \quad\tag{17}$$
        
        
        
        $$\theta = \underbrace{\begin{bmatrix} b \\ w_1 \\ w_2 \\ \vdots \\ w_n \end{bmatrix}}_{(n+1) \times 1} \tag{18}$$
        
        同理得:
        
        $$X^T (X\theta - y) = 0 \tag{19}$$
        
        $$\theta = (X^T X)^{-1} X^T y \tag{20}$$
    
    综上, 对于任意一种情况都有正规方程的形式永远不变。使得成本函数$J({\mathbf{w},b};\mathbf{X},\mathbf{y})$取得最小值的点为: 
    
    $$\theta = (X^T X)^{-1} X^T y \tag{21}$$

关于$X^TX$不可逆的情况

从计算复杂度的角度, 谈谈为什么大样本时我们使用梯度下降方法求解极小值点, 而不使用能直接求出极小值的正规方程方法



## rescaling 是一个很妙的优化方法 {#rescaling}

对于具有多个特征维度的回归问题来说, 特征归一化是一个很重要的优化方法. 通过将所有特征的取值范围(尺度)都压缩到统一的$[-1, 1]$或$[-0.5,0.5]$的区间, 使得我们在做梯度下降时, 统一每个方向的步长大小, 从而避免出现在学习率 $\alpha$ 固定时(步长比例相同), 某个方向步长过大, 某个方向步长过小, 使得梯度下降过程收敛缓慢**甚至发散**.![Gemini_Generated_Image_s6f0mus6f0mus6f0](https://typora-mseei.oss-cn-chengdu.aliyuncs.com/Gemini_Generated_Image_s6f0mus6f0mus6f0.png)

举个例子: 

在未归一化的情况下，假设我们有两个特征：

- $x_1$（范围 $0 \sim 1000$）：由它决定的参数 $\theta_1$ 对代价函数极其敏感，梯度的数值非常大。
- $x_2$（范围 $0 \sim 1$）：由它决定的参数 $\theta_2$ 对代价函数很不敏感，梯度的数值非常小。

![Gemini_Generated_Image_i50d7yi50d7yi50d](https://typora-mseei.oss-cn-chengdu.aliyuncs.com/Gemini_Generated_Image_i50d7yi50d7yi50d.png)

此时，我们在选择全局统一的学习率 $\alpha$ 时会陷入困境：

1. 若迁就 $x_1$（选小的 $\alpha$）：

    为了防止在 $\theta_1$ 方向上步长过大导致发散（Overshoot），只能选一个极小的 $\alpha$。

    - **后果**：$\theta_1$ 正常收敛了，但 $\theta_2$ 方向上的步长（$\alpha \cdot \text{small\_gradient}$）会变得微乎其微，几乎停滞不前。收敛速度被严重拖慢。

2. 若迁就 $x_2$（选大的 $\alpha$）：

    为了让 $\theta_2$ 走快点，选一个较大的 $\alpha$。

    - **后果**：$\theta_2$ 速度正常了，但在 $\theta_1$ 方向上，步长（$\alpha \cdot \text{huge\_gradient}$）会大到直接飞出最小值，导致无法收敛甚至发散。

将所有特征压缩到 $[-1, 1]$ 后：

- 所有参数 $\theta_j$ 对代价函数的敏感度（也就是梯度的量级）变得一致了。
- 消除了短板：我们不再受制于“最敏感的那个特征”。
- 我们可以放心地选择一个相对较大的 $\alpha$，这个 $\alpha$ 对所有维度都是适用的、高效的。
- 此时成本函数$J(\mathbf{w},b)$的等高线接近正圆，梯度下降像是在“走直线”，效率最高。

我们可以使用均值归一化的手段来将所有维度的特征都**放大或缩小**到统一的尺度, 可以保证两个数据的跨度总小于等于1.

假设 $m$ 是样本总数，$x_j^{(i)}$ 表示第 $i$ 个样本的第 $j$ 个特征。

1. 均值 $\mu_j$ (Feature-wise Mean)：

    是针对整个训练集中第 $j$ 个特征的所有取值求平均：

    $$\mu_j = \frac{1}{m} \sum_{i=1}^{m} x_j^{(i)}$$

2. 极差 $s_j$ (Feature-wise Range)：

    是针对整个训练集中第 $j$ 个特征的最大值和最小值：

    $$s_j = \max(x_j) - \min(x_j)$$

3. 归一化公式：

    $$x_j^{(i)} \leftarrow \frac{x_j^{(i)} - \mu_j}{s_j}$$

 $x_j-\mu_j$ 是为了去中心化, 使得特征的中心平移到原点. 除以 $s$ 使得两个数据的距离始终小于等于1, 对每个特征做同样的处理后, 从而实现归一化.

![Gemini_Generated_Image_q998lqq998lqq998](https://typora-mseei.oss-cn-chengdu.aliyuncs.com/Gemini_Generated_Image_q998lqq998lqq998.png)

利用标准差做特征标准化(z-score normalization)是更常用的方法: $$x_j^{(i)} \leftarrow \frac{x_j^{(i)} - \mu_j}{\sigma}$$

为什么通常对特征做标准化而非均值归一化处理 ?



我们做特征标准化/归一化, 直接地解决了$w_i$之间梯度下降的步伐大小差距过大的问题, 同时也间接地解决了 $w_i$ 和 $b$ 之间步伐大小差距过大的问题.

以线性回归为例说明：

$\mathbf{x}^{(i)}$ 是 $\mathbf{x}$ 的第 $i$ 个样本

$$J(w, b) = \frac{1}{2m} \sum_{i=1}^{m} (f_{w,b}(x^{(i)}) - y^{(i)})^2$$

$$\hat{y}^{(i)} =  \mathbf{x}^{(i)}\mathbf{w} + b,\quad e^{(i)}=\hat y^{(i)}-y^{(i)}$$

梯度：

$$\frac{\partial J}{\partial b}=\frac{1}{m}\sum_{i=1}^m e^{(i)}=\overline{e}=\overline{\hat y - y}=\overline{ \mathbf{x}\mathbf{w}^T + b - y}= \overline{\mathbf{x}}_{1\times n}\mathbf{w}^T + b - \overline{\mathbf{y}}$$

$$\frac{\partial J}{\partial \mathbf{w}}=\frac{1}{m}\mathbf{x}\cdot \mathbf{e}=\frac{1}{m}\mathbf{x}({\mathbf{x}\mathbf{w}+b\mathbf{1}}-\mathbf{y})$$

所以我们发现, 当我们不做标准化时, $\overline{\mathbf{x}}\neq \mathbf{0}$, 二者的偏导数表达式都含有彼此, 故 $\mathbf{w}$ 和 $b$ 的更新会相互耦合, 相互影响.也就是说 **你更新 $w$** 会改变$\frac{\partial J}{\partial \mathbf{w}}$，所以 $b$ 会被迫一直“补偿” $w$ 的变化；反过来 $b$ 的变化也会影响 $w$ 的梯度, 使得梯度下降步进困难.

**中心化后**( $\overline{x}=0$）：

$$\frac{\partial J}{\partial b}=\frac{1}{m}\sum_{i=1}^m e^{(i)}=\overline{e}=\overline{\hat y - y}=\overline{ \mathbf{x}\mathbf{w}^T + b - y}=  b - \overline{\mathbf{y}}$$

$$\frac{\partial J}{\partial \mathbf{w}}=\frac{1}{m}\mathbf{x}\cdot \mathbf{e}=\frac{1}{m}\mathbf{x}^T({\mathbf{x}\mathbf{w}+b\mathbf{1}}-\mathbf{y})=\frac{1}{m}\mathbf{x}^T\mathbf{x}\mathbf{w}-\frac{1}{m}\mathbf{x}^T\mathbf{y}$$   (因为 $x^{(i)}$ 已中心化, 故 $\mathbf{x}^T\mathbf{1}=\mathbf{0}$ )

  这时 $\frac{\partial J}{\partial b}$ **不再依赖 $w$**, $\frac{\partial J}{\partial \mathbf{w}}$ 也**不再依赖** $b$ , 二者解耦, 加快收敛.

进一步地, 如果我们对 $\mathbf{x}^{(i)}$ 标准化, 使得在同一个 $\alpha$ 作用下, $w_i,\ b$ 的步长差距均不大, 使得收敛速度更快.

所以对于这个问题, 中心化是比标准化更为关键的优化, 但是加入标准化也可以加快收敛速度.

一个例子帮助我们了解rescaling的重要性, 同时想一想, 为什么我们通常对target y也要做标准化:

```python
import numpy as np
import matplotlib.pyplot as plt


USE_SCALING = False  # True: 开启归一化 ; False: 关闭 


# 1. 模拟数据 (y = 1*x^2 + 1)
x = np.arange(0, 20, 1)
y = x**2 + 1
y = y.reshape(-1, 1)


X_raw = x**2 
X_raw = X_raw.reshape(-1, 1)

# 根据是否归一化，设置 学习率 和 数据
if USE_SCALING:
    alpha = 1.0  # 使用较大学习率可以快速收敛
else:
    alpha = 1e-7 # 只有极小才能运行，稍大就会 NaN

def zscore_normalize_features(X):
    mu    = np.mean(X, axis=0)
    sigma = np.std(X, axis=0)
    X_norm = (X - mu) / sigma
    return (X_norm, mu, sigma)

# 2. 数据处理逻辑
if USE_SCALING:
    # 做归一化
    X_train, mu, sigma = zscore_normalize_features(X_raw)
else:
    # 不做归一化，原样使用
    X_train = X_raw
    # 为了后面代码通用，这里伪造 mu=0, sigma=1 (即不做变换)
    mu    = np.zeros((X_raw.shape[1],))
    sigma = np.ones((X_raw.shape[1],))

# 3. 梯度计算函数
def compute_gradient(X, y, w, b):
    m = X.shape[0]
    f_wb = X @ w + b  
    err = f_wb - y
    dj_dw = (X.T @ err) / m
    dj_db = np.sum(err) / m
    return dj_dw, dj_db

# 4. 梯度下降
def run_gradient_descent(X, y, iterations, alpha):
    m, n = X.shape
    w = np.zeros((n, 1)) # 初始化为矩阵形式 (n, 1)
    b = 0
    
    print("-" * 85)
    print(f"{'Iter':<10} | {'Cost':<15} | {'dj_db (偏置梯度)':<20} | {'dj_dw (权重梯度)':<30}")
    print("-" * 85)
    
    for i in range(iterations):
        dj_dw, dj_db = compute_gradient(X, y, w, b)
        w = w - alpha * dj_dw
        b = b - alpha * dj_db
        
        # 打印日志
        if i % 1000 == 0 or i == iterations - 1:
            cost = np.sum((X @ w + b - y)**2) / (2 * m)
            print(f"{i:<10} | {cost:<15.4f} | {dj_db:<20.5f} | {np.array2string(dj_dw.flatten(), precision=4)}")
            
    return w, b

print("开始训练...")
model_w, model_b = run_gradient_descent(X_train, y, iterations=10000, alpha=alpha)

print("\n" + "="*50)

# 5. 还原真实的 w 和 b
# 公式: w_real = w_norm / sigma
# 公式: b_real = b_norm - (w_real * mu)
w_real = model_w / sigma.reshape(-1,1)
b_real = model_b - np.dot(w_real.T, mu) # 注意维度

# 提取标量值方便打印
w_final_scalar = w_real[0][0]
b_final_scalar = b_real[0] if isinstance(b_real, np.ndarray) else b_real

print(f"归一化层参数 w': {model_w.flatten()}, b': {model_b}")
print("-" * 30)
print(f"还原后的 w (真实值应为 1.0): {w_final_scalar:.5f}")
print(f"还原后的 b (真实值应为 1.0): {b_final_scalar:.5f}")
print("="*50)

# 6. 画图
plt.figure(figsize=(8, 6))
plt.scatter(x, y, marker='x', c='r', label="Actual Value (Ground Truth)")
plt.title(f"Fit Result (Scaling={USE_SCALING}, alpha={alpha})")

y_pred = np.dot(X_raw, w_real) + b_real

plt.plot(x, y_pred, label=f"Predicted (b={b_final_scalar:.2f})", linewidth=2)
plt.xlabel("x"); plt.ylabel("y"); plt.legend(); plt.grid(True)
plt.show()
```

如果我们不对 $\mathbf{y}$ 做标准化, 那么即使我们对 $x^{(i)}$ 做了标准化, 最终的 $\frac{\partial J}{\partial b}$, $\frac{\partial J}{\partial w}$ 仍然受到 $y$ 的取值范围的影响, 导致对每一个具体问题我们都要单独调整学习率 $\alpha$ 的值, 很麻烦, 不通用. 

**在用梯度法训练的回归问题里，标准化 y 往往能让优化更稳定、更通用**

**为什么要标准化 $y$？**

如果你只标准化了 $x$，虽然特征之间平衡了，但**梯度的大小（Magnitude）**依然取决于 $y$ 的单位。

如果预测房价（单位：元），误差可能是 1,000,000。梯度巨大。

如果预测身高（单位：米），误差可能是 0.1。梯度极小。

这意味着：你换个任务，就要重新辛苦调一次学习率 $\alpha$。

但如果你把 $y$ 也标准化了（让 $y$ 的均值为 0，方差为 1）：

① 学习率 $\alpha$ 变得通用

不管你是预测房价、预测身高，还是预测股票，只要 $x$ 和 $y$ 都标准化了，梯度的量级永远都在 1 附近。

结果： 经验值 $\alpha = 0.01$ 或 $0.1$ 几乎对所有问题都适用！不再需要为了不同的任务去试探 $1e-7$ 还是 $1e-2$ 了。

② 偏置 $b$ 的任务归零

如果 $y$ 没标准化，$b$ 需要收敛到 $y$ 的均值。

如果 $y$ 标准化了，$y$ 的均值就是 0。

结果： $b$ 初始化为 0 就已经是完美起点了！它几乎不需要更新，这让训练极度稳定。

③ 损失函数变成“正圆”且位于原点

此时，最优解 $(w, b)$ 就在 $(0, 0)$ 附近。你从原点出发，或者从随机点出发，都能以最快速度落入这个位于中心的“碗底”。

但注意, 此时模型输出的 $y$ , 是标准化后的数值, 做预测时, 需要用 $$\hat{y}_{real} = \hat{y}_{norm} \times \sigma_y + \mu_y$$ 反变换回去.



### 为什么我们可以对特征做标准化/均值归一化? {#why-feature-scaling}

**不会造成原数据的分布改变从而使得标准化后训练出的模型并不能拟合原数据的分布吗?**

并不会, 我们对每一个输入特征维度的**所有**数据做标准化$$x_j^{(i)} \leftarrow \frac{x_j^{(i)} - \mu_j}{\sigma}$$, 同一的变换法则使得数据内部的拓扑结构（Topology）和相对分布形状完全没有变。并且变换是可逆:

原来模型：

$$y = w x + b$$

标准化后用$x'$训练：

$$y = w' x' + b'$$

因为 $x = \sigma x' + \mu$，代回去：

$y = w' \frac{x-\mu}{\sigma} + b'= \left(\frac{w'}{\sigma}\right) x + \left(b' - \frac{w'\mu}{\sigma}\right)$

也就是说：**在标准化空间学到的$ (w',b')$**，可以严格换回原空间的 $(w,b)$，**预测的 $y$ 完全一致**（数值误差忽略）。



一个结论, 可用于检验标准化后函数是否收敛: 当成本函数 $J(w,b)$ 收敛到最低点($\mathbf{grad}\ J=0$)时: 

几何性质：回归直线必过样本中心点 $(\bar{x}, \bar{y})$

推导如下（针对 MSE 损失函数）：

目标是最小化 Loss：$J = \frac{1}{2m}\sum ((w x_i + b)-y_i)^2$

对 $b$ 求导并令其为 0：

$$\frac{\partial J}{\partial b} = \frac{1}{m}\sum ((w x_i + b)-y_i) = 0$$

$$\sum y_i - w \sum x_i - \sum b = 0$$

$$\sum y_i = w \sum x_i + n b$$

两边同时除以样本数 $n$：

$$\bar{y} = w \bar{x} + b$$

这就是著名的重心性质：回归直线一定经过数据的中心点 $(\bar{x}, \bar{y})$。



## 使用多项式回归方法(Polynomial Regression)在线性回归模型中解决非线性问题 {#polynomial-regression}

多项式回归假设

$\hat y = w_0 + w_1 x + w_2 x^2 + \cdots + w_d x^d.$

定义特征映射

$\phi(x)=\begin{bmatrix}1\\ x\\ x^2\\ \vdots\\ x^d\end{bmatrix},\quad\mathbf w=\begin{bmatrix}w_0\\ w_1\\ \vdots\\ w_d\end{bmatrix},$

则模型写成

$\hat y = \mathbf w^\top \phi(x).$

**注意：它对 $x$ 是非线性的（因为有$x^2,x^3,\dots$），但对参数 $\mathbf w$ 是线性的。**

本质就是换元, 直接将 $\phi(x)$ 作为整体输入模型, 让模型可以仍然以线性回归的方式来处理该问题.



## 梯度下降方法也可以便于我们选出合适的特征 {#feature-selection}

在特征均进行标准化的前提下(统一尺度), Gradient descent is picking the 'correct' features for us by emphasizing its associated parameter, 梯度下降方法通过调整各个 $w_i$ 的取值, 逼近cost function的最小值点, 收敛后, 观察各个 $w_i$ 的取值, 我们可以知道哪些特征对于模型的输出/预测是重要的, 哪些特征have slightly impact on the model prediction. 从而便于我们选出合适的输入特征.



## Question {#question}

正规方程

+ 关于$X^TX$不可逆的情况怎么处理 ?
+ 从计算复杂度的角度, 谈谈为什么大样本时我们使用梯度下降方法求解极小值点, 而不使用能直接求出极小值的正规方程方法

rescaling

+ 为什么通常对特征做标准化而非均值归一化处理 ? 他们对数据的原始分布会带来什么影响?

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
          <li><a href="#rescaling">rescaling 是一个很妙的优化方法</a></li>
          <li><a href="#why-feature-scaling">为什么我们可以对特征做标准化/均值归一化?</a></li>
          <li><a href="#polynomial-regression">使用多项式回归方法(Polynomial Regression)在线性回归模型中解决非线性问题</a></li>
          <li><a href="#feature-selection">梯度下降方法也可以便于我们选出合适的特征</a></li>
          <li><a href="#question">Question</a></li>
        </ul>
      </div>
    </details>
  </aside>
</div>



