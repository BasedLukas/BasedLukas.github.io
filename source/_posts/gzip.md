---
title: gzip
tags:
  - python
cover: img/cover_image.jpg
share_cover: img/share_image.jpg
author: Lukas
subtitle: Subtitle
date: 2023-07-18 14:00:33
---
## Introduction

Recently, an interesting paper came out on the topic of text classification. In it, the authors show how a relatively simple (non-parametric) method is able to outperform much larger neural network models under certain conditions. The paper, called “Less is More: Parameter-Free Text Classification with Gzip” has attracted a lot of discussion. The authors use gzip, a compression algorithm that has been around for decades to classify text based on its compressed length. Surprisingly this appears to work rather well in quite a few cases, in addition to not requiring any form of training (unlike most classification models) and performs well out of distribution.

## The method

Imagine we have two groups of categorized strings, which we'll call GroupA and GroupB. We are aiming to ascertain the category of an unknown string, referred to as StringUnknown.

The process begins with the compression of GroupA and GroupB strings, resulting in compressed file sizes we'll denote as CompA and CompB. 

Next, we append StringUnknown to both GroupA and GroupB, and compress these new combined strings. This gives us two new compressed file sizes: CompA_Unknown and CompB_Unknown.

To classify StringUnknown, we compare the size difference between the compressed original and combined files. More specifically, we calculate the difference between CompA_Unknown and CompA, and also between CompB_Unknown and CompB.

The category of StringUnknown is then assigned based on which group - A or B - has the smaller size difference after incorporating StringUnknown.


{% raw %}
<script src="https://gist.github.com/BasedLukas/42022b382660a27a7044770893572b18.js"></script>
{% endraw %}

## How it Works

To develop intuition about why text compression works, we need to understand the basic principles.
Let's look at a simple example: the string "AAABBCCCC" can be compressed to "3A2B4C" by replacing recurring characters with the character and number of recurrences. Real-world text compression builds on this idea.
The gzip algorithm uses two main methods: LZ77 and Huffman encoding.
LZ77 replaces repeated data with references to an earlier copy. For example, the second "eat" in the sentence "I forgot to eat earlier so I am going to eat now" can reference the first instance. LZ77 looks back a fixed number of characters (the window) to find matches.
More repetitive text can be compressed more, since recurring words and phrases are replaced by a single reference. Text with more patterns compress better than random text. The more recurring strings in a passage, the higher the compression ratio.
Here is a simple implementation of the algorithm. If we examine the output we can see how as we proceed through the text more and more words are replaced with backreferences. The backreferences are in the form of:
[number of places to go backwards, number of characters to replace]

{% raw %}
<script src="https://gist.github.com/BasedLukas/49cb3be513c51e9c0937359a10464658.js"></script>
{% endraw %}


