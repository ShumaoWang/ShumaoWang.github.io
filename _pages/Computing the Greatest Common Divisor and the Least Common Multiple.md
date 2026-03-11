---
permalink: /algorithms/gcd-and-lcm/
title: "Computing the Greatest Common Divisor and the Least Common Multiple"
excerpt: ""
author_profile: false
---

# 求解最大公约数 GCD 与最小公倍数 LCM 的两个方法

<div style="margin: 0 0 1.5rem 0;">
  <img src="{{ '/images/image-20260311161447314.png' | relative_url }}" alt="Venn diagram for GCD and LCM" style="width: 100%; max-width: 960px; height: auto; border-radius: 10px; display: block;">
</div>

[Back to Algorithms]({{ '/algorithms/' | relative_url }})

<div class="toc-mobile">
  <input class="toc-toggle" type="checkbox" id="toc-toggle">
  <label class="toc-toggle__button" for="toc-toggle"><i class="fas fa-list" aria-hidden="true"></i><span class="sr-only">Contents</span></label>
  <label class="toc-backdrop" for="toc-toggle"></label>
  <div class="toc-drawer" role="dialog" aria-labelledby="toc-mobile-title">
    <div class="toc-drawer__inner">
      <p id="toc-mobile-title" class="toc-block__title">Table of Contents</p>
      <ul class="toc-block__list">
        <li><a href="#prime-factorization">方法一：分解质因子</a></li>
        <li><a href="#euclidean-algorithm">方法二：辗转相除法</a></li>
      </ul>
    </div>
  </div>
</div>

<div class="article-layout">
  <div class="article-main" markdown="1">

这篇笔记整理了求解最大公约数（GCD）与最小公倍数（LCM）的两种常见方法，并解释为什么在实际计算中通常优先使用辗转相除法。

## 方法一：分解质因子 {#prime-factorization}

我们知道，任何正整数都可以分解为质数的乘积。

将给定的正整数 $x$ 分解为

$$
x = p_1^{m_1}\cdot p_2^{m_2}\cdots p_n^{m_n}
$$

其中 $p_i$ 为 $x$ 的一个质因子。完成分解后，我们可以把一个数的质因子表示成集合

$$
\{p_1^{m_1}, p_2^{m_2}, \cdots, p_n^{m_n}\}.
$$

从这个角度看：

- 最大公约数，本质上对应这些质因子集合的交集。
- 最小公倍数，本质上对应这些质因子集合的并集。

对于两个正整数的 GCD 与 LCM 而言，只有同时出现在两个集合中的质因子，才能构成公约数；而每一个公共质因子的指数，需要取两个数中较小的那个。相反，若要求最小公倍数，就要把两边出现过的所有质因子都保留下来，每个质因子的指数取较大的那个。

以 6 和 8 为例：

$$
6 = 2^1 \cdot 3^1
$$

$$
8 = 2^3
$$

所以：

$$
GCD(6, 8) = 2^1 = 2
$$

$$
LCM(6, 8) = 2^3 \cdot 3^1 = 24
$$

这个方法非常直观，但它依赖于先完成质因数分解。当数字变大时，分解过程本身就不够高效，所以实际计算里通常会使用更直接的方法。

## 方法二：辗转相除法 {#euclidean-algorithm}

由于

$$
LCM(x, y) = \frac{x \cdot y}{GCD(x, y)}
$$

所以只要求出最大公约数，就可以进一步得到最小公倍数。上方的韦恩图也可以帮助理解两者之间的关系。

现在问题就转化为：如何高效地求解 $GCD$。

设两个正整数为 $x, y$，且 $x > y$。若

$$
x \div y = q \cdots r
$$

也就是

$$
x = qy + r
$$

我们发现, $x, y$ 的公约数也一定是余数 $r$ 的约数, 反过来 $y, r$ 的公约数也一定是 $x$ 的约数. 那么有：

$$
gcd(x, y) = gcd(y, r)
$$

这意味着：$x$ 与 $y$ 的公约数集合，和 $y$ 与余数 $r$ 的公约数集合是相同的。于是我们可以不断用“较小的数”和“余数”替换原问题，持续缩小求解范围。

当余数最终变成 0 时，就会出现

$$
gcd(m, 0)
$$

这时最后一个非零余数 $m$，就是最大公约数。

因此，求解流程可以整理为两步：

1. 先通过辗转相除法求出 $GCD(x, y)$。
2. 再通过 $LCM(x, y) = \frac{x \cdot y}{GCD(x, y)}$ 求出最小公倍数。

这也是编程实现中最常用、最稳定的一种思路。

```c
#include<stdio.h>

//求x, y的最大公约数
int gcd(int x, int y)
{
    if(x > y)
    {
        int r = x % y;
        while(r)
        {
            int tmp = r;
            r = y % r;
            y = tmp;
        }
        return y;
    }
    else
    {
        int r = y % x;
        while(r)
        {
            int tmp = r;
            r = x % r;
            x = tmp;
        }
        return x;
    }
}
int main()
{
	int x, y;
	scanf("%d%d", &x, &y);
	printf("%d", gcd(x, y));
	return 0;
}
```



</div>

  <aside class="article-toc">
    <details class="toc-panel" open>
      <summary class="toc-panel__toggle">Contents</summary>
      <div class="toc-block">
        <p class="toc-block__title">Table of Contents</p>
        <ul class="toc-block__list">
          <li><a href="#prime-factorization">方法一：分解质因子</a></li>
          <li><a href="#euclidean-algorithm">方法二：辗转相除法</a></li>
        </ul>
      </div>
    </details>
  </aside>
</div>
