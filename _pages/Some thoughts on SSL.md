---
permalink: /deep-dive/self-supervised-learning/some-thoughts-on-ssl/
title: "Some thoughts on SSL"
excerpt: ""
author_profile: false
description: "Personal reflections on SSL, RGB observations, ViT, and attention."
schema_type: "Article"
lang: "zh-CN"
---

# Some thoughts on SSL

[Back to Self-Supervised Learning]({{ '/deep-dive/self-supervised-learning/' | relative_url }})

<div class="toc-mobile">
  <input class="toc-toggle" type="checkbox" id="toc-toggle">
  <label class="toc-toggle__button" for="toc-toggle"><i class="fas fa-list" aria-hidden="true"></i><span class="sr-only">Contents</span></label>
  <label class="toc-backdrop" for="toc-toggle"></label>
  <div class="toc-drawer" role="dialog" aria-labelledby="toc-mobile-title">
    <div class="toc-drawer__inner">
      <p id="toc-mobile-title" class="toc-block__title">Table of Contents</p>
      <ul class="toc-block__list">
        <li><a href="#rgb-observation">RGB 观测世界</a></li>
        <li><a href="#from-cnn-to-vit">为什么我们要从 CNN 走向 ViT?</a></li>
        <li><a href="#vit-questions">关于 ViT 的两个问题</a></li>
        <li><a href="#attention-projection">Attention 中线性映射层的作用</a></li>
      </ul>
    </div>
  </div>
</div>

<div class="article-layout">
  <div class="article-main" markdown="1">

## RGB 观测世界 {#rgb-observation}

+ 每个像素都由（R, G, B）三通道叠加而成，这与我们人类处理物理世界的复杂光谱的方式类似，都是降维压缩。我们给模型的视觉信号是（R, G, B），这先天就是有缺陷的，并不是物理世界的真实表示。
    + 那人眼本质是对真实世界作了一个降维处理。那计算机视觉所做的关于视觉的研究本质上都是基于人的，而不是基于物理世界的，这从起点上，可能决定了他没法拟合真实的物理世界，上限就是拟合某种“传感器”观测下的世界。
    + 人眼和普通 RGB 相机都把连续、复杂的物理世界压缩成低维视觉观测。因此，基于 RGB 图像的计算机视觉模型本质上拟合的是人类/相机可见的观测分布，而不是完整的物理世界本身。
    + 监督标签只告诉模型“人定义的任务答案”，而自监督可能让模型从观测数据中学习更丰富的结构；但只要输入仍然是 RGB，它学到的仍然是 RGB 观测世界中的结构，而不是完整物理世界。

## 为什么我们要从 CNN 走向 ViT? {#from-cnn-to-vit}

+ 为什么我们要从 CNN 走向 ViT?
    + 我们不需要预先地强制地给模型加那么多限制（infective bias），即你必须要去学习层次化的特征。而应该是让模型自己去判断他需要学习哪些特征，这些特征应该具有什么样的结构，这样才能使得模型真正具有 generalizability。弱先验才能走得更远。

## 关于 ViT 的两个问题 {#vit-questions}

+ 关于 ViT 的两个问题
    + 更改 patch_size 后，patch 数量，也就是 sequence length 改变了，Transformer Encoder 怎么处理变长 sequence？sequence 长度改变了，对应的 position 个数也改变了（与 sequence 长度相同），那 position embedding 就不能用原来学习好的 position embedding 了，怎么处理？（这里特指 learnable position embedding，若为常数位置编码，那就无需考虑这个问题）
        + 1 sequence length 变长其实就是 N 改变了，而 Encoder 里与 N 有关的只有 Q，K，V，矩阵大小为 $N\times N$，但这里并不涉及可学习的参数。所以 Transformer 可以处理任意长度的 sequence length N（ViT 中即可以处理任意 resolution）。只是由于 Attention 中矩阵计算为 $O(N^2)$ 级，N 变长则计算量暴涨。
        + 2 当采用 learnable position embedding，当 N 改变时，已经学好的 position embedding 就不再适配了，此时可以采用插值的方法。但也显然会带来 out of distribution 的问题。

## Attention 中线性映射层的作用 {#attention-projection}

+ 视频里说线性映射层 W 的作用主要是降维，但其实我觉得当我们讨论三个线性映射层 $W_Q$、$W_K$、$W_V$ 的作用应该不只是降维，而应该更多的是要去学习如何构造自己的 query、key 和 value，因为 single head attention 时并不做降维，而做一个等维 projection 也是有效的。那此时有一个问题，有 $QK^T = XW_QW_K^TX^T$，令 $M = W_QW_K^T$，则 $QK^T = XMX^T$。所以从函数表达能力上看，等价于只用学习一个矩阵，而不需要分开学 $W_Q$，$W_K$ 两个矩阵，所以 Q 和 K 是等价的，并没有解耦开来。那此时的 M 提供的是什么作用呢，只是作一个线性变换？

    感觉在 multi-head attention 里这三个 linear projection 的作用反而才重要得多。

</div>

  <aside class="article-toc">
    <details class="toc-panel" open>
      <summary class="toc-panel__toggle">Contents</summary>
      <div class="toc-block">
        <p class="toc-block__title">Table of Contents</p>
        <ul class="toc-block__list">
          <li><a href="#rgb-observation">RGB 观测世界</a></li>
          <li><a href="#from-cnn-to-vit">为什么我们要从 CNN 走向 ViT?</a></li>
          <li><a href="#vit-questions">关于 ViT 的两个问题</a></li>
          <li><a href="#attention-projection">Attention 中线性映射层的作用</a></li>
        </ul>
      </div>
    </details>
  </aside>
</div>
