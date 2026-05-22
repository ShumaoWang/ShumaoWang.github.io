---
permalink: /deep-dive/self-supervised-learning/paper-reading-notes/
title: "Self-Supervised Learning Reading Notes"
excerpt: ""
author_profile: false
description: "Paper reading notes and reflections on self-supervised learning."
schema_type: "Article"
lang: "zh-CN"
---

# Self-Supervised Learning

[Back to Self-Supervised Learning]({{ '/deep-dive/self-supervised-learning/' | relative_url }})

<div class="toc-mobile">
  <input class="toc-toggle" type="checkbox" id="toc-toggle">
  <label class="toc-toggle__button" for="toc-toggle"><i class="fas fa-list" aria-hidden="true"></i><span class="sr-only">Contents</span></label>
  <label class="toc-backdrop" for="toc-toggle"></label>
  <div class="toc-drawer" role="dialog" aria-labelledby="toc-mobile-title">
    <div class="toc-drawer__inner">
      <p id="toc-mobile-title" class="toc-block__title">Table of Contents</p>
      <ul class="toc-block__list">
        <li><a href="#dino-series">DINO series</a></li>
        <li><a href="#dinov1">DINOv1</a></li>
        <li><a href="#evaluation-methods">三种评估预训练特征的方式</a></li>
        <li><a href="#some-thoughts-on-ssl">一些推论</a></li>
      </ul>
    </div>
  </div>
</div>

<div class="article-layout">
  <div class="article-main" markdown="1">

## DINO series {#dino-series}

### DINOv1 {#dinov1}

![DINO](https://raw.githubusercontent.com/facebookresearch/dino/main/.github/dino.gif)

+ 防止 collapse 的机制
    + momentum encoder + centering & sharpening，但 ablation 没有说清楚到底是哪个起主导作用还是只有联合有用

    + 为什么可以防止 collapse？

    + centering & sharpening 是怎么操作的？

        + centering & sharpening

            + centering 的作用就是防止某个通道 dominate 了输出，使得特征学习单一，并没有多样化。在 teacher 分支，我们将 encoder 输出的 $x$ 作 centering 操作，$softmax(x-c)$，再做 sharpening 操作 $p_t=softmax(\frac{x-c}{tp})$，得到了本次 forward 的预测分布。

                + 对 centering 的通道历史平均值参数 $c$ 进行更新：在 teacher encoder 输出的通道上（如 2048），在 batch 作平均，得到平均后作动量更新，$c=0.9 \times c_{old}+0.1 * c_{new}$，让历史累计的 $c_{old}$ 权重更大的目的是使得 c 的变化更平滑，不让单个 batch 计算得到的变化剧烈的 $c_{new}$ 作主导。这样才能得到历史长期累计的通道响应强度。由此我们完成了 c 的一次更新。

            + 但是 centering 导致的问题是可能向 unifrom distribution 坍缩。我们使用 sharpening 操作来解决 uniform distribution 的问题，即对输出 $x$ 除以一个小数 $\tau$，增大各通道之间的差异。显然 sharpening 操作可以同时应用于 student 分支和 teacher 分支。

            + 两个分支 $\tau$ 的搭配：“教师冷、学生热”

                DINO 明确地将**教师温度 ($\tau_t$) 设得比学生温度 ($\tau_s$) 更低**（例如 $\tau_t = 0.04 \to 0.07$，$\tau_s = 0.1$）。这一高一低形成了互补：

                - **教师冷**（锐化）：让教师目标尖锐，给学生指出“明确的答案”。
                - **学生热**（平滑）：防止学生直接复制教师的锐利分布，避免过早陷入过拟合，保持一定的探索能力。

                这其实借用了知识蒸馏中的经典技巧：教师使用低温产生高置信度软标签，学生使用较高温度来“软化”这些标签，从而学到更丰富的类间相似性。在自蒸馏无标签的场景下，这一机制额外起到了防止学生坍塌、提升特征质量的作用。

+ 贡献
    + 发现 pretrain 后的模型可以自发涌现分割特性
    + 完全使用预训练的特征进行评估的结果效果好，如 k-NN

+ Questions

    + 为什么 k-NN 的效果好？

    + 用类似分类的目标函数来训练 encoder，在分割等非分类任务上会优于其他训练方式吗？
        + 分割不是只需要“知道主体是什么”，还需要知道每个位置属于什么、边界在哪里、小结构在哪里。
    + teacher 分支优于 student 分支的本质原因是什么？

## 三种评估预训练特征的方式 {#evaluation-methods}

+ linear probe / linear segmentation probe（每个 patch 作二分类再上采样）
+ finetune
    + few-shot
+ k-NN
    + 保存训练集内所有图片经过 encoder 后的向量。对测试集内每张图片 $x$ 过 encoder 得到向量，计算与训练集每个向量的距离，找到其中最近的 $k$ 个 Neighbor，由于训练集每个图片类别已知，故可以用 $k$ 个 Nearest Neighbor（k-NN）加权打分，得到 $x$ 的预测类别。这个方法无需额外增加 learnable component，所以对预训练特征的评估非常具有说服力。
    + 但显然评估的任务类型受到限制。（classification）
    + 论文里可以观察到同样的方法下 ViT 作为 encoder 的 k-NN 性能优于 ResNet，一个猜想：CNN 先验降低学习难度，但也限制表示空间；ViT 先验更弱，早期更难训练，但上限可能更高。

## 一些推论 {#some-thoughts-on-ssl}

+ ![image-20260512204410642](https://typora-mseei.oss-cn-chengdu.aliyuncs.com/image-20260512204410642.png)
+ 也就是说目前 SSL，本质还是在设计约束，objective 本质就是一种约束，不过更底层，更偏向于推动模型学习数据本质的特征。而 supervised learning 其实就是直接用 label 作为约束，是直接面向任务的，信号比 SSL 更强更直接但 label 的信号本质上来说可能并不丰富，太单一，可能反而让模型学习不到足够丰富多样的表征，使得模型的泛化性能并不好。

    但是总的来说这两种 objective 都是人为设定的，在学习真正通用的表征上还是不够自然，不对味

+ supervised 信号更强更直接，在 CNN 强先验结构下效果较好，可以推动学习到更好的表征。然而这种信号并不能直接推动模型向着增加丰富度的角度去学习特征，使得在弱先验结构 ViT 下，效果不如信号更弱但可以推动模型学习更加丰富更加底层表征的 SSL 方法。这种信号不强但信号方向更正确的 SSL 方法在 big data or big domain data 的表现更好是理所当然的。（supervised label 是语义更强，强任务导向但低信息带宽的信号；SSL objective 是语义更弱，弱任务导向但约束更密、更底层、更面向表征几何的信号。）
+ Supervised label 的方向更面向当前任务；SSL objective 的方向更面向表征结构。对于弱先验的 ViT，后者反而可能更容易诱导出可迁移、可检索、可局部匹配的表征。
+ 那根据这个推论，在超大 data 下，甚至 SSL 方法应该比使用同样数据的 supervised 方法的泛化性能更好，更能用于不同的任务？
+ 从 Video instance segmentation 任务的角度看，我们最终想让每个 patch 向量携带什么信息？
    + 空间语义信息。知道自己位于图像中的哪一区域（物理上的空间信息），是语义对象的哪一部分（语义上的空间信息），当前局部位置具有什么样的特点（纹理等信息），和周围 patch 的空间关系。有了空间语义信息，自然也就具备了跨帧一致性，使得具有较好的 Video instance segmentation 性能。
+ avoid collapse，从经验上看，需要结构非对称性 + 优化非对称性

</div>

  <aside class="article-toc">
    <details class="toc-panel" open>
      <summary class="toc-panel__toggle">Contents</summary>
      <div class="toc-block">
        <p class="toc-block__title">Table of Contents</p>
        <ul class="toc-block__list">
          <li><a href="#dino-series">DINO series</a></li>
          <li><a href="#dinov1">DINOv1</a></li>
          <li><a href="#evaluation-methods">三种评估预训练特征的方式</a></li>
          <li><a href="#some-thoughts-on-ssl">一些推论</a></li>
        </ul>
      </div>
    </details>
  </aside>
</div>
