---
title: "My sprint to go from AI-user to AI-native. Here's week-1."
date: 2026-09-17
description: "I'm spending close to six weeks solo building automations and systems with Claude. Week-1: a script that checks a category on Gemini every morning, on its own."
series: "AI-user to AI-native"
part: 1
repo: "https://github.com/deswalsujan/geo-visibility-tracker"
---

I currently don't know coding. Week one of six, I shipped a python script using Claude that automatically checks in on a market every morning without me touching it. The broader goal I'm working towards is building a `GEO Visibility Tracker`.

## Why I'm doing this

I've been using AI for close to two years on marketing projects:

- building home and product webpages (design & content)
- prototyping the EquityList blog redesign
- setting up and running our thought-leadership newsletter
- data analysis to track growth, actively find opportunities and gaps in our inbound strategy and tying it to revenue
- a live Claude project built on insights from 170 sales demo calls

That last one fed four teams: sales (objection handling, new hire onboarding, competitive intelligence & differentiation), marketing (positioning, content ideas, voice-of-customer), operations (product onboarding painpoints and expectations), and product (what people liked, what confused or frustrated them with their existing solutions).

All of it ran on zero budget at an early-stage startup trying to stand toe-to-toe with incumbents, which brings its own excitement and challenges.

Basically, I used AI for either a) information extraction & analysis or b) asset creation, but none of it was automated.

This is the first time I'm using it to build and automate something end to end, running itself on a schedule. I'm doing it now because I'm looking at a move toward AI-native companies, and I wanted proof I could ship with these tools before I said so in an interview. And honestly, I haven't written in a long time and this seems like the perfect opportunity to jump back in.

## Week-1 build

`geo_check.py` sends a real buyer question to Gemini 3.6 Flash every day and logs the answer to a CSV. I picked cap table and equity management software as the category since this is the industry I worked in most recently, with eight brands on the watchlist (Carta, Pulley, EquityList, Ledgy, Vestd, Qapita, Cake Equity, and Certent). A GitHub Action fires it on a schedule and commits the result back to the repo, just a python script and cron job.

Model versions move fast enough that 3.6 Flash is only accurate as of this post.

The whole thing is one request:

```python
MODEL = "gemini-3.6-flash"
PROMPT = (
    "What's the best cap table and equity management software "
    "for an early-stage startup?"
)

def ask_gemini(prompt: str) -> str:
    response = requests.post(
        URL,
        params={"key": API_KEY},
        json={"contents": [{"parts": [{"text": prompt}]}]},
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()
    return data["candidates"][0]["content"]["parts"][0]["text"]
```

And this is what shows up in `results.csv` once it's running on its own:

```text
timestamp            trigger_type  model
2026-09-15T08:54:09  scheduled     gemini-3.6-flash
2026-09-16T08:47:49  scheduled     gemini-3.6-flash
2026-09-17T08:51:10  scheduled     gemini-3.6-flash
```

Three days, three rows, none of them mine.

> **Detour:** Two days of the week went somewhere else entirely. My site was still a single static HTML on cPanel (with the CMS on WordPress), which felt like the wrong foundation for a "building in public" page, so I rebuilt it on Astro and moved it to Cloudflare Workers before touching the tracker at all. That pushed the tracker's start back, but I'd make the same call again. This new website is in a better place to leverage AI agents.

## What broke

The Action reported success every day. The repo had no new data.

GitHub Action's commit step used `git diff --quiet` which only detects changes to tracked files. Since `results.csv` (the file where the Gemini query results are logged) was a brand new file created by Claude Code locally, git didn't see it as a tracked change at all, so the check reported "nothing changed" and skipped the local commit. The script ran fine, the data just only appeared on my local. The fix was staging the file first so `git diff --cached --quiet` could actually see it.

```diff
- if ! git diff --quiet; then
+ git add results.csv
+ if ! git diff --cached --quiet -- results.csv; then
```

Now as much as I'd like to take credit for this, my involvement here was making sure by manually checking the repo if `results.csv` was actually logging Gemini's responses or not. I flagged the issue to Claude Code and it identified the root cause and fixed it.

**The takeaway:** Simple, check your output, early and often.

## What I got wrong

I rotated an API key mid-week after Claude printed it in the terminal while debugging. It didn't leave my local but I've learned that exposing API keys is a common and huge (and potentially costly) mistake vibe coders make and I'm working on inculcating best-practices as I'm learning.

## Next week

A real prompt set instead of one question, adding more models to track brand visibility across different models, and parsing brand mentions out of the raw text so you can actually use the info.
