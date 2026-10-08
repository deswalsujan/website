---
title: "How You Can Download a Full PageSpeed Insights Report on Your Mac"
date: 2025-10-05
description: "A step-by-step guide to generating full PageSpeed Insights reports on a Mac using Lighthouse locally, with no API key, quotas, or Google Cloud billing required."
---

Most people who try to download their full PageSpeed Insights report hit the same roadblock.

Google’s tool shows you the results but doesn’t give you a simple way to download them.

If you try the API, you run into quotas, billing prompts, or setup hurdles.

I ran into this exact problem. I wanted the full report—the same one PageSpeed Insights generates—with details like **Largest Contentful Paint**, **Render-Blocking Requests**, and the **Network Dependency Tree**.

I didn’t want to depend on Google Cloud or enter a credit card.

You can do this directly on your Mac using **Lighthouse**, the open-source tool that powers PageSpeed Insights.

Here’s how.

* * *

## Step 1. Install Homebrew

Homebrew lets you install software from the command line. It’s safe, open-source, and easy to remove later.

Open **Terminal** and run:

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

If you already have Homebrew, skip this step.

* * *

## Step 2. Install Node.js

Lighthouse runs on Node.js. You can install it with:

```
brew install node
```

Check that it’s ready:

```
node -v
npm -v
npx -v
```

You should see version numbers.

* * *

## Step 3. Run Lighthouse

Now run Lighthouse on your website.

In Terminal, type:

```
npx lighthouse https://yourwebsite.com --preset=desktop --output=html --output=json --output-path=./lighthouse_desktop
```

When it asks:

```
Need to install the following packages:
lighthouse@latest
Ok to proceed? (y)
```

Press **y** and hit Enter.

Lighthouse will analyze your site and create two files:

```
lighthouse_desktop.report.html
lighthouse_desktop.report.json
```

* * *

## Step 4. Open the Reports

Open the HTML report in your browser:

```
open lighthouse_desktop.report.html
```

This file looks identical to what you see on the PageSpeed Insights website.

You can expand sections, view metrics, and explore audits like “Reduce Unused JavaScript” or “Avoid Chaining Critical Requests.”

The JSON file holds the same data in a structured format.

It’s ideal for automation or for giving to an AI model to analyze your site and recommend improvements.

* * *

## Step 5. Run Mobile Tests

You can also generate a mobile report:

```
npx lighthouse https://yourwebsite.com --emulated-form-factor=mobile --throttling.cpuSlowdownMultiplier=4 --throttling-method=simulate --output=html --output=json --output-path=./lighthouse_mobile
```

You’ll now have:

```
lighthouse_mobile.report.html
lighthouse_mobile.report.json
```

* * *

## Step 6. Clean Up (Optional)

To remove Node.js and free space later:

```
brew uninstall node
npm cache clean --force
brew cleanup
```

* * *

## Why This Works

PageSpeed Insights uses Lighthouse under the hood.

Running Lighthouse on your Mac gives you the same results without API limits or account setup.

You can test live, staging, or even local versions of your site.

You’re using the same engine Google uses—just without the middleman.

* * *

## Automate It (Optional)

You can save time by running Lighthouse daily with a small script:

```
#!/bin/bash
timestamp=$(date +"%Y-%m-%d_%H-%M")
for device in desktop mobile; do
  npx lighthouse https://yourwebsite.com \
  $( [ "$device" = "mobile" ] && echo "--emulated-form-factor=mobile --throttling.cpuSlowdownMultiplier=4" ) \
  --output=html --output=json --output-path=./lighthouse_${device}_${timestamp}
done
```

This creates timestamped reports every time you run it.

* * *

## Conclusion

You don’t need Google Cloud or an API key to access full PageSpeed Insights data.

You can generate complete HTML and JSON reports right from your Mac with Lighthouse.

It’s fast, accurate, and gives you full control.

If this helped you, share it. Many people are still stuck behind quota errors and billing pop-ups, and this simple approach solves that problem for good.
