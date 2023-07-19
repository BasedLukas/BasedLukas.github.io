---
title: Will Gzip Replace Neural Networks for Text Classification? 
date: 2023-07-19 
tags: ["python"]
cover: img/blackboard.jpg
share_cover: img/blackboard.jpg
author: Lukas
subtitle: Probably no.
---




## Introduction

Recently, an interesting paper came out on the topic of text classification. In it, the authors show how a relatively simple (non-parametric) method is able to outperform much larger neural network models under certain conditions. The paper, called [Less is More: Parameter-Free Text Classification with Gzip](https://aclanthology.org/2023.findings-acl.426/) has attracted a lot of discussion and some controversy. In it the authors use gzip, a compression algorithm that has been around for decades to classify text based on its compressed length. Surprisingly this appears to work rather well in quite a few cases, in addition to not requiring any form of training (unlike most classification models) and performs well out of distribution.

In the following article we are going to take a look at the method used in the paper and make sense of how it works.


## The method

Imagine we have two strings of text, which we'll call `GroupA` and `GroupB`. We are aiming to ascertain the category of an unknown string, referred to as `StringUnknown`.

The process begins with the compression of `GroupA` and `GroupB` strings, resulting in compressed files, whose sizes we'll denote as `CompA` and `CompB`.

Next, we append `StringUnknown` to both `GroupA` and `GroupB`, and compress these new combined strings. This gives us two new compressed file sizes: `CompA_Unknown` and `CompB_Unknown`.

To classify `StringUnknown`, we compare the size difference between the compressed original and combined files. In other words, we calculate the difference between `CompA_Unknown` and `CompA`, and also between `CompB_Unknown` and `CompB`.

The category of `StringUnknown` is then assigned based on which group, A or B, has the smaller size difference after concatenating `StringUnknown`. 

To better illustrate it, I wrote this small piece of code:

{% raw %}
<script src="https://gist.github.com/BasedLukas/42022b382660a27a7044770893572b18.js"></script>
{% endraw %}

```
CompA:  110
CompB:  102
CompA_Unknown:  153
CompB_Unknown:  163
A_Diff:  43
B_Diff:  61
StringUnknown is in GroupA
```

## Understanding the Mechanism

To understand why this works, we need to look at text compression. Consider a simple string like `AAABBCCCC`. It can be compressed to `3A2B4C` by substituting repeating characters with their count and the character itself. This is the basis of compression. In the real world, text compression utilizes a more complex version of this basic idea.

#### LZ77

Gzip, the algorithm in question, employs two main techniques: LZ77 and Huffman encoding. The former, LZ77, replaces repeated data with references to its prior occurrence. For instance, in the phrase "eat eat", the second "eat" can be replaced by a reference to the first instance. The algorithm examines a fixed number of characters (the window) retrospectively to find matches. These matches are then replaced by a reference to the first occurrence of the string in the text.

As a result, highly repetitive text can be significantly compressed, as recurring phrases and words are replaced by a single reference. This means text with more patterns can be compressed more effectively than random text. Higher compression ratios are achieved when there is an increase in recurring strings, such as in the passage below.

```
Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you
We've known each other for so long
Your heart's been aching, but you're too shy to say it (say it)

```
The LZ77 compressed version of the passage above looks like this:
```
Never gonna(6, 2)i(12, 2) you up(24, 13)let(23, 5)down(49, 13)run ar(49, 2)nd(7, 2)n(4, 2)des(27, 2)t(43, 4)
(38, 12)make(21, 4) cry(25, 13)say(35, 3)odbye(49, 13)tell (31, 2)lie(6, 2)nd hurt you
We'(37, 2) known each other fo(4, 2)so(47, 2)ong
Y(39, 2)r(49, 2)ea(50, 2)'s bee(41, 2)a(40, 2)i(25, 2),(13, 2)ut y(30, 2)'re to(46, 2)shy(8, 3) sa(7, 2)i(25, 2)((8, 6))
```

If you study the output of the compression above, you'll notice that as we move through the text, more and more words are replaced with backreferences, which are denoted as `(number of places to go backwards, number of characters to replace)`. Towards the end, it is composed almost exclusively by backreferences.

However, there's a problem here; distinguishing between literals (actual text) and back references. The current method surrounds each back reference with braces, which is a problem if the text also contains braces. This can be solved by escaping them, but this leads to a lot of redundancy. This issue is addressed, and the text is further compressed using Huffman encoding.

#### Huffman codes

Huffman encoding utilizes variable-length codes. Each character in our text is assigned a unique code, with the length of the code inversely proportional to the frequency of the character's occurrence. This enables us to save even more space by assigning shorter codes to more frequently occurring characters.

To illustrate, let's  create Huffman codes for the text: `AAABBCDDDDEEEEE`. The initial step is to count the frequency of each character (the order doesn't matter);

```
A:3
B:2
C:1
D:4
E:5
```

Next, we bundle together the two least frequent elements, (C and B), into a tree and store it for later use. 

```
  BC:3
  /  \
B:2  C:1
```

Adding the total frequency of B and C, we insert the newly created tree into our frequency table:
```
A:3
D:4
E:5
BC:3
```

This procedure is repeated, selecting the two lowest values (A and BC).

```
	ABC:6
 	/  \
 A:3  BC:3
      	/  \
      B:2  C:1
```
Our frequency table now looks like this:
```
D:4
E:5
ABC:6
```
We then select D and E to form:
```
   DE: 9
   /  \
 D:4  E:5
```
Our updated frequency table is:
```
ABC:6
DE:9
```
As we only have two elements left, we create our final tree using all the mini trees generated during the process:

{% raw %}
<center>
<img src="huffman.jpeg" alt="huffman tree">
<p><small>completed huffman tree</small></p>
</center>
{% endraw %}



Finally, we assign codes for each letter: left = 0 and right = 1. For example, the code for D is 10. Starting at the root, we first move to the right and then to the left to arrive at D. The beauty of this system is that we don't need to specify when one code ends and the next begins. You simply stop whenever you reach a leaf. Consequently, the most frequently occurring characters have the shortest codes.
```
A = 00
E = 11
D = 10
B = 010
C = 011
```
This process allows us to compress text effectively. Recall our original problem of separating the back references from the literals. Since the back references are so common in the text, they will get their own, short, unique codes. This makes the compression more efficient.
It’s worth noting that the full gzip algorithm is more complex than this. For our purposes though this is sufficient.

## Classification

Now that we understand how compression works, we can go back to text classification. The core intuition behind utilizing compressors for classification lies in two fundamental facts: (1) Compressors excel in capturing regularity, and (2) objects belonging to the same category exhibit more regularity than those from different categories. 

Let’s go through the method again. Consider three examples, `x1`, `x2`, and `x3`. Here, `x1` and `x2` belong to the same category, while `x3` is of a different category.

Using `C(·)` to represent the compressed length, we assume that `C(x1x2) - C(x1) < C(x1x3) - C(x1)`, where `C(x1x2)` denotes the compressed length of the concatenated `x1` and` x2`. Put simply, `C(x1x2) - C(x1)` can be seen as the number of additional bytes required to encode `x2` given the information of `x1`.
This concept can be formalized into a distance metric derived from the Kolmogorov complexity ( a theoretical metric, measured as the length of the shortest binary program that can generate a string `x`). Because the Kolmogorov complexity is inherently uncomputable, a normalized and computable version, the Normalized Compression Distance (NCD), has been proposed. It uses the compressed length `C(x)` to approximate Kolmogorov complexity `K(x)`. In its formal definition:

`NCD(x, y) = [C(xy) - min{C(x), C(y)}] / max{C(x), C(y)}`

The rationale for using compressed length is the assumption that the length of `x` which has been maximally compressed by a compressor is approximately equal to `K(x)` . 
In our case, we use gzip as the compressor. Hence, `C(x)` signifies the length of `x`after being compressed by gzip, and `C(xy)` is the compressed length of the concatenation of `x` and `y`. Armed with the distance matrix provided by NCD, we can then apply k-nearest-neighbors to perform classification.

## Downsides and drawbacks
With the knowledge of compression algorithms that we’ve formed, we can consider the drawbacks that this approach might have. One issue is the size of the lookback window. Recall that LZ77 looks at the prior text to find matches. If the text is very long, then compression works less well.


Furthermore, our approach doesn't understand the nuances of language, such as synonyms. The lack of linguistic sophistication means that the method probably won’t do very well for more nuanced tasks. It can quickly become computationally intensive when applied to large datasets. The computational complexity of KNN is O(n^2). This is probably something that can be solved, the paper is really just a proof of concept.


Finally there is some debate about the code and results in the paper. Some of the datasets used appear to be faulty, due to no fault of the authors. Additionally there is some debate about the way the results have been scored.
[This blog post](https://kenschutte.com/gzip-knn-paper/) takes a look at these issues, and you can also follow the discssion on [github](https://github.com/bazingagin/npc_gzip/issues/3).

## Conclusion

I have created [a repository](https://github.com/BasedLukas/zip_classification) with a simple implementation of LZ77 and Huffman encoding. You can use it to play around with the algorithms and see how they work.

[This blog post](https://www.infinitepartitions.com/art001.html) explains gzip much more thoroughly. Finally you should definitely read the original paper, available [here](https://aclanthology.org/2023.findings-acl.426/).







