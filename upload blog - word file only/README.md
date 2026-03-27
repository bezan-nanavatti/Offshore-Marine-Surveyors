# Blog Management Guide

All blog commands are run from the **project root folder** in a terminal.
To open a terminal there: right-click the project folder → "Open in Terminal" (or open VS Code and use its built-in terminal).

---

## 1. Uploading a New Blog Post

**Step 1 — Prepare your Word file**

- Write the article in Microsoft Word (.docx format only — no .doc, .pages, or Google Docs exports)
- Format your article title using Word's built-in **Heading 1** style (not just bold text).
  This lets the system detect the title automatically.
  To apply it: highlight your title → Home tab → click "Heading 1" in the Styles panel.
- Name the file descriptively, e.g. `Capt-Smith-Hull-Survey-Guide.docx`
  The filename becomes the fallback title and URL slug, so avoid generic names like "blog1.docx"
- Drop the file into this folder (`upload blog - word file only/`)

**Step 2 — Run the import**

Open a terminal in the project root and run:

```
npm run import-blog
```

This will ask you to confirm or correct the title, author name, date, category,
description, and keywords before saving — one prompt at a time.

For fully automatic import (no prompts, uses AI if configured):

```
npm run import-blog:auto
```

**Step 3 — What happens automatically**

- The Word document is converted to HTML
- All images are extracted and saved to `public/images/blogs/{slug}/`
- A new entry is added to `src/lib/blog-posts.ts`
- The original .docx is moved to the `processed/` folder here as a backup
- The blog page and individual post page are ready to build

**Step 4 — Publish**

Push the changes to GitHub. Vercel picks them up and rebuilds automatically.
Or run `npm run build` locally to test first.

---

## 2. Editing a Published Post

To change a post's title, author, date, category, description, or keywords:

```
npm run edit-blog
```

- A numbered list of all published posts is shown
- Enter the number (or slug) of the post you want to edit
- Press **Enter** to keep any field as-is, or type a new value
- Changes are saved immediately to `blog-posts.ts`

> **Note:** This edits metadata only (title, author, etc.).
> To update the article content itself, edit the original Word file and re-import it.

---

## 3. Deleting a Published Post

```
npm run delete-blog
```

- A numbered list of all published posts is shown
- Enter the number (or slug) of the post to delete
- Type **DELETE** (all caps) to confirm
- The post entry is removed from `blog-posts.ts`
- The image folder for that post is permanently deleted

After deleting, push to GitHub to take the post offline.

---

## 4. API Key — Better SEO (Recommended)

The auto-import mode can use the Claude AI to generate a better meta description
and more accurate keywords for each post. Without it, the system uses basic
keyword detection which may produce generic or off-target results.

**To enable it:**

1. Open the file `.env.local` in the project root (create it if it doesn't exist)
2. Add this line:

```
ANTHROPIC_API_KEY=your-key-here
```

3. Get your key from: https://console.anthropic.com → API Keys → Create Key

Once added, every `npm run import-blog:auto` run will automatically call the AI
to generate the description and keywords. The interactive `npm run import-blog`
mode also uses it if the key is present.

---

## 5. Quick Reference

| What you want to do          | Command                       |
|------------------------------|-------------------------------|
| Upload a new post (guided)   | `npm run import-blog`         |
| Upload a new post (auto/AI)  | `npm run import-blog:auto`    |
| Edit an existing post        | `npm run edit-blog`           |
| Delete a post                | `npm run delete-blog`         |
| Test locally before publish  | `npm run build && npm start`  |
| Publish (push to live site)  | `git push` (Vercel auto-deploys) |

---

## 6. File Naming Tips

| Good filename                          | Why                          |
|----------------------------------------|------------------------------|
| `Capt-Smith-Hull-Survey-Guide.docx`    | Author + topic, readable URL |
| `Draft-Survey-Bulk-Cargo-2026.docx`    | Topic + year                 |
| `Marine-Insurance-Claims-Delays.docx`  | Clear topic                  |

| Bad filename                           | Problem                      |
|----------------------------------------|------------------------------|
| `blog.docx`                            | Generic, bad for SEO         |
| `New Microsoft Word Document.docx`     | Will create a broken slug    |
| `Final_FINAL_v3.docx`                  | Noise words in the URL       |

---

## 7. Processed Files

After a successful import, the original .docx is moved to the `processed/` folder here.
These are kept as backups. You can delete them at any time — they are not used by the website.





-------------
Here's exactly what happened step by step, which is what you'd do in your own terminal:


npm run delete-blog
A numbered list of all 31 posts appears — you scroll down and spot #31 "armaan irani stop claim delays blog"

Prompt: Enter number or slug to delete (q to quit):
→ You type 31 and press Enter (or you could type the slug directly)

A confirmation summary appears showing the title, author, slug, and how many image files will be deleted

Prompt: Type DELETE to confirm, anything else to cancel:
→ You type DELETE (must be all caps) and press Enter

Script runs:

Removes the entry from blog-posts.ts
Deletes the /public/images/blogs/armaan-irani-stop-claim-delays-blog/ folder with all 5 images
Reminder to push to GitHub so Vercel rebuilds and the page goes offline

If you type anything other than DELETE at step 4 — no, cancel, a typo, anything — it cancels and nothing is touched.
-------------
