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
        <li><a href="#uestc-2023">UESTC SCSE 2023复试笔试</a></li>
        <li><a href="#uestc-2023-short-answer">Short answer</a></li>
        <li><a href="#uestc-2023-problem-a">Problem A</a></li>
        <li><a href="#uestc-2023-problem-b">Problem B</a></li>
        <li><a href="#uestc-2023-problem-c">Problem C</a></li>
        <li><a href="#uestc-2023-problem-d">Problem D</a></li>
        <li><a href="#uestc-2019">UESTC SCSE 2019复试笔试</a></li>
        <li><a href="#uestc-2019-problem-d">Problem D</a></li>
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



## UESTC SCSE 2023复试笔试(成电 计算机学院) {#uestc-2023}

总的来讲, 这一年的题目都是大模拟, 涉及的算法知识较为简单, 注意细节即可.

### 一、 简答题 {#uestc-2023-short-answer}

1. 从 C 语言执行效率方面，简述下 C 语言采取了哪些措施提高执行效率。
    + C 语言把很多非核心功能交给库函数实现，使语言本身保持简洁，编译系统较轻量。
    + C语言是编译型语言, 将程序完整编译为机器语言后再进行执行, 而非解释型语言解释一句执行一句, 使得执行效率高于解释型语言.
    + C语言的指针可以直接对内存进行操作, 少了中介转换过程, 使得执行效率高



2. 根据下面的代码，填写表格。假设：整数占 2 字节，字符占 2 字节，指针占 4 字节。每个区域的起始地址都是 0，内存按 2 字节编址。

对于一个源程序**文本文件**, 编译程序首先对这个文件进行读取(预处理, 编译), 生成一个新的汇编文件, 即将源程序的高级语言翻译为汇编语言, 此时决定将该常量归入只读数据段(即汇编文本文件, 增加这样一段`.section .rodata. LC0:    .string "UESTC"`), 即这里只是在安排常量的归属区域, 而非已经将常量存到内存里了. 再由汇编程序将文本翻译为机器语言, 即目标文件, 再由链接器将不同的`.o`文件链接起来, 变为可执行目标代码文件, 注意到目前为止, 整个过程都是进程对**文件**的操作, 当装入程序将可执行目标代码文件装入内存时, 才会真正将常量映射到其进程被分配内存区域的常量区(只读区)

```c
int num=2;
void main()
{
    char str1[2018]={"UESTC"};
    char* str2="CHENGDU";
    char p;
}
void func (int m) //m 也是函数的一个参数, 不要忘了
{
    static int sta;
    int n=10;
}
```

| **内存区域**       | **常量或变量名** | **占用内存大小** |
| ------------------ | ---------------- | ---------------- |
| **常量区**         | `__________`     | `__________`     |
|                    | `__________`     | `__________`     |
|                    | `__________`     | `__________`     |
| **全局静态数据区** | `__________`     | `__________`     |
| **main 函数**      | `__________`     | `__________`     |
|                    | `__________`     | `__________`     |
| **func 函数**      | `__________`     | `__________`     |
|                    | `__________`     | `__________`     |
|                    | `__________`     | `__________`     |



3. `for(int i=0; nums[i]!=temp; i++){printf("%d", i);}` 是什么结构？使用显式结构语言该如何表示？并标出条件跳转和强制跳转。

显式结构语言就是把循环/分支结构拆开, 写成`goto`语句的形式, 更接近实际的执行过程.



4. (改错题) 在一个 $n$ 个元素的 `array` 数组里面找 `item` 变量：

```c
scanf("%d", &item);
for (int numb=0; array[numb]!=item; numb++);
(numb==n-1) ? printf("Item found at index: %d", numb) : printf("Item not found in the array.");
```

这里要注意的是`numb`变量的作用域, 很容易忽略



------

### Problem A {#uestc-2023-problem-a}

1. 给定两个字符串，第二个字符串仅包含两个字符。请编写 C 语言代码，计算第一个字符串中出现了多少次第二个字符串。

- **示例**：字符串 A 为 `ababaaabbb`，字符串 B 为 `ab`。

#### Solution

一般来讲, 处理可重叠的出现次数, 例如 主串`ababa`, 模式串`aba`, 则出现次数为2.



### Problem B {#uestc-2023-problem-b}

2. 读取一个英语文件，统计其中包含多少个不同的单词以及每个单词出现的频率。

- **要求**：使用结构体数组完成，可以使用 `strcmp` 函数判断单词是否已存在。

#### Solution

这里我没有考虑到`Hello`, `hello`, `hello,`应该被处理为同一个单词, 我做的方法是直接`fscanf(fp, "%s", str)`, 然后没有对`str`进行处理, 直接就`strcmp()`判断了, 这样就会将上述特殊情况处理为三个单词, 是错误的. 这里我们使用逐个读入, 对字符均转小写的方法来处理这种情况.

```c
```



### Problem C {#uestc-2023-problem-c}

3. 使用结构体存储学生姓名、学号、分数三个信息。

- **任务 A**：使用冒泡排序按成绩从低到高排序。
- **任务 B**：使用折半查找（二分查找）寻找分数为 $x$ 的学生信息。若有多个学生分数相同，需输出所有符合条件的信息。

#### Solution

这里需要注意的就是二分查找要找左边界, 再向右遍历输出分数相同的学生信息即可.

注意交换过程要写对. 不要在简单的地方出错.



### Problem D {#uestc-2023-problem-d}

4. 创建一个编号为 1 到 10 的单链表模拟小朋友玩玩具的过程：

- **初始状态**：10 个玩具编号依次为 1-10 顺序排列。
- **游戏规则**：共有 $m$ 次掷骰子机会（骰子为 10 面），每次掷出的数字 $x$ 代表将编号为 $x$ 的玩具移动到链表的最前端。
- **要求**：编写完整的程序，包含三个独立的功能函数：初始化玩具链表、进行游戏、输出当前玩具编号顺序。
- **示例**：$m=3$，掷出的骰子号依次为 `2, 3, 1`。
    - 初始：1-2-3-4-5-6-7-8-9-10
    - 第 1 轮（掷出 2）：2-1-3-4-5-6-7-8-9-10
    - 第 2 轮（掷出 3）：3-2-1-4-5-6-7-8-9-10
    - 第 3 轮（掷出 1）：1-3-2-4-5-6-7-8-9-10

#### Solution

我这里链表初始化的时候, 整成数组指针那种连续分配了, 搞错了. 同时结束时忘记释放内存了.



## UESTC SCSE 2019复试笔试(成电 计算机学院) {#uestc-2019}

### Problem D {#uestc-2019-problem-d}

一个循环数组，大小为 `n`，知道是有序的，但不知道哪个方向有序，也不知道起点在哪里。
请你设计一个算法，找出数组里的最小值，要求时间复杂度 `O(logn)`，没达到不得分，且要求描述算法思想并实现。

#### Solution

这一题很有意思, 这题可以抽象成一个有序环, 我们从任一点将环断开, 放到数组内, 形成此循环数组, 也就说最终数组会形成1个或2个有序段, 那么, 我们要找数组内的最小值, 其实就是找断点的位置, 要求时间复杂度是`O(logn)`, 于是想到二分, 也就是用二分的方法找断点位置, 我们发现两个分段有确定的大小关系, 即一个段所有数都比另一个段大, 利用这个关系, 来找断点. 即断点一定处于两个段的交界处, 那么`mid`会落在一个段内, `l`, `r`也会在某个段内, 我们将`a[mid]`与两个端点比大小, 即可判断其是否在一个段内, 从而确定断点与`mid`的位置关系.

 考虑两种情况

+ 环为升序, 则我们与右端点比, 如果和右端点在一个段内, 即`a[mid]<a[r]`, 那直接移动右端点, 因为要找最小值, 该值不可能为`a[r]`, 若不在一个段内, 那断点就位于`mid~r`之间, 于是移动左端点
+ 环为降序, 如果我们仍与右端点比, 若和右端点在一个段内, 即`a[mid]>a[r]`, 此时还能直接移动右端点吗, 不行了, 因为有`a[mid]>a[r]`, 我们不能保证最小值点不会出现在`r`处, 所以此时我们要和左端点比, 这样当`mid`和`r`在一个段内, 即`a[mid]<a[l]`, 我们可以保证`l`处不可能为最小值点, 从而移动左端点, 来找断点.

```c
int FindMinimum(int a[], int n)
{
    int tmp1 = 0x7fffffff; //假设为升序序列, 得到的最小值
    int tmp2 = 0x7fffffff; //假设为降序序列, 得到的最小值
    //假设为升序序列
    int l = 0, r = n - 1;
    while(l < r)
    {
        int mid = (l + r) / 2;
        if(a[mid] > a[r]) l = mid + 1;
        else r = mid;
    }
    tmp1 = a[l];
    //假设为降序序列
    l = 0, r = n - 1;
    while(l < r)
    {
        int mid = (l + r + 1) / 2; //防止l + 1 == r且有序时, 卡死 ex. 3, 4
        if(a[l] < a[mid]) r = mid - 1;
        else l = mid;
    }
    tmp2 = a[l];
    return tmp1 > tmp2 ? tmp2 : tmp1;
}
```

当然了, 也可以先对数组进行升序或降序判断, 确定后就选择一种方式进行二分即可.

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
          <li><a href="#uestc-2023">UESTC SCSE 2023复试笔试</a></li>
          <li><a href="#uestc-2023-short-answer">Short answer</a></li>
          <li><a href="#uestc-2023-problem-a">Problem A</a></li>
          <li><a href="#uestc-2023-problem-b">Problem B</a></li>
          <li><a href="#uestc-2023-problem-c">Problem C</a></li>
          <li><a href="#uestc-2023-problem-d">Problem D</a></li>
          <li><a href="#uestc-2019">UESTC SCSE 2019复试笔试</a></li>
          <li><a href="#uestc-2019-problem-d">Problem D</a></li>
        </ul>
      </div>
    </details>
  </aside>
</div>
