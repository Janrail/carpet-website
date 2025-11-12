# Local Carpet Fitter - Professional Carpet & Flooring Services

## Overview

Local Carpet Fitter is a multi-page website for a professional carpet and flooring services company based in Hounslow, West London. Its primary purpose is to showcase local services, build customer trust, and provide essential contact information for bookings in the West London area. The project aims to establish a strong online presence for the business and facilitate customer inquiries through an integrated contact form.

## User Preferences

Preferred communication style: Simple, everyday language.

## Project Structure

All image assets are organized in the `/images/` folder for easy management:
- Logo files (logo-red.png, logo.png, weblogo.jpg)
- Service icons (carpet-icon.jpg, vinyl-icon.jpg, laminate-icon.jpg, lvt-icon.jpg)
- Hero images (hero-img-1.jpg through hero-img-5.jpg)
- Background SVGs (hero-bg-1.svg through hero-bg-5.svg)
- Installation photos (96 total images including carpet, vinyl, laminate, stair runner installations)

## System Architecture

### UI/UX Decisions
- **Design:** Mobile-first, responsive design using Tailwind CSS.
- **Color Scheme:** Professional slate gray gradient with blue-gray accents.
- **Logo:** Professional logo integrated into the navigation header across all pages.
- **Imagery:** Use of authentic flooring installation photos and professional stock images.
- **Interactive Elements:** Mobile menu toggle, smooth scrolling, hover effects, and a hero text slider.

### Technical Implementations
- **Backend:** PHP 8.2 with PHPMailer for contact form email delivery (Hostinger Cloud Hosting compatible).
- **Frontend:** Multi-page HTML structure (`index.html`, `about.html`, `services.html`, `contact.html`, `gallery.html`).
- **Contact Form:** AJAX submission with real-time validation and PHP email handler (`send-email.php`).
- **SEO:** Comprehensive optimization including meta tags, Open Graph, Twitter Cards, structured data (JSON-LD), canonical URLs, `robots.txt`, and `sitemap.xml`.
- **Security:** HTML escaping for user inputs, server-side validation, and secure email configuration.

### Feature Specifications
- **Navigation:** Fixed header, mobile hamburger menu, smooth scrolling.
- **Homepage:** Hero section with rotating background images, services overview, "Why Choose Us" section, and Google Reviews.
- **About Page:** Company story, "Service Areas," and "Experience" sections.
- **Services Page:** Detailed service descriptions (carpet, vinyl, laminate, LVT, carpet tiles, stair runners), materials supply, and brands slider.
- **Contact Page:** Contact form with email delivery to info@localcarpetfitter.co.uk, business details, and clickable contact links.
- **Gallery Page:** Portfolio of completed installation projects organized by flooring type.
- **Brands Slider:** Continuous scrolling animation showcasing manufacturer names for various flooring types.

### System Design Choices
- **Static PHP Website:** Optimized for Hostinger Cloud Hosting deployment with PHP 8.2 support.
- **Email Configuration:** PHPMailer bundled locally (no external dependencies required on server).
- **Image Organization:** All 96 images centralized in `/images/` folder for easy management.
- **Deployment Ready:** Clean project structure with only essential files for production hosting.

## Recent Changes (November 2025)

- **Converted from Node.js to PHP:** Migrated from Express.js + Nodemailer to PHP + PHPMailer for Hostinger Cloud Hosting compatibility (Cloud Hosting does not support Node.js).
- **Updated Contact Form:** Changed submission from JSON to FormData for PHP processing.
- **Fixed Image Paths:** Corrected all image references to use `/images/` prefix, eliminating 404 errors.
- **Removed Dependencies:** Eliminated Node.js files (server.js, package.json, node_modules) for cleaner deployment.
- **Added PHPMailer:** Integrated PHPMailer library for reliable email delivery on shared hosting.

## External Dependencies

- **Tailwind CSS (CDN):** `https://cdn.tailwindcss.com` for utility-first styling.
- **Font Awesome (CDN):** `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css` for icons.
- **Google Fonts (CDN):** `https://fonts.googleapis.com/css2?family=Inter` for typography.
- **PHPMailer:** PHP library for sending emails (bundled in `/PHPMailer/` folder).
- **Google Business Profile:** Linked for direct customer review submissions.
- **Pixabay:** Source for background images.

## Deployment Notes for Hostinger

### Email Configuration Required
Before the contact form will work on Hostinger, you must:
1. Create the `noreply@localcarpetfitter.co.uk` mailbox in Hostinger hPanel
2. Configure SPF and DKIM records for email deliverability
3. Test the contact form after deployment to verify email delivery

### Recommended PHP Version
- The website is built for PHP 8.2 (compatible with PHP 7.4 - 8.4)
- Change PHP version in hPanel → Advanced → PHP Configuration if needed