---
title: Investor Pitch
date: 2025-01-28 
author: Lukas
---

## [getDelv.com](https://getdelv.com) 

[Website](https://getdelv.com)
[email](mailto:lukas@getdelv.com)

## Executive Summary
We are building a search engine designed for use by language models, not people. Language models will always require a source of up-to-date information — we provide it.

Our initial focus is on coding-related queries. Our API will give developers a factual programming knowledge base they can query, allowing them to use smaller models that excel in reasoning rather than memorizing large amounts of often outdated information. Once successful, we will expand into other fields, ultimately scaling into a full-featured search engine.

Here is a technical demo showing how our search engine improves the results that GPT-4 provides when used for coding tasks;

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/7l-81Q1MrsM?vq=hd1080p" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

We are in the very early stages of setting up the company and actively seeking seed funding.


## Problem
- Language models “remember” facts they encounter during training, but information changes rapidly, and retraining models daily isn’t practical.
- Storing large amounts of information in model weights is expensive and slow, especially if you want the model to handle the entire accumulated knowledge of the internet.
- Information that appears only a handful of times during training isn’t always retained.
- Current search engines weren’t designed for LLM use; they expect short, keyword-heavy queries, not long detailed prompts.


## Solution

The solution is for language models to focus on general knowledge and reasoning, combined with a purpose-built search engine for information retrieval. It’s increasingly possible to isolate the reasoning capabilities during training ([see the DeepSeek R1 paper](https://arxiv.org/abs/2501.12948)), allowing for smaller and faster models.

We provide a search engine that:
- Can be updated rapidly with the latest information.
- Can return results for obscure queries that an LLM hasn’t memorized.
- Is more computationally efficient than LLMs.
- Is designed from the ground up for LLM integration.

Example use cases include asking an AI chatbot about today’s weather or how to integrate a specific SaaS tool with your webapp.

## Market Opportunity

The **challenge** is identifying a business opportunity that benefits from AI growth without:
- Competing against big AI labs.
- Being a thin wrapper around a model.
- Being undermined by future advancements in AI.

A search engine is **ideal** because:
- Growth in LLM usage directly benefits us: each additional LLM query means more revenue.
- Hardware improvements (AWS, cheaper storage, faster GPUs) make it feasible to build a search engine with a shoestring budget.
- Software improvements (Spark, vector DBs, LLM assistants) make coding the search engine much easier than it used to be.
- Ongoing AI research into ranking and information retrieval directly benefits us.
- Building a robust search engine requires time and care, creating a moat against trivial competition.


## Competition

### Bing API  
• Strengths: Highly scalable, used by OpenAI. Crawls the web daily. Capable of video and image search.  
• Weaknesses: Expensive, restrictive terms of use. Not designed for LLMs or code-specific queries.  

### Brave Search API  
• Strengths: Strong market presence. Used by Mistral, Perplexity, Cohere, and You.  
• Weaknesses: High fixed costs due to web-wide crawling and maintaining a browser. Not optimized for LLMs or programming-specific searches.  

### Exa.ai  
• Strengths: Modern NN-based search engine, built for LLM integration.  
• Weaknesses: Wide focus on dataset curation, which limits depth in code-related queries.  
(Exa is the company I admire/fear most. Their offering is very good.)

### Perplexity API  
• Strengths: Can provide factual information directly, rather than just links.  
• Weaknesses: Relies on Brave for search and lacks its own internet-wide search. Divided attention between its LLM and search. Very expensive.  

### Sourcegraph  
• Strengths: Excellent for searching codebases.  
• Weaknesses: Limited to known codebases. Does not index coding blogs or the broader internet.

Our biggest advantage is our exclusive focus on coding, which provides three main benefits:

- Cost: Competitors charge around $5–$25 per thousand requests (CPM). In contrast, a specialized coding search covers less than 1% of internet pages, so storage, bandwidth, and compute costs are much lower. We can therefore offer a far more affordable API.  

- Performance: Because we index a smaller subset of the internet, we can use algorithms that would be impractical for full-scale search engines. This yields a much higher-quality result for coding queries.

- Niche market exposure: By focusing on coding, we gain direct access to developers—who are ultimately the ones deciding which search APIs to use once we expand to a broader scope. We can also consider open sourcing the product.

## Market Size and Path to Profitability

We plan to generate revenue by charging for our API usage. Our variable costs for the coding-only MVP will be relatively low: one small EC2 instance can handle about 100 requests per second, or roughly 259 million requests per month. Even if we price our API as low as $2 CPM (cost per thousand queries), margins remain high.  

Developer-focused tools like Cursor, with 40,000 users (2024), and GitHub Copilot, with over 1.3 million paying subscribers, demonstrate the growing demand for developer-centric AI tools. If we partner with a few devtool companies, it is realistic to aim for 100,000 end users within a year. At this scale, with each user making an average of 100 queries daily, our revenue potential would be:  

Daily Queries: 100,000 users × 100 queries = 10 million queries  
Monthly Queries: 10 million queries/day × 30 days = 300 million queries  
Revenue at $2 CPM: 300 million queries ÷ 1,000 × $2 = $600,000 per month, or $7 million annually.  

Scaling further, 1 million users—10 times our initial target—would generate $70 million annually under the same pricing model.  

Looking even further ahead, as AI-assisted coding evolves to empower non-specialists to create software, the potential user base could grow into the hundreds of millions annually. Companies like Replit and others working on tools to enable laymen to build web apps could drive this, vastly expanding the market for coding-focused APIs like ours.  

Our projected burn rate is about $1 million per year, including a team of 2–4 people ($750k) and compute costs (~$250k). 

We aim to raise a seed round and later a Series A to cover these expenses, with the goal of breaking even by the end of 2026. When we expand into full-scale search, our costs will rise significantly, but so will our potential market, which encompasses billions of queries per day worldwide.

## Vision and Gameplan

Our goal is to operate the default search engine that LLMs use to source information. We face two main challenges:

1) **Technical**
It’s easy to build a search engine; it’s extremely difficult to index the entire internet while remaining fast and high-quality. We will start by focusing on a smaller segment (coding), which dramatically reduces complexity and allows us to build up our expertise.

2) **Distribution**
Developers ultimately choose which search engine APIs to integrate. We plan to win over developers by open sourcing our product (we will maintain up-to-date datasets) and offering free API access for low-volume usage. By focusing on coding first, we’ll grow recognition among developers, easing our path to broader market share later. We will spread the word through podcasts, blog articles, how-tos, and word of mouth.

## Progress

We are building our MVP and have most of the core infrastructure in place to search indexed pages. We still need to curate our dataset, and we expect to launch by Q3 2025. 

## Founder
I previously worked as an ML engineer, building data pipelines, training models, and deploying them to production. The company I worked for specializes in creating recommendation systems for books by analyzing their content using ML models. I received an Emergent Ventures grant from Tyler Cowen for my work on LLMs. My academic background is in biochemistry and microbiology, and I served in the military, passing paratrooper selection and serving on active duty. I’m a highly competitive amateur athlete, having won bronze at nationals.

## Team
I am in discussions with a number of potential founding engineers that are interested in joining the company. Since I'm looking to hire more established engineers, having already raised a seed round will make this a lot easier.

## Contact
[Website](https://getdelv.com)
[email](mailto:lukas@getdelv.com)