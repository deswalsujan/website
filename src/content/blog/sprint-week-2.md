---
title: "Sprint week-2: GEO Visibility Tracker (contd.)"
date: 2026-09-23
description: "Week two of my six-week sprint. The GEO Visibility Tracker now asks three models 27 buyer questions a day, counts brand mentions, and posts a weekly update to Slack."
series: "AI-user to AI-native"
part: 2
repo: "https://github.com/deswalsujan/geo-visibility-tracker"
---

Last week my script asked Gemini one question a day. This week I updated it to 27 buyer questions to three different models every morning, which comes to 81 answers a day, and checks every answer against eight brands (yes, it's a fixed workflow. Users cannot input brands on the fly). 

Every Monday, a message lands in Slack telling me which brands gained or lost visibility in AI answers over the past week.

The Slack message is the final output of this tracker.

## How it works

The system depends on three scripts. Each does one job and hands its output to the next.

```
geo_check.py       asks models the questions, saves the answers   -> results.csv
parse_mentions.py  counts brand mentions in each answer    -> results.db
weekly_diff.py     compares this week to last week         -> Slack
```

- **Step one** `geo_check.py` script sends select 27 questions about equity management (the category that I selected) to Gemini Flash, Claude Haiku, and OpenAI's GPT-5.6 Luna every morning and saves each answer as a row in `results.csv`.

- **Step two** `parse_mentions.py` script reads every answer and checks if any of the eight brands (Carta, Pulley, EquityList, Ledgy, Vestd, Qapita, Cake Equity, and Astrella) that I'm tracking were mentioned by name and, additionally, their website URL. The resulting counts go into a small database i.e. `results.db`.

- **Step three** `weekly_diff.py` runs on Mondays. It compares the last seven days to the seven before that, by brand and by model, and posts the change to a Slack channel (for this, I've created a personal Slack workspace). But if a week doesn't have enough data then we do add a clarifying message saying "(limited history)" so that it's clear to the user that this is not actionable data yet.

It's all plain Python with no "agent" framework. What I've essentially built is a fixed pipeline automation; steps running in the same order every day with no agents sitting in between to decide _what next_. Bringing this upfront because quite a few things are called agents nowadays and I want to be precise.

## Some takeaways and decisions

- **I invariably ended up witnessing what an efficient way to work with AI looks like:** You break things down into steps, no one-shotting it. On each step you work rigorously with the AI to nail down your idea/approach/expectations > build it > test it, and very importantly, document it (e.g. I've been maintaining a `LOG.md` which contains a daily entry of what was shipped/decided/learned/found. And a `PLAN.md` which contains the actual list of daily tasks of the sprint, side quests, and an important skipped/parked section that helps me avoid scope creep and acts as a ledger of decisions I might want to implement _after_ the sprint is over to see if I can further improve the tools that I've made)

- **Models require `grounding`:** In the current version of the tool, I'm picking up results directly from the models' knowledge, they have no access to the internet to live corroborate their responses. And because of that one answer contained a website that, as far as I can tell, never existed. Another provided outdated information like saying a company was functional when it has been defunct for close to three years.

That's the honest limitation of this tool as it stands. I did scope adding grounding; it would require maybe 1-2 days and roughly $15-50 a month in extra API cost, which is why I parked it until after the sprint.

- **Vetting the questions:** Claude did give me a list of 32 questions originally which I then whittled down to 27 after carefully examining each one and either deleting, adding, combining them so that each question was differentiated yet adding value.

- **Vetting the output (running `evals` and human checks):** 
	- When a Gemini API call failed, `geo_check.py`'s error message printed the full request URL, and the API key was part of that URL. So every failed request printed my key right along with the error. Fixed it so that the script errors no longer include the key, and rotated the key also.
	- Earlier in the week the citation counter said out of 321 answers, not a single one mentioned the brand's website. This bug was happening because the script was only looking for full links starting with `https://` whereas the models were mostly writing plain domains like carta.com
	- One brand had zero mentions because all the questions were designed towards equity management for early and growth stage companies so I updated the brand list by replacing the enterprise brand with a growth stage one (it was already coming up organically in the models answers) so that the results could be more accurate. 
	- Then we also ran an `eval` script where it pulled a csv of 20 'brand-checks' (one brand checked against one answer). I read each one myself and marked whether the brand that `parse_mentions.py` script had pulled out from the models' answer was actually present or not. There were two misses a) Pulley got counted as a brand mention when in fact the answer was asking a _clarifying question_ of whether the user meant Pulley of pulley.com b) A model responded with "Cake" instead of "Cake Equity" so the script disqualified as not a brand mention since it wasn't the full name. So in the end, we agreed on 18 out of 20 - both fixes are parked for later. 90% on a small sample is good enough to trust the weekly trend, not any single row.


## What the GEO visibility tracker costs as of now

About $1.19 across all three providers for the first five days of full runs.

Getting to this total also took some time because each provider's billing page shows a different window. Gemini shows a rolling 28 days. OpenAI resets every month. Anthropic shows everything since the key was created. Comparing month to month later will mean pulling matching dates by hand.

## Next week

An MCP server that lets someone ask Claude which of their blog posts lost AI-referral traffic this month, using their own Google Search Console data. This week's tracker watches what AI says about brands. Week 3 looks at what AI is doing to a site's traffic.
