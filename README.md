# AabahonSC.org 

## Structure

```
.
├── index.html          # Home
├── about.html          # About + Executive Committee + Bylaws
├── events.html         # Events 2023 + photo gallery
├── join-us.html        # Join Us landing
├── memberships.html    # Membership details + tiers
├── volunteers.html     # Volunteers
├── donations.html      # Individual Donors + Company Sponsor
├── gallery.html        # Talent submissions
├── faqs.html           # Frequently Asked Questions
├── contact-us.html     # Contact Us
└── assets/
    ├── css/styles.css   # All styling (Open Sans + Playfair Display, slate #546e7a theme)
    ├── js/main.js       # Mobile nav toggle + dropdown
    ├── images/          # 61 images (logo, banners, committee photos, event/gallery photos)
    ├── video/           # event-video.mp4 (Events Gallery)
    └── files/Aabahon-bylaws.pdf
```

## Preview locally

From this folder, run any static server, e.g.:

```bash
# Python 3
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just double-click `index.html` to open it in your browser.

## Hosting

This is a plain static site, so it works on any of these with zero configuration:

- **GitHub Pages** — push this folder to a repo, enable Pages on the `main` branch (root).
- **Netlify / Vercel / Cloudflare Pages** — drag-and-drop this folder, or connect the repo. No build command; publish directory is the repo root.
- **Any web host** — upload the files to the web root via FTP.

To use the custom domain `aabahonsc.org`, point the domain's DNS at your host and add it as a
custom domain in the host's settings.

## Notes

- Contact: `aabahon.sc@gmail.com`
