# Product Requirements Document (PRD)

## Project Name

ZK Flooring Website & CMS Platform

## Business Information

Brand Name: ZK Flooring

Phone Number:
07903723774

Address:
B10 9HH, Hobmoor Road, Small Heath, Birmingham

Service Coverage:
Birmingham (Primary Location)
100–200 Mile Service Radius

Products & Services:

* Carpet
* Wood Flooring
* Vinyl Flooring
* Real Wood Flooring
* Engineered Wood Flooring
* LVT Flooring
* SPC Flooring
* Self Levelling
* Wall Panels
* Decking
* Cupboards

---

# Project Objective

Convert the provided HTML5 template into a fully dynamic production-ready Next.js platform with integrated CMS, Supabase backend, Cloudflare R2 storage, SEO management, AI-powered content tools, user management, and frontend editing capabilities.

The final product should function similarly to a modern WordPress website while maintaining the exact approved frontend design.

---

# CRITICAL DESIGN REQUIREMENT

The supplied HTML template is the approved production design.

This is a strict requirement.

The system must:

* Preserve exact layout structure
* Preserve section ordering
* Preserve responsive behavior
* Preserve spacing hierarchy
* Preserve visual hierarchy
* Preserve component positions
* Preserve styling patterns
* Preserve user experience flow

The system must NOT:

* Redesign the UI
* Replace sections
* Change section order
* Modernize the layout
* Rebuild visual structure
* Change spacing philosophy
* Introduce a different design system

Visual parity with the supplied template is mandatory.

The task is implementation, not redesign.

---

# Technology Stack

Frontend:

* Next.js

Backend:

* Supabase

Storage:

* Cloudflare R2

Authentication:

* Supabase Auth

AI Providers:

* OpenAI API
* Gemini API

---

# Frontend Requirements

Convert all static content into dynamic CMS-controlled content.

All text, images, buttons, links, cards, testimonials, services, blog items, and page content must be editable from the admin panel.

Frontend must be:

* Fully Responsive
* Mobile Optimized
* SEO Friendly
* Fast Loading
* Production Ready

---

# Admin CMS Requirements

The platform must include a complete CMS.

## Dashboard

Admin dashboard with:

* Site overview
* Recent activity
* Content statistics
* User statistics
* Media statistics

---

## Posts Module

Features:

* All Posts
* Add Post
* Edit Post
* Delete Post
* Draft Posts
* Published Posts
* Categories
* Tags
* Featured Images

---

## Pages Module

Features:

* All Pages
* Add Page
* Edit Page
* Delete Page

All pages must support dynamic content editing.

---

## Media Module

Features:

* Media Library
* Upload Media
* Delete Media
* Replace Media
* Search Media

Storage Provider:
Cloudflare R2

---

## Users Module

Features:

* All Users
* Add User
* Edit User
* Delete User
* User Profiles

Support role-based access.

---

## Settings Module

### General Settings

* Site Title
* Site Description
* Logo
* Favicon
* Contact Information

### Writing Settings

* Blog Defaults
* Content Defaults

### Reading Settings

* Homepage Selection
* Blog Page Selection

### Media Settings

* Media Preferences

### Permalink Settings

* URL Structure Management

---

## Social Media Management

Admin must be able to:

* Add Social Links
* Edit Social Links
* Delete Social Links
* Enable Social Platforms
* Disable Social Platforms

Supported Platforms:

* Facebook
* Instagram
* LinkedIn
* X/Twitter
* YouTube
* TikTok
* Threads

Changes should automatically update all frontend social icons.

---

# Frontend Editing Mode

When an authorized administrator is logged in:

Frontend must display editing controls.

Admin should be able to:

* Edit text
* Replace images
* Update buttons
* Modify content

without leaving the frontend.

Changes should synchronize with the CMS.

---

# SEO Module

## Basic SEO

Fields:

* SEO Title
* Meta Description
* Focus Keyword
* Canonical URL

---

## Blog SEO Settings

Fields:

* Blog Language (English Only)
* Max Posts Shown On Main Blog Page

---

## Technical SEO

Features:

* robots.txt Editor
* ads.txt Editor
* XML Sitemap Generation
* HTML Sitemap Generation

---

## Social SEO

Fields:

* Open Graph Title
* Open Graph Description
* Open Graph Image

Twitter/X Cards:

* Title
* Description
* Image

---

# AI SEO & Content Tools

Provider Support:

* OpenAI API
* Gemini API

Features:

## Title Generation

Generate SEO-friendly title suggestions.

## Meta Description Generation

Generate SEO-friendly descriptions.

## Excerpt Generation

Generate short summaries from content.

## Alt Text Generation

Generate accessible image alt text.

## Editorial Notes

Generate suggestions for:

* Accessibility
* Readability
* Grammar
* SEO

## Editorial Updates

Apply approved editorial suggestions automatically.

## Content Summarization

Generate concise content summaries.

---

# Authentication

Authentication handled through Supabase.

Features:

* Login
* Logout
* Password Reset
* Session Management

---

# Content Management Requirement

Every editable website section must support:

* Create
* Read
* Update
* Delete

Admin must be able to manage:

* Text
* Images
* Buttons
* Links
* Content Blocks

without developer involvement.

---

# Performance Requirements

* Optimized Images
* Lazy Loading
* Fast Page Rendering
* Mobile Optimization
* Production Performance Standards

---

# Final Deliverable

A fully functional Next.js website powered by Supabase and Cloudflare R2 with:

* Dynamic CMS
* Admin Dashboard
* Blog System
* User Management
* Social Media Management
* AI SEO Tools
* Frontend Editing
* Exact Visual Match to Approved Template

No redesign is permitted.
Only implementation and dynamic functionality are required.
