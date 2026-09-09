---
title: "How to Convert Your Blog Posts to Markdown for AI Analysis"
date: 2026-01-27
description: "A tutorial on scripting a sitemap-driven pipeline that scrapes blog posts, converts them to clean markdown with YAML frontmatter, and combines them into one document for LLM analysis."
---

## What You’ll Learn

By the end of this tutorial, you’ll be able to:

1.   Extract all blog posts from your sitemap automatically
2.   Convert HTML content to clean markdown
3.   Preserve metadata (author, dates, categories, descriptions)
4.   Structure posts with YAML frontmatter for easy LLM analysis
5.   Combine posts intelligently for batch analysis

**Time investment:** 30 minutes setup, 2 minutes runtime for 100+ posts

**Technical level:** Basic command line knowledge required

## Prerequisites

*   Python 3.7+ installed on your computer
*   Access to your blog’s sitemap (usually at yoursite.com/sitemap.xml)
*   Basic familiarity with terminal/command prompt

**Platform agnostic:** This works for any blog platform (WordPress, Webflow, Ghost, custom CMS) as long as you have a sitemap.

* * *

## Step 1: Understand Your Blog Structure

Before writing any code, inspect your blog to understand:

### A. Sitemap Location

Most blogs have a sitemap at:

*   `https://yourblog.com/sitemap.xml`
*   `https://yourblog.com/sitemap_index.xml`
*   `https://yourblog.com/post-sitemap.xml`

Check your robots.txt file (`yourblog.com/robots.txt`) to find your sitemap URL.

### B. HTML Structure

Visit one blog post and inspect the HTML (right-click → “View Page Source”):

**Find these elements:**

*   Main content container (usually has a class like `post-content`, `article-body`, `rich-text`)
*   Title element (usually an `<h1>` tag)
*   Author name
*   Publication date
*   Category/tags
*   Featured image

**Pro tip:** Use browser DevTools (F12) to inspect elements and identify CSS selectors.

For example:

*   Content: `<div class="text-rich-text">`
*   Title: `<h1 class="heading-style-h2">`
*   Author: `<p class="text-size-regular text-color-brandnile">`
*   Date: `<p class="text-size-regular text-color-grey">`

## Step 2: Set Up Your Environment

### Create Project Folder

```
mkdir blog_converter
cd blog_converter
```

### Install Python Dependencies

Create a `requirements.txt` file:

```
requests>=2.31.0
beautifulsoup4>=4.12.0
lxml>=4.9.0
markdownify>=0.11.6
PyYAML>=6.0.1
```

Install dependencies:

```
pip install -r requirements.txt
# Or on Mac: pip3 install -r requirements.txt
```

**What each library does:**

*   `requests` – Fetches web pages
*   `beautifulsoup4` – Parses HTML
*   `lxml` – Fast XML/HTML parser
*   `markdownify` – Converts HTML to Markdown
*   `PyYAML` – Handles YAML frontmatter

## Step 3: Build the Converter Script

Create `blog_to_markdown.py`:

```
#!/usr/bin/env python3
"""
Blog Post to Markdown Converter
Extracts blog posts from sitemap and converts them to markdown with YAML frontmatter
"""

import re
import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md
from pathlib import Path
from datetime import datetime
import yaml
import time

class BlogConverter:
    def __init__(self, sitemap_url, output_dir="blog_posts"):
        self.sitemap_url = sitemap_url
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (compatible; BlogConverter/1.0)'
        })

    def fetch_sitemap(self):
        """Fetch and parse the sitemap to get all blog post URLs"""
        print(f"Fetching sitemap from {self.sitemap_url}...")
        response = self.session.get(self.sitemap_url)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'xml')
        urls = soup.find_all('loc')

        # Filter only blog post URLs (adjust pattern for your blog)
        blog_urls = [url.text for url in urls if '/blog-post/' in url.text]
        print(f"Found {len(blog_urls)} blog posts")
        return blog_urls

    def fetch_page(self, url):
        """Fetch a single blog post page"""
        response = self.session.get(url)
        response.raise_for_status()
        return BeautifulSoup(response.content, 'html.parser')

    def extract_metadata(self, soup, url):
        """Extract metadata from the blog post"""
        metadata = {
            'url': url,
            'slug': url.split('/blog-post/')[-1]
        }

        # Title - adjust selector for your blog
        title_tag = soup.find('h1', class_='heading-style-h2')
        metadata['title'] = title_tag.get_text(strip=True) if title_tag else 'Untitled'

        # Meta description
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        metadata['description'] = meta_desc['content'] if meta_desc else ''

        # Category - adjust selector for your blog
        category_div = soup.find('div', class_='w-dyn-list')
        if category_div:
            category_item = category_div.find('div', role='listitem')
            if category_item:
                metadata['category'] = category_item.get_text(strip=True)

        # Author - adjust selector for your blog
        author_tag = soup.find('p', class_='text-size-regular text-color-brandnile')
        metadata['author'] = author_tag.get_text(strip=True) if author_tag else ''

        # Dates - adjust selector for your blog
        date_divs = soup.find_all('p', class_='text-size-regular text-color-grey')
        for div in date_divs:
            text = div.get_text(strip=True)
            parent = div.find_parent('div', class_='date_flex')
            if parent:
                label = parent.find('div', class_='text-weight-medium')
                if label:
                    label_text = label.get_text(strip=True)
                    if 'Published' in label_text:
                        metadata['published_date'] = text
                    elif 'Updated' in label_text:
                        metadata['updated_date'] = text

        # Featured image
        img_tag = soup.find('img', class_='blogtp_hero-banner')
        if img_tag:
            metadata['featured_image'] = img_tag.get('src', '')

        # OG Image (fallback)
        if not metadata.get('featured_image'):
            og_image = soup.find('meta', property='og:image')
            if og_image:
                metadata['featured_image'] = og_image['content']

        return metadata

    def extract_content(self, soup):
        """Extract the main blog post content"""
        # Adjust selector for your blog's content container
        content_div = soup.find('div', class_='text-rich-text')

        if not content_div:
            return ""

        # Remove unwanted elements
        for element in content_div.find_all(['script', 'style']):
            element.decompose()

        # Convert to markdown
        html_content = str(content_div)
        markdown_content = md(html_content, heading_style="ATX", bullets="-")

        # Clean up the markdown
        markdown_content = self.clean_markdown(markdown_content)

        return markdown_content

    def clean_markdown(self, text):
        """Clean up markdown formatting"""
        # Remove excessive newlines
        text = re.sub(r'\n{3,}', '\n\n', text)

        # Fix spacing around headers
        text = re.sub(r'\n(#{1,6} )', r'\n\n\1', text)
        text = re.sub(r'(#{1,6} .+)\n', r'\1\n\n', text)

        # Remove leading/trailing whitespace
        text = text.strip()

        return text

    def create_markdown_file(self, metadata, content):
        """Create a markdown file with YAML frontmatter"""
        # Create frontmatter
        frontmatter = {
            'title': metadata.get('title', ''),
            'slug': metadata.get('slug', ''),
            'url': metadata.get('url', ''),
            'description': metadata.get('description', ''),
            'author': metadata.get('author', ''),
            'category': metadata.get('category', ''),
            'published_date': metadata.get('published_date', ''),
            'updated_date': metadata.get('updated_date', ''),
            'featured_image': metadata.get('featured_image', '')
        }

        # Remove empty values
        frontmatter = {k: v for k, v in frontmatter.items() if v}

        # Create the complete markdown document
        markdown_doc = "---\n"
        markdown_doc += yaml.dump(frontmatter, allow_unicode=True, sort_keys=False)
        markdown_doc += "---\n\n"
        markdown_doc += content

        return markdown_doc

    def save_markdown(self, slug, markdown_content):
        """Save the markdown file"""
        # Sanitize filename
        filename = re.sub(r'[^\w\-]', '_', slug)
        filepath = self.output_dir / f"{filename}.md"

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(markdown_content)

        return filepath

    def process_post(self, url):
        """Process a single blog post"""
        try:
            print(f"Processing: {url}")

            # Fetch the page
            soup = self.fetch_page(url)

            # Extract metadata
            metadata = self.extract_metadata(soup, url)

            # Extract content
            content = self.extract_content(soup)

            if not content:
                print(f"    Warning: No content found for {url}")
                return None

            # Create markdown document
            markdown_doc = self.create_markdown_file(metadata, content)

            # Save to file
            filepath = self.save_markdown(metadata['slug'], markdown_doc)

            print(f"  ✓ Saved to: {filepath}")
            return filepath

        except Exception as e:
            print(f"  ✗ Error processing {url}: {str(e)}")
            return None

    def create_index(self, results):
        """Create an index file with all posts"""
        index_path = self.output_dir / "INDEX.md"

        with open(index_path, 'w', encoding='utf-8') as f:
            f.write("# Blog Posts Index\n\n")
            f.write(f"Total posts: {len(results)}\n\n")
            f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write("---\n\n")

            for i, (url, filepath) in enumerate(results.items(), 1):
                if filepath:
                    slug = filepath.stem
                    f.write(f"{i}. [{slug}]({filepath.name}) - {url}\n")

        print(f"\n✓ Created index file: {index_path}")

    def run(self, limit=None):
        """Run the conversion process"""
        start_time = time.time()

        # Fetch all blog URLs
        blog_urls = self.fetch_sitemap()

        # Limit for testing
        if limit:
            blog_urls = blog_urls[:limit]
            print(f"Processing first {limit} posts only (testing mode)")

        # Process each post
        results = {}
        for i, url in enumerate(blog_urls, 1):
            print(f"\n[{i}/{len(blog_urls)}]")
            filepath = self.process_post(url)
            results[url] = filepath

            # Be polite - add a small delay between requests
            time.sleep(0.5)

        # Create index
        self.create_index(results)

        # Summary
        successful = sum(1 for fp in results.values() if fp is not None)
        failed = len(results) - successful
        elapsed = time.time() - start_time

        print(f"\n{'='*60}")
        print(f"Conversion Complete!")
        print(f"{'='*60}")
        print(f"Total posts: {len(results)}")
        print(f"Successful: {successful}")
        print(f"Failed: {failed}")
        print(f"Time elapsed: {elapsed:.2f} seconds")
        print(f"Output directory: {self.output_dir.absolute()}")

def main():
    import argparse

    parser = argparse.ArgumentParser(description='Convert blog posts to Markdown')
    parser.add_argument('--sitemap', required=True,
                        help='Sitemap URL')
    parser.add_argument('--output', default='blog_posts',
                        help='Output directory')
    parser.add_argument('--limit', type=int,
                        help='Limit number of posts (for testing)')

    args = parser.parse_args()

    converter = BlogConverter(args.sitemap, args.output)
    converter.run(limit=args.limit)

if __name__ == '__main__':
    main()
```

## Step 4: Customize for Your Blog

**Critical:** You must adjust the CSS selectors in `extract_metadata()` and `extract_content()` methods to match your blog’s HTML structure.

### How to Find Your Selectors:

1.   **Open any blog post** on your site
2.   **Right-click** on the title → “Inspect”
3.   **Note the class name** (e.g., `post-title`, `entry-title`, `article-heading`)
4.   **Replace** in the script:

```
# Change this:
title_tag = soup.find('h1', class_='heading-style-h2')

# To your selector:
title_tag = soup.find('h1', class_='post-title')
```

Repeat for:

*   Content container
*   Author
*   Date
*   Category
*   Featured image

### Common Selectors by Platform:

**WordPress:**

```
content_div = soup.find('div', class_='entry-content')
title_tag = soup.find('h1', class_='entry-title')
author_tag = soup.find('span', class_='author')
```

**Ghost:**

```
content_div = soup.find('div', class_='post-content')
title_tag = soup.find('h1', class_='post-title')
author_tag = soup.find('a', class_='author-name')
```

**Medium:**

```
content_div = soup.find('article')
title_tag = soup.find('h1')
author_tag = soup.find('a', attrs={'data-action': 'show-user-card'})
```

## Step 5: Run the Converter

### Test with Limited Posts First

`python3 blog_to_markdown.py --sitemap https://yourblog.com/sitemap.xml --limit 3`
**Expected output:**

```
Fetching sitemap from https://yourblog.com/sitemap.xml...
Found 150 blog posts
Processing first 3 posts only (testing mode)

[1/3]
Processing: https://yourblog.com/blog-post/example-post
  ✓ Saved to: blog_posts/example-post.md

[2/3]
Processing: https://yourblog.com/blog-post/another-post
  ✓ Saved to: blog_posts/another-post.md

[3/3]
Processing: https://yourblog.com/blog-post/third-post
  ✓ Saved to: blog_posts/third-post.md

✓ Created index file: blog_posts/INDEX.md

============================================================
Conversion Complete!
============================================================
Total posts: 3
Successful: 3
Failed: 0
Time elapsed: 4.52 seconds
Output directory: /Users/you/blog_converter/blog_posts
```

### Verify Output

Check the `blog_posts/` folder. Open one `.md` file:

```
---
title: How to Calculate ESOP Taxation in India
slug: esop-taxation-india
url: https://yourblog.com/blog-post/esop-taxation-india
description: Complete guide to ESOP taxation in India...
author: Jane Doe
category: ESOP Management
published_date: November 15, 2024
updated_date: November 20, 2024
featured_image: https://yourblog.com/images/esop-tax.jpg
---

## Understanding ESOP Taxation

Employee Stock Option Plans (ESOPs) are taxed at two stages...

[rest of content]
```

**Good signs:**

*   ✅ YAML frontmatter is properly formatted
*   ✅ All metadata fields are populated
*   ✅ Content is clean markdown (no HTML tags)
*   ✅ Headings, lists, and links are preserved

**Red flags:**

If you see red flags, revisit Step 4 and adjust your selectors.

### Run Full Conversion

Once you’re satisfied with the test:

`python3 blog_to_markdown.py --sitemap https://yourblog.com/sitemap.xml`
For 100 posts, expect 1-2 minutes runtime.

## Step 6: Combine Posts for LLM Analysis

Create `combine_posts.py`:

```
#!/usr/bin/env python3
"""
Smart Blog Post Combiner
Combines all markdown files into one organized document with TOC
"""

from pathlib import Path
import yaml
import re
from datetime import datetime

def extract_frontmatter(content):
    """Extract YAML frontmatter from markdown"""
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            try:
                frontmatter = yaml.safe_load(parts[1])
                body = parts[2].strip()
                return frontmatter, body
            except:
                return {}, content
    return {}, content

def sanitize_title(title):
    """Clean title for TOC links"""
    sanitized = title.lower()
    sanitized = re.sub(r'[^\w\s-]', '', sanitized)
    sanitized = re.sub(r'[-\s]+', '-', sanitized)
    return sanitized

def combine_posts(input_dir='blog_posts', output_file='all_posts_combined.md'):
    """Combine all posts into one smart document"""

    input_path = Path(input_dir)

    # Get all markdown files except INDEX.md
    md_files = [f for f in input_path.glob('*.md') if f.name != 'INDEX.md']

    if not md_files:
        print(f"No markdown files found in {input_dir}/")
        return

    print(f"Found {len(md_files)} blog posts")
    print("Reading and organizing posts...")

    # Read all posts and extract metadata
    posts = []
    for md_file in md_files:
        content = md_file.read_text(encoding='utf-8')
        metadata, body = extract_frontmatter(content)

        posts.append({
            'filename': md_file.name,
            'metadata': metadata,
            'body': body,
            'title': metadata.get('title', md_file.stem)
        })

    # Sort posts by published date (most recent first)
    def get_date(post):
        date_str = post['metadata'].get('published_date', '')
        try:
            for fmt in ['%B %d, %Y', '%b %d, %Y', '%Y-%m-%d']:
                try:
                    return datetime.strptime(date_str, fmt)
                except:
                    continue
        except:
            pass
        return datetime.min

    posts.sort(key=get_date, reverse=True)

    print("Creating combined document...")

    # Create the combined document
    output = []

    # Header
    output.append("# Complete Blog Collection\n")
    output.append(f"**Total Posts:** {len(posts)}  ")
    output.append(f"**Generated:** {datetime.now().strftime('%B %d, %Y at %H:%M:%S')}\n")
    output.append("---\n")

    # Table of Contents
    output.append("##  Table of Contents\n")

    # Group by category
    by_category = {}
    no_category = []

    for i, post in enumerate(posts, 1):
        category = post['metadata'].get('category', '')
        if category:
            if category not in by_category:
                by_category[category] = []
            by_category[category].append((i, post))
        else:
            no_category.append((i, post))

    # Write TOC by category
    for category in sorted(by_category.keys()):
        output.append(f"\n### {category}\n")
        for idx, post in by_category[category]:
            title = post['title']
            anchor = sanitize_title(title)
            output.append(f"{idx}. [{title}](#{anchor})\n")

    if no_category:
        output.append(f"\n### Other Posts\n")
        for idx, post in no_category:
            title = post['title']
            anchor = sanitize_title(title)
            output.append(f"{idx}. [{title}](#{anchor})\n")

    output.append("\n---\n")
    output.append("\n#  Blog Posts\n")

    # Add each post with clear separators
    for i, post in enumerate(posts, 1):
        metadata = post['metadata']
        title = post['title']

        # Post separator
        output.append(f"\n\n{'='*80}\n")
        output.append(f"## Post #{i}: {title}\n")
        output.append(f"{'='*80}\n\n")

        # Metadata box
        output.append("**Metadata:**\n")
        output.append("```yaml\n")

        meta_items = []
        if metadata.get('slug'):
            meta_items.append(f"Slug: {metadata['slug']}")
        if metadata.get('author'):
            meta_items.append(f"Author: {metadata['author']}")
        if metadata.get('category'):
            meta_items.append(f"Category: {metadata['category']}")
        if metadata.get('published_date'):
            meta_items.append(f"Published: {metadata['published_date']}")
        if metadata.get('updated_date'):
            meta_items.append(f"Updated: {metadata['updated_date']}")
        if metadata.get('url'):
            meta_items.append(f"URL: {metadata['url']}")

        output.append('\n'.join(meta_items))
        output.append("\n```\n\n")

        if metadata.get('description'):
            output.append(f"**Summary:** {metadata['description']}\n\n")

        output.append("---\n\n")

        # Post content
        output.append(post['body'])
        output.append("\n\n")

    # Footer
    output.append("\n\n")
    output.append("="*80 + "\n")
    output.append(f"**End of Collection** - {len(posts)} posts total\n")
    output.append("="*80 + "\n")

    # Write to file
    output_path = Path(output_file)
    output_path.write_text(''.join(output), encoding='utf-8')

    size_mb = output_path.stat().st_size / (1024 * 1024)

    print(f"\n✓ Successfully combined {len(posts)} posts!")
    print(f"✓ Output file: {output_path.absolute()}")
    print(f"✓ File size: {size_mb:.2f} MB")

if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='Combine blog posts')
    parser.add_argument('--input', default='blog_posts',
                        help='Input directory')
    parser.add_argument('--output', default='all_posts_combined.md',
                        help='Output filename')

    args = parser.parse_args()

    combine_posts(args.input, args.output)
```

### Run the Combiner

`python3 combine_posts.py`
This creates `all_posts_combined.md` with:

*   Table of contents organized by category
*   Clear post separators
*   Metadata boxes for each post
*   Chronologically sorted (newest first)

* * *

## Advanced: Scheduling Automated Updates

[Author’s note: This particular section is untested as of now.]

Want to keep your markdown files in sync as you publish new posts? Set up a cron job or GitHub Action.

### Cron Job (Mac/Linux)

```
# Edit crontab
crontab -e

# Add line to run weekly on Sundays at 2 AM
0 2 * * 0 cd /path/to/blog_converter && python3 blog_to_markdown.py --sitemap https://yourblog.com/sitemap.xml
```

### GitHub Action

Create `.github/workflows/blog-sync.yml`:

```
name: Sync Blog Posts

on:
  schedule:
    - cron: '0 2 * * 0'  # Weekly on Sundays
  workflow_dispatch:  # Manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Run converter
        run: python blog_to_markdown.py --sitemap https://yourblog.com/sitemap.xml

      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add blog_posts/
          git commit -m "Auto-sync blog posts" || echo "No changes"
          git push
```

## Troubleshooting

### “No content found” errors

**Problem:** Content div selector is wrong

**Solution:**

1.   Inspect your blog post HTML
2.   Find the main content container
3.   Update `extract_content()` method with correct selector

### “Command not found: python”

**Problem:** Wrong Python command on Mac

**Solution:** Use `python3` instead of `python`

### “403 Forbidden” errors

**Problem:** Site blocking the scraper

**Solution:**

1.   Add custom User-Agent (already in script)
2.   Check robots.txt for scraping rules
3.   Contact your hosting provider if you own the site

### Metadata fields are empty

**Problem:** Selectors don’t match your HTML structure

**Solution:** Update all selectors in `extract_metadata()` to match your blog’s structure

## Best Practices

### 1. Test Before Full Run

Always use `--limit 3` first to verify selectors work correctly.

### 2. Respect Rate Limits

The script includes 0.5s delays between requests. Don’t remove these—be a good internet citizen.

### 3. Version Control Your Output

```
git init
git add blog_posts/
git commit -m "Initial blog export"
```

This lets you track content changes over time.

### 4. Document Your Selectors

Keep a comment at the top of your script:

```
"""
BLOG-SPECIFIC SELECTORS (Updated: 2024-11-26)
- Content: div.text-rich-text
- Title: h1.heading-style-h2
- Author: p.text-size-regular.text-color-brandnile
- Date: p.text-size-regular.text-color-grey
"""
```

### 5. Regular Audits

Run monthly to catch:

*   New posts to analyze
*   Changed HTML structure (update selectors)
*   Broken image links
*   Outdated content

## Extending the Script

### Add Reading Time Calculation

```
def calculate_reading_time(content):
    """Calculate estimated reading time"""
    words = len(content.split())
    minutes = round(words / 200)  # Average reading speed
    return f"{minutes} min read"
```

### Extract Internal Links

```
def extract_internal_links(soup, base_url):
    """Find all internal links for link graph analysis"""
    links = []
    for a in soup.find_all('a', href=True):
        href = a['href']
        if base_url in href:
            links.append({
                'text': a.get_text(strip=True),
                'url': href
            })
    return links
```

### Generate Content Calendar

```
def analyze_publishing_frequency(posts):
    """Analyze posting patterns"""
    dates = [p['metadata'].get('published_date') for p in posts]
    # Parse dates and calculate frequency
    # Suggest optimal posting schedule
```

## Conclusion

Converting your blog to markdown unlocks powerful AI-driven content analysis. What used to take days of manual auditing now takes minutes.

The key is getting clean, structured data that LLMs can parse effectively. With proper metadata extraction and YAML frontmatter, you can:

*   Identify content gaps at scale
*   Optimize SEO systematically
*   Plan content calendars data-driven
*   Maintain content quality consistently
*   Scale content operations efficiently

**Time investment:** 30 minutes setup.