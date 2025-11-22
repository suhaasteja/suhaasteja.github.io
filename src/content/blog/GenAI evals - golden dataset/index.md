---
title: 'Evaluating GenAI: Building Your "Golden Dataset"'
description: 'A surgical approach to evaluating GenAI systems using topic modeling and targeted generation.'
pubDate: 'Nov 21 2025'
heroImage: '/blog-banner.jpg'
---

Evaluation is the single most critical component of a GenAI system. If you can't measure it, you can't improve it. But how does everyone actually do it?

Most teams fall into one of two traps:
1.  **The Manual Slog:** Collecting logs and manually checking answers against a knowledge base. (Unscalable).
2.  **The Shotgun Approach:** Using tools like RAGAS to randomly generate a test set from your documents. (Good for a baseline, but lacks depth).

This post proposes a **Surgical Approach**: A customizable workflow that uses Topic Modeling to build a "Golden Dataset" that actually tests your system's weak points.

## The Workflow: From Random to Surgical

Instead of randomly sampling chunks, we use structure to guide our generation.

### Step 1: Know Your Data (Topic Modeling)
Gather your data (structured or unstructured text) and run a topic modeling tool like **BERTopic**.
* **Why?** This gives you a map of your knowledge base. You can see exactly how much data you have for "Authentication" vs. "Pricing."
* **The Insight:** This distribution allows you to identify **scarce topics** (edge cases) that a random sampler would likely miss.

### Step 2: Targeted Generation
Based on these topics, we generate Question-Answer (QA) pairs. This allows for a surgical approach:
* **RAGAS (The Shotgun):** "Here is a random spread of questions from your data."
* **This Method (The Scalpel):** "I know my 'Authentication' topic is weak, so I am going to force-generate 50 adversarial questions specifically for that topic."

*Tip: You can control the LLM context window based on the length/size of the documents in each topic to optimize performance.*

### Step 3: The "Fool's Gold" Filter (Quality Control)
A generator LLM can hallucinate. If your test data is bad, your evaluation is worthless. We introduce a **Critic Loop**:
1.  **Generate:** The first LLM creates a QA pair from the context.
2.  **Critique:** A *separate* "Critic LLM" (e.g., Claude 3.5 Sonnet) reads *only* the context and attempts to answer the generated question.
3.  **Validate:** Compare the Critic's answer with the Generator's answer using simple metrics (like ROUGE/BLEU) or an LLM-as-a-Judge. If they don't match, discard the pair.

## The Multi-Hop Dilemma

This method is fantastic for single-hop QA. However, we must be honest about its limits.
* **The Challenge:** Real users ask complex questions that bridge multiple documents ("How does X affect Y?").
* **The Reality:** While we can try to find documents with overlapping topics, **Knowledge Graphs are king** for multi-hop generation. If your app relies heavily on complex reasoning, you might need a Graph-based approach.
* **The Compromise:** For most RAG applications, the "Topic Intersection" method (finding docs that score high in two different topics) is a powerful middle ground.

## Why This Approach Wins

1.  **Edge Case Coverage:** Topic modeling ensures you test the "scarce" topics just as thoroughly as the popular ones.
2.  **Surgical Control:** You stop guessing and start testing specific behaviors.
3.  **Higher Quality:** The Critic Loop ensures your "Golden Dataset" isn't filled with hallucinations.
4.  **Flexibility:** It bends to your rules. You don't need to learn a complex framework's proprietary DSL—just standard Python and LLMs.

