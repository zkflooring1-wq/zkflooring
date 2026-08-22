# Asset Usage Diagnostic Report V2

### Why are supposedly unused images still appearing?
The previous audit script contained a logical flaw: it used a naive string inclusion check (`content.includes("1.webp")`).
This meant that if a file was named `1.webp`, it was marked as "used" because it matched inside strings like `social-img01.webp` or `banner-1.webp`.
Because of this substring matching bug, dozens of generic-named files were incorrectly kept.

### Diagnostic Breakdown
- **Total Images Currently in Public**: 237
- **Genuinely Used / Default Assets**: 187
- **False Positives (Kept by mistake previously)**: 50
- **Completely Unreferenced (Should have been deleted)**: 0

### 1. Genuine False Positives (Safe to Delete)
These files were kept only because their names were substrings of other files (e.g. `1.webp` matching inside `img01.webp`).

- `assets/images/about/shape01.png`
- `assets/images/brands/01.png`
- `assets/images/brands/01.webp`
- `assets/images/brands/02.webp`
- `assets/images/brands/03.webp`
- `assets/images/brands/04.webp`
- `assets/images/choose/shape01.png`
- `assets/images/displacement/01.webp`
- `assets/images/displacement/02.webp`
- `assets/images/displacement/03.webp`
- `assets/images/displacement/04.webp`
- `assets/images/faq/shape01.png`
- `assets/images/feature/shape01.png`
- `assets/images/gallery/img01.webp`
- `assets/images/gallery/img02.webp`
- `assets/images/gallery/img03.webp`
- `assets/images/hero/3.webp`
- `assets/images/logo/logo.png`
- `assets/images/marquee/icon01.webp`
- `assets/images/marquee/icon02.webp`
- `assets/images/newsletter/img01.webp`
- `assets/images/project/n-icon.webp`
- `Inotek HTML/documentation/assets/img/features/1.png`
- `Inotek HTML/documentation/assets/img/features/2.png`
- `Inotek HTML/documentation/assets/img/logo/logo.png`
- `Inotek HTML/documentation/assets/img/server/1.png`
- `Inotek HTML/documentation/assets/img/server/2.png`
- `Inotek HTML/documentation/assets/img/sidebar/4.jpg`
- `Inotek HTML/inotek/assets/images/about/shape01.png`
- `Inotek HTML/inotek/assets/images/brands/01.png`
- `Inotek HTML/inotek/assets/images/brands/01.webp`
- `Inotek HTML/inotek/assets/images/brands/02.webp`
- `Inotek HTML/inotek/assets/images/brands/03.webp`
- `Inotek HTML/inotek/assets/images/brands/04.webp`
- `Inotek HTML/inotek/assets/images/choose/shape01.png`
- `Inotek HTML/inotek/assets/images/displacement/01.webp`
- `Inotek HTML/inotek/assets/images/displacement/02.webp`
- `Inotek HTML/inotek/assets/images/displacement/03.webp`
- `Inotek HTML/inotek/assets/images/displacement/04.webp`
- `Inotek HTML/inotek/assets/images/faq/shape01.png`
- `Inotek HTML/inotek/assets/images/feature/shape01.png`
- `Inotek HTML/inotek/assets/images/gallery/img01.webp`
- `Inotek HTML/inotek/assets/images/gallery/img02.webp`
- `Inotek HTML/inotek/assets/images/gallery/img03.webp`
- `Inotek HTML/inotek/assets/images/hero/3.webp`
- `Inotek HTML/inotek/assets/images/logo/logo.png`
- `Inotek HTML/inotek/assets/images/marquee/icon01.webp`
- `Inotek HTML/inotek/assets/images/marquee/icon02.webp`
- `Inotek HTML/inotek/assets/images/newsletter/img01.webp`
- `Inotek HTML/inotek/assets/images/project/n-icon.webp`

### 2. Genuinely Unused Files (Safe to Delete)
These files have absolutely ZERO references in the code.


### 3. Genuinely Used Assets (Must Keep)
These files are definitively referenced in the code with exact path or boundary matches.

#### `about page/1.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\components\ServicesSection.tsx`
  - `src\data\projectsData.ts`
#### `about page/2.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\components\ServicesSection.tsx`
  - `src\data\projectsData.ts`
#### `apple-icon.png`
- **Status**: Next.js System Default
- **Referenced In**:
  - `src\app\layout.tsx`
#### `assets/images/about/hm1-img01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `assets/images/about/hm1-img03.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `assets/images/blog/blog01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `assets/images/blog/blog02.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `assets/images/blog/blog03.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `assets/images/blog/carpet-underlay.jpg`
- **Referenced In**:
  - `src\data\blogPosts.ts`
#### `assets/images/blog/hardwood-engineered.jpg`
- **Referenced In**:
  - `src\data\blogPosts.ts`
#### `assets/images/blog/lvt-vs-laminate.jpg`
- **Referenced In**:
  - `src\data\blogPosts.ts`
#### `assets/images/callus/hm1-bg01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
  - `src\components\Newsletter.tsx`
#### `assets/images/choose/hm1-icon01.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `assets/images/choose/hm1-icon02.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `assets/images/choose/hm1-shape01.png`
- **Referenced In**:
  - `src\app\page.tsx`
#### `assets/images/choose/hm1-shape01.webp`
- **Referenced In**:
  - `src\components\HeroSlider.tsx`
#### `assets/images/choose/star.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\blog\page.tsx`
  - `src\app\blog\[slug]\page.tsx`
  - `src\app\faq\page.tsx`
  - `src\app\projects\page.tsx`
  - `src\app\services\page.tsx`
  - `src\app\services\[slug]\page.tsx`
#### `assets/images/contact/hm1-icon01.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `assets/images/contact/hm1-img01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `assets/images/contact/hm1-shape01.webp`
- **Referenced In**:
  - `src\components\HeroSlider.tsx`
#### `assets/images/counter/hm1-bg01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
  - `src\components\Newsletter.tsx`
#### `assets/images/counter/hm1-icon01.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `assets/images/counter/hm1-icon02.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `assets/images/error/404.webp`
- **Referenced In**:
  - `src\app\not-found.tsx`
#### `assets/images/faq/circle-shape.webp`
- **Referenced In**:
  - `src\app\faq\page.tsx`
#### `assets/images/faq/question-shape.webp`
- **Referenced In**:
  - `src\app\faq\page.tsx`
#### `assets/images/favicons/favicon.png`
- **Status**: Next.js System Default
#### `assets/images/feature/check.webp`
- **Referenced In**:
  - `src\components\HeroSlider.tsx`
#### `assets/images/feature/hm1-icon01.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `assets/images/feature/hm1-icon02.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `assets/images/feature/scribble.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `assets/images/footer/gallery-1.webp`
- **Referenced In**:
  - `src\components\layout\Footer.tsx`
#### `assets/images/footer/gallery-2.webp`
- **Referenced In**:
  - `src\components\layout\Footer.tsx`
#### `assets/images/footer/hm1-bg01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
  - `src\components\Newsletter.tsx`
#### `assets/images/hero/1.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\components\ServicesSection.tsx`
  - `src\data\projectsData.ts`
#### `assets/images/hero/2.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\components\ServicesSection.tsx`
  - `src\data\projectsData.ts`
#### `assets/images/hero/arrow-shape.webp`
- **Referenced In**:
  - `src\components\Newsletter.tsx`
#### `assets/images/hero/check.webp`
- **Referenced In**:
  - `src\components\HeroSlider.tsx`
#### `assets/images/hero/hm1-bg01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
  - `src\components\Newsletter.tsx`
#### `assets/images/hero/hm1-shape01.webp`
- **Referenced In**:
  - `src\components\HeroSlider.tsx`
#### `assets/images/hero/scribble.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `assets/images/hero/spin-icon.webp`
- **Referenced In**:
  - `src\components\HeroSlider.tsx`
#### `assets/images/icons/check-circle2.png`
- **Referenced In**:
  - `src\components\Newsletter.tsx`
#### `assets/images/icons/contact.png`
- **Referenced In**:
  - `src\app\services\[slug]\page.tsx`
#### `assets/images/icons/marquee-icon.png`
- **Referenced In**:
  - `src\app\page.tsx`
#### `assets/images/icons/scribble-2.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
#### `assets/images/icons/sidebar-toggle.webp`
- **Referenced In**:
  - `src\components\layout\Header.tsx`
#### `assets/images/icons/star.png`
- **Referenced In**:
  - `src\components\HeroSlider.tsx`
#### `assets/images/newsletter/arrow-shape.webp`
- **Referenced In**:
  - `src\components\Newsletter.tsx`
#### `assets/images/newsletter/hm1-bg01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
  - `src\components\Newsletter.tsx`
#### `assets/images/pricing/eart.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `assets/images/pricing/spin-shape.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `assets/images/pricing/spin-shape02.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `assets/images/process/hm1-shape01.png`
- **Referenced In**:
  - `src\app\page.tsx`
#### `assets/images/process/hm1-shape01.webp`
- **Referenced In**:
  - `src\components\HeroSlider.tsx`
#### `assets/images/project/details-bg.webp`
- **Referenced In**:
  - `src\app\services\[slug]\page.tsx`
#### `assets/images/project/hm1-img01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `assets/images/project/hm1-img03.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `assets/images/service/check.webp`
- **Referenced In**:
  - `src\components\HeroSlider.tsx`
#### `assets/images/service/details-bg.webp`
- **Referenced In**:
  - `src\app\services\[slug]\page.tsx`
#### `assets/images/service/hm1-icon01.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `assets/images/service/hm1-icon02.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `assets/images/service/hm1-img01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `assets/images/service/hm1-img03.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `assets/images/shapes/circle.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\blog\page.tsx`
  - `src\app\blog\[slug]\page.tsx`
  - `src\app\faq\page.tsx`
  - `src\app\projects\page.tsx`
  - `src\app\services\page.tsx`
  - `src\app\services\[slug]\page.tsx`
#### `assets/images/shapes/doot.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\blog\page.tsx`
  - `src\app\blog\[slug]\page.tsx`
  - `src\app\faq\page.tsx`
  - `src\app\projects\page.tsx`
  - `src\app\services\page.tsx`
  - `src\app\services\[slug]\page.tsx`
#### `assets/images/shapes/snake.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\blog\page.tsx`
  - `src\app\blog\[slug]\page.tsx`
  - `src\app\faq\page.tsx`
  - `src\app\projects\page.tsx`
  - `src\app\services\page.tsx`
  - `src\app\services\[slug]\page.tsx`
#### `assets/images/shapes/star.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\blog\page.tsx`
  - `src\app\blog\[slug]\page.tsx`
  - `src\app\faq\page.tsx`
  - `src\app\projects\page.tsx`
  - `src\app\services\page.tsx`
  - `src\app\services\[slug]\page.tsx`
#### `assets/images/sidebar/sidebar-2.jpg`
- **Referenced In**:
  - `src\components\layout\Sidebar.tsx`
#### `assets/images/sidebar/sidebar-3.jpg`
- **Referenced In**:
  - `src\components\layout\Sidebar.tsx`
#### `assets/images/sidebar/sidebar-4.jpg`
- **Referenced In**:
  - `src\components\layout\Sidebar.tsx`
#### `assets/images/sidebar/sidebar-5.jpg`
- **Referenced In**:
  - `src\components\layout\Sidebar.tsx`
#### `assets/images/sidebar/sidebar-6.jpg`
- **Referenced In**:
  - `src\components\layout\Sidebar.tsx`
#### `assets/images/sidebar/sidebar1.jpeg`
- **Referenced In**:
  - `src\components\layout\Sidebar.tsx`
#### `assets/images/social/social-img01.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `assets/images/social/social-img02.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `assets/images/social/social-img03.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `assets/images/team/hm1-bg01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
  - `src\components\Newsletter.tsx`
#### `assets/images/team/hm1-img01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `assets/images/team/hm1-img03.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `assets/images/team/hm2-scribble.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
#### `assets/images/testimonial/hm1-bg01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
  - `src\components\Newsletter.tsx`
#### `assets/images/testimonial/scribble01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `favicon.ico`
- **Status**: Next.js System Default
- **Referenced In**:
  - `src\app\layout.tsx`
#### `favicon.png`
- **Status**: Next.js System Default
#### `file.svg`
- **Status**: Next.js System Default
#### `globe.svg`
- **Status**: Next.js System Default
#### `icon.png`
- **Status**: Next.js System Default
- **Referenced In**:
  - `src\app\layout.tsx`
#### `Inotek HTML/documentation/assets/img/demo-img/1.jpg`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `Inotek HTML/documentation/assets/img/demo-img/2.jpg`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `Inotek HTML/documentation/assets/img/favicon/favicon.png`
- **Status**: Next.js System Default
#### `Inotek HTML/documentation/assets/img/sidebar/1.jpg`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `Inotek HTML/documentation/assets/img/sidebar/2.jpg`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `Inotek HTML/documentation/assets/img/sidebar/3.jpg`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `Inotek HTML/documentation/assets/img/thanks/star.png`
- **Referenced In**:
  - `src\components\HeroSlider.tsx`
#### `Inotek HTML/inotek/assets/images/about/hm1-img01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/about/hm1-img03.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/blog/blog01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/blog/blog02.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/blog/blog03.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/callus/hm1-bg01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
  - `src\components\Newsletter.tsx`
#### `Inotek HTML/inotek/assets/images/choose/hm1-icon01.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/choose/hm1-icon02.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/choose/hm1-shape01.png`
- **Referenced In**:
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/choose/hm1-shape01.webp`
- **Referenced In**:
  - `src\components\HeroSlider.tsx`
#### `Inotek HTML/inotek/assets/images/choose/star.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\blog\page.tsx`
  - `src\app\blog\[slug]\page.tsx`
  - `src\app\faq\page.tsx`
  - `src\app\projects\page.tsx`
  - `src\app\services\page.tsx`
  - `src\app\services\[slug]\page.tsx`
#### `Inotek HTML/inotek/assets/images/contact/hm1-icon01.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/contact/hm1-img01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/contact/hm1-shape01.webp`
- **Referenced In**:
  - `src\components\HeroSlider.tsx`
#### `Inotek HTML/inotek/assets/images/counter/hm1-bg01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
  - `src\components\Newsletter.tsx`
#### `Inotek HTML/inotek/assets/images/counter/hm1-icon01.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/counter/hm1-icon02.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/error/404.webp`
- **Referenced In**:
  - `src\app\not-found.tsx`
#### `Inotek HTML/inotek/assets/images/faq/circle-shape.webp`
- **Referenced In**:
  - `src\app\faq\page.tsx`
#### `Inotek HTML/inotek/assets/images/faq/question-shape.webp`
- **Referenced In**:
  - `src\app\faq\page.tsx`
#### `Inotek HTML/inotek/assets/images/favicons/favicon.png`
- **Status**: Next.js System Default
#### `Inotek HTML/inotek/assets/images/feature/check.webp`
- **Referenced In**:
  - `src\components\HeroSlider.tsx`
#### `Inotek HTML/inotek/assets/images/feature/hm1-icon01.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/feature/hm1-icon02.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/feature/scribble.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/footer/gallery-1.webp`
- **Referenced In**:
  - `src\components\layout\Footer.tsx`
#### `Inotek HTML/inotek/assets/images/footer/gallery-2.webp`
- **Referenced In**:
  - `src\components\layout\Footer.tsx`
#### `Inotek HTML/inotek/assets/images/footer/hm1-bg01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
  - `src\components\Newsletter.tsx`
#### `Inotek HTML/inotek/assets/images/hero/1.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\components\ServicesSection.tsx`
  - `src\data\projectsData.ts`
#### `Inotek HTML/inotek/assets/images/hero/2.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\components\ServicesSection.tsx`
  - `src\data\projectsData.ts`
#### `Inotek HTML/inotek/assets/images/hero/arrow-shape.webp`
- **Referenced In**:
  - `src\components\Newsletter.tsx`
#### `Inotek HTML/inotek/assets/images/hero/check.webp`
- **Referenced In**:
  - `src\components\HeroSlider.tsx`
#### `Inotek HTML/inotek/assets/images/hero/hm1-bg01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
  - `src\components\Newsletter.tsx`
#### `Inotek HTML/inotek/assets/images/hero/hm1-shape01.webp`
- **Referenced In**:
  - `src\components\HeroSlider.tsx`
#### `Inotek HTML/inotek/assets/images/hero/scribble.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/hero/spin-icon.webp`
- **Referenced In**:
  - `src\components\HeroSlider.tsx`
#### `Inotek HTML/inotek/assets/images/icons/check-circle2.png`
- **Referenced In**:
  - `src\components\Newsletter.tsx`
#### `Inotek HTML/inotek/assets/images/icons/contact.png`
- **Referenced In**:
  - `src\app\services\[slug]\page.tsx`
#### `Inotek HTML/inotek/assets/images/icons/marquee-icon.png`
- **Referenced In**:
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/icons/scribble-2.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
#### `Inotek HTML/inotek/assets/images/icons/sidebar-toggle.webp`
- **Referenced In**:
  - `src\components\layout\Header.tsx`
#### `Inotek HTML/inotek/assets/images/icons/star.png`
- **Referenced In**:
  - `src\components\HeroSlider.tsx`
#### `Inotek HTML/inotek/assets/images/newsletter/arrow-shape.webp`
- **Referenced In**:
  - `src\components\Newsletter.tsx`
#### `Inotek HTML/inotek/assets/images/newsletter/hm1-bg01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
  - `src\components\Newsletter.tsx`
#### `Inotek HTML/inotek/assets/images/pricing/eart.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/pricing/spin-shape.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/pricing/spin-shape02.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/process/hm1-shape01.png`
- **Referenced In**:
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/process/hm1-shape01.webp`
- **Referenced In**:
  - `src\components\HeroSlider.tsx`
#### `Inotek HTML/inotek/assets/images/project/details-bg.webp`
- **Referenced In**:
  - `src\app\services\[slug]\page.tsx`
#### `Inotek HTML/inotek/assets/images/project/hm1-img01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/project/hm1-img03.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/service/check.webp`
- **Referenced In**:
  - `src\components\HeroSlider.tsx`
#### `Inotek HTML/inotek/assets/images/service/details-bg.webp`
- **Referenced In**:
  - `src\app\services\[slug]\page.tsx`
#### `Inotek HTML/inotek/assets/images/service/hm1-icon01.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/service/hm1-icon02.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/service/hm1-img01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/service/hm1-img03.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/shapes/circle.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\blog\page.tsx`
  - `src\app\blog\[slug]\page.tsx`
  - `src\app\faq\page.tsx`
  - `src\app\projects\page.tsx`
  - `src\app\services\page.tsx`
  - `src\app\services\[slug]\page.tsx`
#### `Inotek HTML/inotek/assets/images/shapes/doot.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\blog\page.tsx`
  - `src\app\blog\[slug]\page.tsx`
  - `src\app\faq\page.tsx`
  - `src\app\projects\page.tsx`
  - `src\app\services\page.tsx`
  - `src\app\services\[slug]\page.tsx`
#### `Inotek HTML/inotek/assets/images/shapes/snake.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\blog\page.tsx`
  - `src\app\blog\[slug]\page.tsx`
  - `src\app\faq\page.tsx`
  - `src\app\projects\page.tsx`
  - `src\app\services\page.tsx`
  - `src\app\services\[slug]\page.tsx`
#### `Inotek HTML/inotek/assets/images/shapes/star.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\blog\page.tsx`
  - `src\app\blog\[slug]\page.tsx`
  - `src\app\faq\page.tsx`
  - `src\app\projects\page.tsx`
  - `src\app\services\page.tsx`
  - `src\app\services\[slug]\page.tsx`
#### `Inotek HTML/inotek/assets/images/sidebar/sidebar-2.jpg`
- **Referenced In**:
  - `src\components\layout\Sidebar.tsx`
#### `Inotek HTML/inotek/assets/images/sidebar/sidebar-3.jpg`
- **Referenced In**:
  - `src\components\layout\Sidebar.tsx`
#### `Inotek HTML/inotek/assets/images/sidebar/sidebar-4.jpg`
- **Referenced In**:
  - `src\components\layout\Sidebar.tsx`
#### `Inotek HTML/inotek/assets/images/sidebar/sidebar-5.jpg`
- **Referenced In**:
  - `src\components\layout\Sidebar.tsx`
#### `Inotek HTML/inotek/assets/images/sidebar/sidebar-6.jpg`
- **Referenced In**:
  - `src\components\layout\Sidebar.tsx`
#### `Inotek HTML/inotek/assets/images/sidebar/sidebar1.jpeg`
- **Referenced In**:
  - `src\components\layout\Sidebar.tsx`
#### `Inotek HTML/inotek/assets/images/social/social-img01.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/social/social-img02.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/social/social-img03.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/team/hm1-bg01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
  - `src\components\Newsletter.tsx`
#### `Inotek HTML/inotek/assets/images/team/hm1-img01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/team/hm1-img03.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `Inotek HTML/inotek/assets/images/team/hm2-scribble.webp`
- **Referenced In**:
  - `src\app\about\page.tsx`
#### `Inotek HTML/inotek/assets/images/testimonial/hm1-bg01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
  - `src\components\Newsletter.tsx`
#### `Inotek HTML/inotek/assets/images/testimonial/scribble01.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `next.svg`
- **Status**: Next.js System Default
#### `Our Team/1.jpg`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `Our Team/2.jpg`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `Our Team/3.jpg`
- **Referenced In**:
  - `src\app\about\page.tsx`
  - `src\app\page.tsx`
#### `services/Carpet, Carpet Tile.webp`
- **Referenced In**:
  - `src\app\page.tsx`
  - `src\data\projectsData.ts`
#### `services/Self Levelling.webp`
- **Referenced In**:
  - `src\app\page.tsx`
  - `src\data\projectsData.ts`
#### `services/Vinyl, Vinyl Tile.webp`
- **Referenced In**:
  - `src\app\page.tsx`
  - `src\components\ServicesSection.tsx`
#### `slider/Carpet Tile.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `slider/Carpet.webp`
- **Referenced In**:
  - `src\app\blog\page.tsx`
  - `src\app\blog\[slug]\page.tsx`
#### `slider/Laminate Flooring.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `slider/Vinyl flooring.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `slider/Vinyl Tile.webp`
- **Referenced In**:
  - `src\app\page.tsx`
#### `vercel.svg`
- **Status**: Next.js System Default
#### `window.svg`
- **Status**: Next.js System Default
#### `zk-logo.png`
- **Referenced In**:
  - `src\app\blog\[slug]\page.tsx`
  - `src\components\layout\Header.tsx`
  - `src\components\layout\Sidebar.tsx`
