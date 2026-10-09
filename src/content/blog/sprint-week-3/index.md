---
title: "Sprint week-3 & 4: Running into trouble...and pivoting"
date: 2026-10-10
description: "Weeks 3 and 4 of my sprint. My two builds are not up to the mark. Some hard lessons learned."
series: "AI-user to AI-native"
part: 3
---

I've been sitting on this blog post for 7 days. And then another 7 days procrastinating on reviewing it. Although not all time is lost, because in the meanwhile I built something that was honestly not possible before AI. Something that I wished when I was playing a computer game many of you will have nostalgia for - Counter-Strike 1.6 (more on this later).

## Recap

In [week 1](https://sujandeswal.com/blog/sprint-week-1/) and [week 2](https://sujandeswal.com/blog/sprint-week-2/) I built a GEO visibility tracker, which asked three AI models the same 27 questions about equity management software every day and counted how often eight brands came up. I ran it without _grounding_ and the models kept confidently telling me a company that had [recently announced it was shutting down](https://techcrunch.com/2026/09/16/pulley-a-carta-rival-is-shutting-down/), wasn't. I did note that this was a critical gap but parked grounding after roughly calculating that it could cost me anywhere between $20-$50 per month.

Build two was the GEO MCP server. The plan was to connect Search Console data (of this site) to BigQuery, so I could ask Claude directly the source of any AI traffic.

After I published the week 2 write-up, I was inside Search Console diagnosing a different problem, and a realization struck me. At EquityList I had seen Google Analytics show referral traffic from OpenAI, Claude, Microsoft Copilot etc (and later also when we switched over to [Plausible Analytics](https://plausible.io/)). I had never seen Search Console do that. So I asked Opus bluntly whether Search Console can even track AI traffic. It said no, it can't.

Then I asked what was it leading me through with this build exercise if we can't track AI referral traffic inherently in GSC? It said something along the lines that:

"oops my bad, what we're trying to see is if we're _losing_ traffic to AI overview". 

Alright, but we don't get any direct data related to that also in GSC.

"yeah oops, what we'll be doing is seeing if impressions go up but clicks are going down which _could_ mean that AI overview is eating your traffic because it's showing the answer to a user's query in Google search results itself."

Alright, but my clicks could go down because my page rank went down. Or even that someone else is being quoted now instead of my site.

"yeah no....yeah, what we're doing is _inferring_ if _maybe_ you're losing traffic because _maybe_ AI took it... yeahhhhh"

![Source: South Park](https://media1.tenor.com/m/eVCVNLCQBd0AAAAd/yeah-no.gif)

This is where I kind of lost it because basically I had spent two weeks on two builds that were just producing indications (and even those couldn't be fully trusted).

And while I was frustrated at the model, I was more frustrated at myself...because **I know, in the first place itself, GSC does not show referral traffic from AI tools like ChatGPT or Claude**.

## A reasoned bet and a lazy miss

**(Some background)** 

The sprint plan came from Claude Fable almost a month ago. I wanted to learn to build with AI after two years of being a user, so I asked Fable what someone with my experience with no development background could build. It gave me a plan in the form of a 'sprint' with a timeline of six weeks and four tools.

Handing it that question was a reasoned bet. Fable was purported as one of the best frontier models and I'm operating out of India, with no direct exposure to how marketers at high-growth companies like Stripe/Google/OpenAI/Anthropic, are leveraging AI. So I felt that a frontier model with its vast knowledge, access to so many resources (like news, social media, popular GitHub repos, blog posts), plus two years of memory of how I work, can probably build a better (and customized) plan for me than what I might.

**(Circling back to the builds)** 

But GSC specifically was a miss at my end and hence my crash out. 

In the last 8-10 months, Google has been aggressively adding new AI features to Search Console. 

Now since I left EquityList (roughly 3.5 months at the time of writing), I haven't had reason to use the GSC dashboard (my website doesn't get much traffic). 

Suffice it to say, when Fable (and then later Opus) listed the GSC-MCP server as a build, I got excited and still remember thinking that GSC does not show referral traffic from specific sources...but maybe this is a new feature that's exposed in an MCP if someone is willing to build it. 

**And there it was, that was my mistake**. 

Had I just confirmed it then and there instead of letting it be, I could have saved some of my time. 

## What happened next

Before deciding my next steps, I was still curious to know how would my builds (such as they were) be reviewed by experts. 

So in an incognito Claude chat, I asked Opus 5.5 to assume the roles of a CMO and a senior developer at Anthropic or OpenAI and create an evaluation criteria to review these repos. ([See full prompt](/blog/sprint-week-3/evaluation-prompt.txt))

Then in a new incognito chat again (incognito chats so that my account memories don't pollute or influence the evaluation) I fed in the prompt from above and links to my GitHub repos. 

They scored 13 out of 40 and 19 out of 40. I ran the same prompt through DeepSeek on the same two repos and it mostly agreed with Opus's evaluation.

**GitHub links to the repos:**

* [geo-visibility-tracker](https://github.com/deswalsujan/geo-visibility-tracker)
* [gsc-geo-mcp](https://github.com/deswalsujan/gsc-geo-mcp)

I'm not going to lie, I was hoping for better scores despite knowing the shortcomings. But the disappointment was short-lived because it also put in front of me all the things that I had learned while working on them.

After stepping away for a day and working on other things, I came back and started a fresh chat with Claude. I gave it both evaluations and asked it to suggest new builds but with the following important constraints this time:
* I want to learn to build something a real practitioner can use
* Using our previous chats/memory suggest ideas that I explicitly wished could be automated or Claude sees an opportunity for automation (in hindsight, this is the thought process I should have actually planned my builds with)

Claude came back with two builds. I haven't committed to them yet. I'm taking it one day at a time now, not a fixed six-week plan. 

## It's not all net negative

I haven't been sitting idle these 2 weeks. AI tools like Claude are incredible and we're living through an incredible time at the moment. 

Counter-Strike 1.6 has been a huge part of my life growing up and I've always felt the need to give back to the community (Fun fact: I first got into writing because of CS which later germinated into my first marketing role as a content marketer).

With Claude: 
* I've started a new [YT channel on CS 1.6](https://www.youtube.com/@suckopticalmouse) 
    * It taught me how to merge different video recordings together into a single file (using `LosslessCut`) 
    * How to make & edit thumbnails to fit YT requirements (using [Photopea.com](https://www.photopea.com/)) 
    * And even walked me through a video editing software so that I can stitch together videos and add hardcoded labels to different sections (using `DaVinci Resolve`)
* I created a working [CS 1.6 HLTV demo viewer inside a browser](https://deswalsujan.github.io/cs16-demo-viewer/) (more on this later in a separate post)

Most importantly, it has helped me be excited about what I want to do next, the learning as well as the building.

## Some lessons I'm taking away

* I'm deliberating more carefully on the builds this time and not outsourcing my decisions.
* Build something I wish existed that could have made my work responsibilities easier/faster
* Generally, keeping a stricter check on myself for bike-shedding and shiny object syndrome. This week I spent time on side-quests like website hygiene, installing Hermes agent to see what it's about, and even a local open model (Gemma 4 via [Llama.app](https://llama.app/)). All good learning for me but it was also time I could have spent on building something for my portfolio.
