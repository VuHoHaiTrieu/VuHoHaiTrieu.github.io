---
layout: default
title: "Trang chủ"
---

# Hi.Chào mừng đến blog của VuHoHaiTrieu 👋

Đây là blog của mình — viết bằng Markdown. Dưới đây là danh sách bài viết:

<ul>
{% for post in site.posts %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    — {{ post.date | date: "%Y-%m-%d" }}
  </li>
{% endfor %}
</ul>
