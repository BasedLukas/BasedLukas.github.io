
# Clean Blog Hexo

![](http://www.codeblocq.com/img/hexo-theme-thumbnail/CleanBlog.png)

Hexo implementation of [Clean Blog](http://blackrockdigital.github.io/startbootstrap-clean-blog/index.html)

Clean blog is a full featured, responsive Hexo theme. [Demo here](http://www.codeblocq.com/assets/projects/hexo-theme-clean-blog/).

## Features

- Disqus and Facebook comments
- Google Analytics
- Addthis
- Cover image for posts and pages
- Tags and Categories Support
- Responsive Images
- Image Gallery
- Code syntax highlighting

## External libraries used

- [Bootstrap](http://getbootstrap.com/css/)
- [FeatherLight.js](http://noelboss.github.io/featherlight/) (Gallery)
- [jQuery](https://jquery.com/)

## Installation

```
$ git clone https://github.com/klugjo/hexo-theme-clean-blog.git themes/clean-blog
```

Then update your blog's main `_config.yml` to set the theme to `clean-blog`:

```
# Extensions
## Plugins: http://hexo.io/plugins/
## Themes: http://hexo.io/themes/
theme: clean-blog
```

## Configuration

### Menu

The menu is configured in the theme's `_config.yml`.

```
# Header
menu:
  Home: /
  Archives: /archives
  Github:
    url: https://github.com/klugjo/hexo-theme-clean-blog
    icon: github
```

The object key is the label and the value is the path, or you can use a icon (font awesome) like menu item.

### Top Left Label

The top left label is configured in the theme's `_config.yml`. When clicked it will lead to the Home Page.

```
# Title on top left of menu. Leave empty to use main blog title
menu_title: Configurable Title
```

### Home Page cover image

The Home Page cover is configured in the theme's `_config.yml`. It will be the same for all index type pages.

```
# URL of the Home page image
index_cover: /img/home-bg.jpg
```

### Default post title

The default post title (used when no title is specified) is configured in the theme's `_config.yml`.

```
# Default post title
default_post_title: Untitled
```



### Social Account

Setup the links to your social pages in the theme's `_config.yml`. Links are in the footer.

```
# Social Accounts
twitter_url:
facebook_url:
github_url: https://github.com/klugjo/hexo-theme-clean-blog
linkedin_url:
mailto:
```

### Author

The post's author is specified in the posts front-matter:

```
author: Klug Jo
---
```

### Post's Cover Image

By default, posts will use the home page cover image. You can specify a custom cover in the front-matter:

```
title: Excerpts
date: 2013-12-25 00:23:23
tags: ["Excertps"]
cover: /assets/contact-bg.jpg
---
```

### Post's Share Cover Image

You can specify a custom cover to share yours posts in social medias:

```
share_cover: /assets/contact-bg.jpg
---
```

### Post's Excerpt

This theme does not support traditional excerpts. To show excerpts on the index page, use `subtitle` in the front-matter:

```
title: Excerpts
date: 2013-12-25 00:23:23
tags: ["Excertps"]
subtitle: Standard Excerpts are not supported in Clean Blog but you can use subtitles in the front matter to display text in the index.
---

```

## Tags page.

> Follow these steps to add a `tags` page that contains all the tags in your site.

- Create a page named `tags`

```
$ hexo new page "tags"
```

- Edit the newly created page and set page type to `tags` in the front matter.

```
title: All tags
type: "tags"
```

- Add `tags` to the menu in the theme `_config.yml`:

```
# Header
menu:
  Home: /
  Archives: /archives
  Tags: /tags
```

## Categories page.

> Follow these steps to add a `categories` page that contains all the categories in your site.

- Create a page named `categories`

```
$ hexo new page "categories"
```

- Edit the newly created page and set page type to `categories` in the front matter.

```
title: All categories
type: "categories"
```

- Add `Categories` to the menu in the theme `_config.yml`:

```
# Header
menu:
  Home: /
  Archives: /archives
  Categories: /categories
```


## Creator

This theme was created by [Blackrock Digital](https://github.com/BlackrockDigital) and adapted for Hexo by [Jonathan Klughertz](http://www.codeblocq.com/).

## License

MIT
