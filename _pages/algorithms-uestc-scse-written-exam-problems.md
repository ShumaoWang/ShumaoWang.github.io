---
permalink: /algorithms/uestc-scse-written-exam-problems/
title: "Some Interesting Problems from the Written Exam for UESTC SCSE's Postgraduate Re-examination"
excerpt: ""
author_profile: false
---

# Some Interesting Problems from the Written Exam for UESTC SCSE's Postgraduate Re-examination

<div style="margin: 0 0 1.5rem 0;">
  <img src="{{ '/images/uestc-scse-written-exam-cover.jpg' | relative_url }}" alt="UESTC campus view" style="width: 100%; max-width: 960px; height: auto; border-radius: 10px; display: block;">
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
        <li><a href="#uestc-2025">UESTC SCSE 2025复试笔试</a></li>
        <li><a href="#problem-a">Problem A</a></li>
        <li><a href="#problem-b">Problem B</a></li>
        <li><a href="#problem-c">Problem C</a></li>
        <li><a href="#problem-d">Problem D</a></li>
        <li><a href="#uestc-2024">UESTC SCSE 2024复试笔试</a></li>
      </ul>
    </div>
  </div>
</div>
<div class="article-layout">
  <div class="article-main" markdown="1">

This page will collect several interesting problems and solution notes from the written exam for UESTC SCSE's postgraduate re-examination.

## UESTC SCSE 2025复试笔试(成电 计算机学院) {#uestc-2025}

### Problem A {#problem-a}

给定一个整型数组，请将该数组的所有**连续子数组**的算术平均值计算出来并以浮点数形式存储到新数组。例如：数组 $[2, 4, 6]$，它的连续子数组有 $[2], [4], [6], [2, 4], [4, 6], [2, 4, 6]$，输出的结果数组是 $[2, 4, 6, 3, 5, 4]$。

#### Solution

先预处理出数组前缀和, 利于后面求解连续子数组的算术平均值.

利用滑动窗口的思想, 外层遍历窗口的大小, 窗口大小为`i`, 内层遍历数组, 将每个元素作为窗口起点, 窗口内即为大小为`i`的连续子数组, 计算算术平均值并输出.循环完成后即得到结果数组.

```c
#include<stdio.h>

#define MAXN 10000

int sum[MAXN];
int a[MAXN];
int n;

int main()
{
	scanf("%d", &n);
	for (int i = 0; i < n; i ++ ) scanf("%d", &a[i]);
	for (int i = 0; i < n; i ++ ) sum[i] = sum[i - 1] + a[i];
	int cnt = 0;
	for (int i = 0; i < n; i ++ )
	{
		for (int j = 0; j < n; j ++ )
		{
			if (j + i >= n) continue;
			printf("%.6f ", (float)(sum[j + i] - sum[j - 1]) / (i + 1));
		}
	}
	return 0;	
}
```

### Problem B {#problem-b}

给定一个字符串 `str`，里面只由字母组成的单词和空格，每个单词以空格相隔，请返回将字符串里所有单词转置后的字符串；函数原型为 `void reverseWords(char *str)`；例如 `str` 为 "hello world"，返回为 "olleh dlrow"。

#### Solution

textbook(黄迪明版) 4.5 的改编题, 加入了双指针的思想, 提高了本题的难度.

难点在于从给定字符串`str`中定位每个单词, 我们观察到要拆开每个单词, 就要利用单词之间的空格`   `, 所以引入双指针, 通过空格来定位每个单词的边界, 定位好以后再进行翻转. 通过将每个功能都作为函数封装的方法, 简化代码的复杂性. 

```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#define MAXN 1000

char str[MAXN];

void Reverse(int i, int j , char *str)
{
	int mid = (i + j + 1) / 2;
	while (i < mid)
	{
		char tmp = str[i];
		str[i] = str[j];
		str[j] = tmp;
		i ++ ;
		j -- ;
	}
}

void reverseWords(char* str)
{
	int i = 0, j = 0;
	while(j < strlen(str))
	{
		while (str[j] != ' ' && j < strlen(str)) j ++ ;
		Reverse(i, j - 1, str);
		i = j + 1;
		j = j + 1;
	}
}
 int main()
 {
 	strcpy(str, "");
 	// printf("%s", str);
 	reverseWords(str);
 	printf("%s", str);
 	return 0;
 }

```



### Problem C {#problem-c}

请设计实现 **LRU 算法**，在缓冲区中存储着关键字和数据值，需要设计的函数为 `get(key)` 和 `put(key, value)`。

- `get(key)` 用来访问当前在缓冲区当中关键字为 `key` 的 `value` 数据值，如果没找到，请返回 -1。
- `put(key, value)` 用来更新关键字为 `key` 的数据值为 `value`，当缓冲区达到上限时，请按照 LRU 算法淘汰最近最久未使用的关键字，并将新的关键字 `key` 以及其值 `value` 存储其中。

请根据 LRU 算法和两个函数的实现方式判断**用什么数据结构**，并给出解释。

#### Solution

大模拟, 非常复杂的一道题, 再加上要使用C语言来实现, 更是难上加难. 不过手搓哈希表也能提升我们对哈希算法的深刻理解.

我最初想的是用堆来实现LRU, 通过对键值`time`作为堆排序的依据, 堆满就替换堆顶再重新调整堆(`AdjustHeap()`), 但这个算法实现起来很复杂, `get(key)`只能遍历(因为堆不是用`key`进行排序的), 而且每次`get()`后还要调整堆, 所以时间复杂度是 $O(n)$ 级的

那怎么实现 $O(1)$ 级的LRU算法呢, 也就是`get(key),put(key, value)`在 $O(1)$ 时间内完成, 同时更新/替换缓冲区也要在 $O(1)$ 时间内完成,  我们想到数组的随机存取, 但是没有办法实现缓冲区位置更新/替换在 $O(1)$ 内完成, 于是数组不能直接存`key->value`的映射, 而应该与其他数据结构结合, 从而实现位置替换和更新在 $O(1)$ 内完成, 我们想到链表, 而缓冲区的更新是将当前元素移动到队头, 替换最久的元素操作则是在队尾, 于是想到要使用双向链表. 进一步地, 由于缓冲区中不同数据的关键字`key`可能重复, 所以我们优化为用哈希表来实现 $O(1)$ 存取. 故数据结构采用 哈希表+双向链表. 哈希表中每个位置存对应缓冲区结点的指针, 指向位于双链表中的结点. 由此, 既完成了 $O(1)$ 的读写, 又实现了 $O(1)$ 的结点位置更新. **通过指针的引入**, 我们顺利地将顺序存储结构和链式存储结构的优势结合了起来!!!

接下来就是代码实现了. 缓冲区我采用懒更新策略, 并不预先分配`capacity`个区域, 而是装入结点时才进行分配, 当缓冲区满之后, 则利用现有缓冲区进行结点更新.

每一次操作都要进行`CacheUpdate()`操作, 以此符合LRU算法的策略

关键就在于当缓冲区满且要插入的新节点的关键字在哈希表中没有时, 要对队尾节点操作, 同时更新哈希表与缓冲区, 在哈希表中更新该节点指针的哈希拉链位置(放在新`key`的拉链下), 再对缓冲区数据和缓冲区位置进行更新.

```c
#include<stdio.h>
#include<string.h>
#include<stdlib.h>

//缓冲区数据结点
typedef struct LRUCacheNode{
	int key;
	int value;
	struct LRUCacheNode *pre, *next;
	struct LRUCacheNode *hnext; //哈希表采用拉链法解决冲突
}LRUCacheNode;

//缓冲区结构体
typedef struct LRUCache
{
	int capacity; //容量
	int size; //当前缓冲区大小
	int hashSize; //哈希表大小
	struct LRUCacheNode *head, *tail;
	struct LRUCacheNode **hashTable; //哈希表内存的是指向结点的指针, 故采用二级指针声明
}LRUCache;


//实现双向链表操作 头进尾出 将头尾结点作为哨兵, 简化边界条件(否则边界条件很复杂)
void CacheIn(LRUCache *obj, LRUCacheNode *p)
{
	p -> pre = obj -> head;
	p -> next = obj -> head -> next;
	obj -> head -> next -> pre = p;
	obj -> head -> next = p;
	obj -> size ++ ;
}

void CacheUpdate(LRUCache *obj, LRUCacheNode *p)
{
	p -> next -> pre = p -> pre;
	p -> pre -> next = p -> next;
	p -> pre = obj -> head;
	p -> next = obj -> head -> next;
	obj -> head -> next -> pre = p;
	obj -> head -> next = p;
}


//哈希表操作
LRUCacheNode *hashSearch(int key, LRUCache *obj)
{
	LRUCacheNode *p = obj -> hashTable[(key + obj -> hashSize) % obj -> hashSize]; //定位key对应在哈希表中的位置
	while (p != NULL && p -> key != key) p = p -> hnext;
	return p;
}


void hashInsert(LRUCache *obj, LRUCacheNode *p) 
{
	if (obj -> hashTable[(p -> key + obj -> hashSize) % obj -> hashSize] == NULL) 
	{
		obj -> hashTable[(p -> key + obj -> hashSize) % obj -> hashSize] = p;
		p -> hnext = NULL;
	}
	else //哈希冲突时, 头插法插入结点指针
	{
		LRUCacheNode *hashHead = obj -> hashTable[(p -> key + obj -> hashSize) % obj -> hashSize];
		p -> hnext = hashHead;
		obj -> hashTable[(p -> key + obj -> hashSize) % obj -> hashSize] = p;
	}
}

void hashUpdate(LRUCache *obj, LRUCacheNode *p, int key) 
{
    //当新插入的结点要替换队尾结点时, 在哈希表中更新该结点所处位置(原结点和新结点key不同, 则位置不同) 挪动结点p的位置
    //更新p的前驱结点, 从原拉链中删除
	LRUCacheNode *preHash = obj -> hashTable[(p -> key + obj -> hashSize) % obj -> hashSize]; 
	if (preHash == p) obj -> hashTable[(p -> key + obj -> hashSize) % obj -> hashSize] = p -> hnext;;
	else
	{
		while (preHash -> hnext != p) preHash = preHash -> hnext;
		preHash -> hnext = p -> hnext;
	}
    //头插法p入新位置
	LRUCacheNode *hashHead = obj -> hashTable[(key + obj -> hashSize) % obj -> hashSize];
	p -> hnext = hashHead;
	obj -> hashTable[(key + obj -> hashSize) % obj -> hashSize] = p;
}

int get(int key, LRUCache *obj)
{
	LRUCacheNode *p = hashSearch(key, obj);
	if (p == NULL) return -1;
	else 
	{
		CacheUpdate(obj, p);
		return p -> value;
	}
}

void put(int key, int value, LRUCache *obj)
{
	LRUCacheNode *p = hashSearch(key, obj);
	if (p == NULL) //哈希表中没有当前要插入的结点关键字时, 必须替换节点或插入新节点
	{
		if (obj -> size < obj -> capacity) //直接插入
		{
			p = (LRUCacheNode*)malloc(sizeof(LRUCacheNode));
			p -> key = key;
			p -> value = value;
			hashInsert(obj, p);
			CacheIn(obj, p);
		}
		else //替换队尾结点, 最复杂的情况
		{
			p = obj -> tail -> pre;
			hashUpdate(obj, p, key);
			p -> key = key;
			p -> value = value;
			CacheUpdate(obj, p);
		}
	}
	else //更新结点信息
	{
		p -> value = value; 
		CacheUpdate(obj, p);
	}
}

LRUCache *LRUCacheInit(int capacity, int hashSize) //哈希表的初始化
{
	LRUCache *obj = (LRUCache*)malloc(sizeof(LRUCache));
	obj -> head = (LRUCacheNode*)malloc(sizeof(LRUCacheNode));
	obj -> tail = (LRUCacheNode*)malloc(sizeof(LRUCacheNode));
	obj -> head -> next = obj -> tail;
	obj -> head -> pre = NULL;
	obj -> tail -> pre = obj -> head;
	obj -> tail -> next = NULL;
	obj->hashTable = (LRUCacheNode**)calloc(hashSize, sizeof(LRUCacheNode*)); //分配的单个区域的大小为缓冲区结点的指针大小
	obj -> hashSize = hashSize;
	obj -> capacity = capacity;
	obj -> size = 0;
	return obj;
}
```



### Problem D {#problem-d}

现在你手中 $d$ 元钱 $n$ 种优惠券，柜台中也有 $n$ 种商品，每种优惠券可以使用无数次，每种商品也可以买无数次，但是**一种优惠券只能购买一种商品**。

例如，你可以用 1 号优惠券买 1 号商品，2 号优惠券买 2 号商品，也可以用 1 号优惠券买 2 号商品，但是这时候 1 号优惠券就不可以买 1 号商品了。

现在你要用 $d$ 元钱和 $n$ 种优惠券买尽可能多的商品，保证所给优惠券的最大面额一定比商品最小价格还要小。

#### **输入格式：**

- **第一行：** 给出 $n$ 和 $d$，中间以空格分割。
- **第二行：** 给出 $n$ 种商品的价格，中间以空格分割。
- **第三行：** 给出 $n$ 种优惠券的面额，中间以空格分割。

#### **输出：**

能购买的**最大商品数量**和**手中所剩的钱**，中间以空格分割。

#### Solution

每种优惠券只能购买一种商品, 并且一个优惠券只能折扣一件商品, 但商品不限量, 优惠券不限量. 故商品实际价格为`price - cut`, 要用现有的钱买到最多的商品, 就是要用折扣最大的优惠券重复买最便宜的商品, 直到用完所有钱. 那我们找到面额最大的优惠券和价格最便宜的商品即可. 贪心的思想.

```c
#include<stdio.h>
#include<stdlib.h>

#define MAXN 100000
#define INF 0x7fffffff

int price[MAXN], cut[MAXN];
int n, d;
int main()
{
	scanf("%d%d", &n, &d);
	for (int i = 0; i < n; i ++ ) scanf("%d", &price[i]);
	for (int i = 0; i < n; i ++ ) scanf("%d", &cut[i]);
	int min = INF, max = 0;
	for (int i = 0; i < n; i ++ )
	{
		if (min > price[i]) min = price[i];
		if (max < cut[i]) max = cut[i];
	}
	printf("%d %d", d / (min - max), d % (min - max));
	return 0;
}
```



## UESTC SCSE 2024复试笔试(成电 计算机学院) {#uestc-2024}

Coming soon.

</div>
  <aside class="article-toc">
    <details class="toc-panel" open>
      <summary class="toc-panel__toggle">Contents</summary>
      <div class="toc-block">
        <p class="toc-block__title">Table of Contents</p>
        <ul class="toc-block__list">
          <li><a href="#uestc-2025">UESTC SCSE 2025复试笔试</a></li>
          <li><a href="#problem-a">Problem A</a></li>
          <li><a href="#problem-b">Problem B</a></li>
          <li><a href="#problem-c">Problem C</a></li>
          <li><a href="#problem-d">Problem D</a></li>
          <li><a href="#uestc-2024">UESTC SCSE 2024复试笔试</a></li>
        </ul>
      </div>
    </details>
  </aside>
</div>
