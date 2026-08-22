TITLE: Build Complete Standalone ZK Flooring Admin Panel — A–Z Production System

You are building a completely SEPARATE standalone Admin Panel project for the existing ZK Flooring website.

IMPORTANT ARCHITECTURE:

* This is a NEW, SEPARATE admin project/repository.
* Do NOT modify, copy, refactor, import, or depend on the existing frontend project.
* The public frontend remains completely untouched.
* The Admin Panel will connect independently to the same Supabase project/database and Cloudflare R2 storage used by the website.
* Build the Admin Panel as a production-ready CMS/control system that can later power the existing frontend through the shared database.
* Do not recreate the public website inside the admin panel.
* Do not build fake/demo-only CRUD. Implement real Supabase CRUD and real Cloudflare R2 image uploads.

==================================================

1. TECHNOLOGY
   ==================================================

Use:

* Next.js
* React
* TypeScript
* Tailwind CSS
* Supabase
* Cloudflare R2
* Modern server-side architecture
* Responsive desktop/tablet/mobile UI

The existing frontend uses:

* Next.js 16.2.7
* React 19.2.4
* TypeScript 5.x
* Bootstrap 5
* FontAwesome 6 Pro
* Swiper.js
* GSAP
* Lenis
* WOW.js / Odometers

The Admin Panel does NOT need to reproduce those frontend libraries. Its job is to provide a clean professional CMS.

==================================================
2. ADMIN DESIGN DIRECTION
=========================

Create a premium professional admin interface suitable for a high-end UK flooring company.

Visual direction:

* Luxury but restrained
* White / off-white surfaces
* Obsidian dark text and panels
* Metallic gold accents
* Subtle gold gradients
* Clean modern cards
* Soft shadows
* 20px card radius
* 10–30px button radius
* Excellent spacing
* High-quality typography
* No childish colors
* No excessive glassmorphism
* No unnecessary animations

Brand palette:

* Gold gradient:
  linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #B38728 100%)
* Gold:
  #D4AF37
  #AA771C
  #B38728
* Obsidian:
  #16120B
  #111111
  #1A1A1A
* White:
  #FFFFFF
* Light background:
  #F8F9FA

Use the ZK Flooring brand identity consistently.

==================================================
3. AUTHENTICATION
=================

Create a secure dedicated Admin Login system.

Route:

* /login

Requirements:

* Email/password authentication through Supabase Auth
* Secure session handling
* Protected admin routes
* Automatic redirect to login when unauthenticated
* Logout
* Session persistence
* Loading states
* Invalid credential handling
* Unauthorized state
* Do not expose private Supabase keys in client-side code
* Never expose R2 secret/access credentials in browser code
* Use server-side operations where privileged credentials are required

==================================================
4. ADMIN ROUTE STRUCTURE
========================

Create:

/login

/dashboard
/projects
/projects/new
/projects/[id]

/services
/services/new
/services/[id]

/blogs
/blogs/new
/blogs/[id]

/faqs
/faqs/new
/faqs/[id]

/pages
/pages/home
/pages/about

/settings
/settings/contact
/settings/social
/settings/footer
/settings/seo

/media

/profile

The dashboard must act as the main control center.

==================================================
5. GLOBAL ADMIN LAYOUT
======================

Create a reusable AdminLayout containing:

LEFT SIDEBAR:

* ZK Flooring branding
* Dashboard
* Projects
* Services
* Blog Posts
* FAQs
* Pages
* Media
* Settings
* Profile
* Logout

TOP HEADER:

* Current page title
* Breadcrumb
* Search where useful
* View Website button
* User/profile menu
* Notification/status area where useful

MAIN CONTENT:

* Responsive workspace
* Consistent page header
* Primary action button
* Search/filter controls
* Tables/cards
* Pagination where needed

MOBILE:

* Collapsible sidebar/drawer
* Touch-friendly controls
* Responsive tables
* Responsive editor forms

==================================================
6. DASHBOARD
============

Create /dashboard.

Show:

STAT CARDS:

* Total Projects
* Total Services
* Published Blog Posts
* Draft Blog Posts
* Total FAQs
* Total Media
* Other useful live CMS statistics

QUICK ACTIONS:

* Add Project
* Add Service
* Add Blog Post
* Add FAQ
* Manage Home Page
* Upload Media

RECENT ACTIVITY:

* Recently added projects
* Recently edited services
* Recently published blogs
* Recently updated FAQs

RECENT CONTENT:
Show useful latest records with:

* title
* type
* status
* date
* quick edit action

All dashboard values must come from real Supabase data.

==================================================
7. PROJECTS MANAGEMENT
======================

Route:

* /projects

Create a professional project management table/grid.

Fields exactly based on the current frontend:

* title
* slug
* category
* location
* image
* shortDesc
* description
* highlights
* client
* duration
* area

Reference categories/examples:

* Luxury Vinyl Tile
* Carpet Fitting
* Hardwood
* Carpet & Carpet Tile
* Subfloor Preparation
* Commercial Flooring

Existing project examples:

* luxury-herringbone-lvt-solihull
* commercial-carpet-tiles-birmingham-city-centre
* subfloor-latex-screed-edgbaston
* engineered-oak-hardwood-sutton-coldfield
* commercial-safety-vinyl-harborne
* luxury-deep-pile-carpet-moseley

PROJECT LIST FEATURES:

* Search
* Category filter
* Location filter
* Sort
* Pagination
* Edit
* Delete
* Duplicate
* Preview
* Create new project

PROJECT EDITOR:

* Title field
* Auto/manual slug
* Category
* Location
* Cover image upload
* Short description
* Multi-paragraph description editor
* Highlights repeater
* Client
* Duration
* Area
* Save draft
* Publish/save
* Delete
* Preview

Validation:

* title required
* slug required and unique
* image required where appropriate
* prevent duplicate slug
* clean error states

==================================================
8. SERVICES MANAGEMENT
======================

Route:

* /services

Fields:

* title
* slug
* category
* image
* summary / shortDesc
* badges / features
* infoLabel
* infoValue
* description
* ctaText
* ctaLink

Existing six services:

1. Carpet & Carpet Tile Fitting
   slug: carpet-fitting

2. Luxury Vinyl Tile (LVT) & Sheet Vinyl
   slug: luxury-vinyl-tile

3. Self Levelling & Subfloor Prep
   slug: subfloor-preparation

4. Solid & Engineered Hardwood
   slug: hardwood-flooring

5. Laminate Flooring Installation
   slug: laminate-flooring

6. Commercial Safety Flooring & Vinyl
   slug: commercial-flooring

SERVICE MANAGER:

* Search
* Category filter
* Edit
* Delete
* Preview
* Create new service

SERVICE EDITOR:

* Title
* Slug
* Category
* Cover image
* Summary
* Feature/badge repeater
* Info label
* Info value
* Multi-paragraph description
* CTA text
* CTA link
* Save
* Preview
* Delete

==================================================
9. BLOG MANAGEMENT
==================

Routes:

* /blogs
* /blogs/new
* /blogs/[id]

Fields:

* title
* slug
* content
* status
* featured_image
* categories
* seoTitle
* seoDescription
* excerpt
* author

Status:

* draft
* published

BLOG MANAGER:

* Search
* Draft/Published filter
* Category filter
* Date sorting
* Edit
* Delete
* Preview
* Publish/unpublish

BLOG EDITOR:

* Title
* Slug
* Featured image
* Author
* Categories/tags
* Excerpt
* SEO title
* SEO description
* Full article editor
* Draft/published state
* Save
* Publish
* Preview

The article editor must be comfortable for long-form technical flooring content.

==================================================
10. FAQ MANAGEMENT
==================

Routes:

* /faqs
* /faqs/new
* /faqs/[id]

Fields:

* question
* answer

Features:

* Search
* Add
* Edit
* Delete
* Reorder
* Enable/disable if useful
* Save instantly or with explicit save action
* Confirmation before destructive actions

==================================================
11. PAGES / HOME CONTENT MANAGEMENT
===================================

Create a Pages section.

Main editable areas:

HOME PAGE:

* Hero slider
* Features / social proof
* About section content
* Contact callback / hotline

Hero slide fields:

* title
* subtitle
* description
* background image
* CTA text
* CTA link
* video URL where applicable
* order
* enabled

Features:

* customer counters
* social proof content
* supporting images
* service highlights

About override:

* custom title
* description
* experience years

Contact callback:

* hotline text

Do NOT invent additional editable homepage fields that are not required by the existing frontend audit.

==================================================
12. GLOBAL SETTINGS
===================

Create:

/settings/contact
/settings/social
/settings/footer
/settings/seo

CONTACT SETTINGS:

* phone
* phone_link
* address
* email
* operating hours where supported by the current frontend

SOCIAL SETTINGS:
Repeatable items:

* platform
* url
* enabled
* icon

Supported examples:

* Facebook
* Instagram
* Twitter/X
* Pinterest

FOOTER SETTINGS:

* copyright
* company_description
* footer links where appropriate

SEO SETTINGS:

* site title
* default meta description
* canonical site URL
* default social image
* other global metadata fields needed by the existing frontend

==================================================
13. MEDIA LIBRARY
=================

Create /media.

This must connect to Cloudflare R2.

Features:

* Upload images
* Drag & drop
* Multiple upload
* Preview
* Search
* Filter
* Copy public URL
* Delete
* Confirm deletion
* File metadata
* Image dimensions if available
* Upload progress
* Error handling

Use Cloudflare R2 as object storage.

Use the existing R2 configuration variables:

* R2_BUCKET_NAME
* R2_ACCOUNT_ID
* R2_ACCESS_KEY_ID
* R2_SECRET_ACCESS_KEY
* R2_PUBLIC_URL

Never expose R2 secret credentials to client-side code.

Create a clean reusable MediaPicker/ImageUploader so Projects, Services, Blogs, Pages and other editors can select uploaded media.

==================================================
14. SUPABASE DATA STRUCTURE
===========================

Use the existing logical entities:

* projects
* services
* posts
* faqs
* settings
* pages

Project structure:
title
slug
category
location
image
shortDesc
description
highlights
client
duration
area

Service structure:
title
slug
category
image
summary
features/badges
infoLabel
infoValue
description
ctaText
ctaLink

Post structure:
title
slug
content
status
featured_image
categories
seo_data
excerpt
author

FAQ structure:
question
answer

Settings structure:
header_contact
social_links
footer

Pages structure:
hero
features
about
contact_callback

Do not create unnecessary duplicate systems if the existing logical structure can support the requirement.

==================================================
15. DATABASE SAFETY
===================

Implement:

* Proper Supabase queries
* Type-safe data access
* Error handling
* Loading states
* Empty states
* Validation
* Unique slug checks
* Safe deletes
* Confirmation dialogs
* Proper authentication checks

Do not hardcode production data into the UI.

Do not use fake local arrays as the primary source once Supabase is connected.

==================================================
16. IMAGE / R2 WORKFLOW
=======================

All content image fields must support:

1. Upload new image
2. Select existing R2 media
3. Preview image
4. Replace image
5. Remove image
6. Save resulting public URL/path

Implement this as a reusable component.

==================================================
17. UX REQUIREMENTS
===================

Every management screen needs:

* Loading state
* Empty state
* Error state
* Success feedback
* Delete confirmation
* Save confirmation
* Disabled/loading button state
* Responsive layout
* Keyboard-friendly forms
* Clear validation messages

Tables should not become unusable on mobile.

Long forms should be divided into logical sections/cards.

Use sticky save actions where useful.

==================================================
18. SEARCH / FILTER / SORT
==========================

Implement useful search/filter functionality for:

Projects:

* title
* category
* location

Services:

* title
* category

Blogs:

* title
* status
* category

FAQs:

* question/answer

Media:

* filename/type

Use efficient server-side queries where appropriate.

==================================================
19. SECURITY
============

Security is critical.

Never:

* expose service-role credentials in the browser
* expose R2 secret keys
* place privileged credentials into NEXT_PUBLIC_ variables
* trust client input without validation
* allow unauthorized CRUD operations

Protect all admin routes.

Use Supabase Auth and appropriate authorization checks.

Use server-side operations for privileged mutations and R2 operations.

==================================================
20. COMPONENT ARCHITECTURE
==========================

Build reusable components for:

* AdminLayout
* Sidebar
* Topbar
* PageHeader
* StatCard
* DataTable
* SearchBar
* FilterBar
* ConfirmDialog
* EmptyState
* ErrorState
* LoadingState
* FormField
* SlugField
* ImageUploader
* MediaPicker
* RepeaterField
* RichTextEditor
* TagInput
* StatusBadge
* SaveBar
* Toast/Notification system

Avoid duplicated code.

==================================================
21. CODE QUALITY
================

Requirements:

* TypeScript strict
* Clean folder architecture
* Reusable components
* No unnecessary dependencies
* Clear server/client separation
* No dead code
* No fake APIs
* No placeholder CRUD
* No console-error driven logic
* Proper error handling
* Proper loading states
* Production-quality forms

==================================================
22. RESPONSIVE DESIGN
=====================

Admin must work properly at:

* Desktop
* Laptop
* Tablet
* Mobile

Use responsive:

* sidebar
* tables
* forms
* media grid
* dashboard cards
* editor layouts

==================================================
23. FINAL ADMIN NAVIGATION
==========================

Sidebar should contain exactly:

Dashboard
Projects
Services
Blog Posts
FAQs
Pages
Media
Settings
Profile

Bottom:
Logout

==================================================
24. ENVIRONMENT VARIABLES
=========================

Prepare environment configuration for the Admin project using the required integration variables.

Supabase:

* NEXT_PUBLIC_SUPABASE_URL
* NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
* SUPABASE_SERVICE_ROLE_KEY

Cloudflare R2:

* R2_BUCKET_NAME
* R2_ACCOUNT_ID
* R2_ACCESS_KEY_ID
* R2_SECRET_ACCESS_KEY
* R2_PUBLIC_URL

Site:

* NEXT_PUBLIC_SITE_URL

Never expose secret values in source code.

==================================================
25. IMPORTANT SEPARATION RULE
=============================

This is a completely separate Admin Project.

DO NOT:

* modify the public frontend
* copy public frontend routes into this project
* reproduce the public frontend UI
* refactor the frontend
* create frontend components unnecessarily
* depend on frontend local files
* assume direct filesystem access to the frontend

The ONLY connection between Admin and Frontend is through shared backend data/services such as:

* Supabase database
* Cloudflare R2 media
* shared public URLs

==================================================
26. PRODUCTION READINESS
========================

Before finishing:

* Verify authentication
* Verify every CRUD operation
* Verify image upload
* Verify image deletion
* Verify project creation/edit/delete
* Verify service creation/edit/delete
* Verify blog draft/publish/edit/delete
* Verify FAQ CRUD
* Verify homepage content management
* Verify global settings
* Verify media library
* Verify responsive behavior
* Verify route protection
* Verify error states
* Verify empty states
* Verify database connection
* Verify R2 connection
* Verify build
* Verify TypeScript
* Verify linting

Do not stop after creating the UI.

The result must be a COMPLETE, FUNCTIONAL, production-ready ZK Flooring Admin Panel.

==================================================
27. FINAL RULE
==============

Do not ask me to manually implement missing sections one by one.

Build the complete Admin Panel in one pass according to this specification.

Where the specification references existing ZK Flooring content, follow the exact field names and structures provided above.

Do not invent unrelated CMS modules.

Do not modify the public website.

Finish with a fully working standalone Admin project ready to connect to the existing ZK Flooring frontend through Supabase and Cloudflare R2.
