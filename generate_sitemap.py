import requests
from datetime import datetime

# 1. Fetch data from Hyvor
# Note: Ensure this URL works in your browser first
API_URL = "https://blogs.hyvor.com/api/data/v0/times-of-madeira/posts?filter=published_at%3E'-2%20days'"
response = requests.get(API_URL).json()
posts = response.get('data', [])

# 2. Start the XML structure
xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
xml += 'xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" '
xml += 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'

# 3. Add each post to the sitemap
for post in posts:
    # Format date for Google (ISO 8601)
    # Hyvor returns timestamps in seconds
    pub_date = datetime.fromtimestamp(post['published_at']).isoformat() + "Z"
    
    # Use full domain
    url = f"https://www.timesofmadeira.com/{post['slug']}"
    
    xml += '  <url>\n'
    xml += f'    <loc>{url}</loc>\n'
    xml += '    <news:news>\n'
    xml += '      <news:publication>\n'
    xml += '        <news:name>Times of Madeira</news:name>\n'
    xml += '        <news:language>en</news:language>\n'
    xml += '      </news:publication>\n'
    xml += f'      <news:publication_date>{pub_date}</news:publication_date>\n'
    xml += f'      <news:title>{post["title"]}</news:title>\n'
    xml += '    </news:news>\n'
    
    # Check if a featured image exists
    if post.get('featured_image_url'):
        xml += '    <image:image>\n'
        xml += f'      <image:loc>{post["featured_image_url"]}</image:loc>\n'
        xml += '    </image:image>\n'
        
    xml += '  </url>\n'

xml += '</urlset>'

# 4. Save to file
with open("news-sitemap.xml", "w") as f:
    f.write(xml)

print(f"Sitemap generated successfully with {len(posts)} posts.")
