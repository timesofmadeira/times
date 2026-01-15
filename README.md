To fix the 404 error and professionalize your repository, create a file named README.md in the root of your GitHub project.

This will serve as the "landing page" for your GitHub Pages and tell Google (and you) exactly what this automation does.

Copy and paste this content into your new README.md:
Markdown

# 🚀 Times of Madeira News Sitemap Bot

This repository automatically generates a **Google News-compliant XML Sitemap** for [Times of Madeira](https://www.timesofmadeira.com). 

Since Hyvor Blogs does not natively support Google News `<news:news>` tags or image-specific sitemap tags, this bot bridge the gap.

## 🛠 How it Works
1. **Fetch:** A Python script (`generate_sitemap.py`) calls the Hyvor Data API.
2. **Filter:** It identifies all articles published within the last **48 hours** (as required by Google News).
3. **Generate:** It builds a `news-sitemap.xml` file including high-res featured images.
4. **Automate:** GitHub Actions runs this process every hour to keep the data fresh.

## 📍 Sitemap Location
The live sitemap is hosted via GitHub Pages at:
👉 **https://timesofmadeira.github.io/times/news-sitemap.xml**

## 🚦 Status
- **Last Run:** Automated via GitHub Actions
- **Output:** Validated for Google Search Console News schema

---
*Maintained by Times of Madeira Editorial Team.*
