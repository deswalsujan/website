---
title: "My sprint to go from AI-user to AI-native. Here's week-1."
date: 2026-09-17
description: "I'm spending close to six weeks solo building automations and systems with Claude. Week-1: a script that checks a category on Gemini every morning, on its own."
---

I currently don't know coding. Week one of six, I shipped a python script using Claude that automatically checks in on a market every morning without me touching it. The broader goal I'm working towards is building a `GEO Visibility Tracker`

## Why I'm doing this?

I've been using AI, for close to two years, for marketing projects for quite a while now like
- building home and product webpages (design & content)
- prototyping the EquityList blog redesign
- setting up and running our thought-leadership newsletter
- data analysis to track growth, actively find opportunities and gaps in our inbound strategy and tying it to revenue
- a live Claude project that had insights from 170 sales demo calls that helped sales (objection handling, new hire onboarding, competitive intelligence & differentiation), marketing (positioning, content ideas, voice-of-customer), operations (product onboarding painpoints and expectations), product (what people liked, what confused or frustrated them with their existing solutions)

and what not; the excitement and challenges that come with zero-budget marketing at an early-stage startup trying to stand toe-to-toe with incumbents.

Basically, I used AI for either a) information extraction & analysis or b) asset creation, but none of it was automated.

This is the first time I'm using it to build and automate something end to end, running itself on a schedule. I'm doing it now because I'm looking at a move toward AI-native companies, and I wanted proof I could ship with these tools before I said so in an interview. And honestly, I haven't written in a long time and this seems like the perfect opportunity to jump back in.

## Week-1 build:

`geo_check.py` sends a real buyer question to `Google Gemini 3.6 Flash` (at the time of writing this post, you know how quickly these things are changing) every day and logs the answer to a CSV. I picked cap table and equity management software as the category since this is the industry I worked in most recently, with eight brands on the watchlist (Carta, Pulley, EquityList, Ledgy, Vestd, Qapita, Cake Equity, and Certent). A GitHub Action fires it on a schedule and commits the result back to the repo, just a python script and cron job.

> Two days of the week went somewhere else entirely. My site was still a single static HTML on cPanel (with the CMS on WordPress), which felt like the wrong foundation for a "building in public" page, so I rebuilt it on Astro and moved it to Cloudflare Workers before touching the tracker at all. That pushed the tracker's start back, but I'd make the same call again. This new website is in a better place to leverage AI agents.

The best lesson of the week came from a bug that, if it had not been fixed immediately, would have cost me a few wasted days. GitHub Action's commit step used `git diff --quiet` which only detects changes to tracked files. Since `results.csv` (the file where the Gemini query results are logged) was a brand new file created by Claude Code locally, git didn't see it as a tracked change at all, so the check reported "nothing changed" and skipped the local commit. So the repo on GitHub showed no new data despite the Action reporting its automated workflow a success (note: the script ran fine but the data only appeared on my local). The fix was staging the file first so `git diff --staged --quiet` could actually see it.

Now as much as I'd like to take credit for this, my involvement here was making sure by manually checking the repo if `results.csv` was actually logging Gemini's responses or not. I flagged the issue to Claude Code and it identified the root cause and fixed it.

**The takeaway:** Simple, check your output, early and often.

**Repo link:** [https://github.com/deswalsujan/geo-visibility-tracker](https://github.com/deswalsujan/geo-visibility-tracker)

P.S. Also rotated an API key mid-week after Claude printed it in the terminal while debugging. It didn't leave my local but I've learned that exposing API keys is a common and huge (and potentially costly) mistake vibe coders make and I'm working on inculcating best-practices as I'm learning.

---

Next week: a real prompt set instead of one question, adding more models to track brand visibility across different models, and parsing brand mentions out of the raw text so you can actually use the info.
