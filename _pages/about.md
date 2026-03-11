---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<span class='anchor' id='about-me'></span>

Hello! I am Shumao Wang (Wang Shumao), based in Chengdu, China. I am a senior undergraduate student in Computer Science at Xi'an University of Architecture and Technology. This site introduces my background, interests, and updates.

# News
- Coming soon.

# Update
Recent articles and refreshed notes are listed here for quick access.

{% if site.data.updates and site.data.updates.size > 0 %}
<div class="topic-cards">
  {% for item in site.data.updates limit: 3 %}
  <article class="topic-card update-card">
    {% if item.image %}
    <div class="topic-card__media update-card__media">
      <img src="{{ item.image | relative_url }}" alt="{{ item.title }}">
    </div>
    {% endif %}
    <div class="topic-card__body">
      {% if item.date %}
      <p class="topic-card__meta">{{ item.date }}</p>
      {% endif %}
      <h3 class="topic-card__title">
        <a href="{{ item.url | relative_url }}" target="_self">{{ item.title }}</a>
      </h3>
      {% if item.summary %}
      <p class="topic-card__meta">{{ item.summary }}</p>
      {% endif %}
    </div>
  </article>
  {% endfor %}
</div>
{% else %}
- Coming soon.
{% endif %}

# Publications
- Coming soon.

# Education
- B.S. in Computer Science, Xi'an University of Architecture and Technology (in progress)

# Internships
- Coming soon.

# Deep Dive into Machine Learning
- A dedicated page with organized notes and takeaways: [Deep Dive into Machine Learning](/deep-dive/)

# Algorithms
- A dedicated page with organized notes and takeaways: [Algorithms](/algorithms/)

# Contact
- Email: <a href="mailto:mseeicoding@gmail.com">mseeicoding@gmail.com</a>
