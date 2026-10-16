# Cyrolabz Website Plan: The Transformation Story

Oct 14, 2026 · @Neil

## The story spine

Every page opens on one of four chapters, so the whole site reads as one transformation: from legacy systems to an engineered, intelligent business. The [story prototype](https://claude.ai/artifact/WWUzxDrVGhMZUUNs2sEQqm) is the reference for the home page.

| Chapter | Artwork | Headline | Services it carries |
| --- | --- | --- | --- |
| 01 Foundation | Pixel skyline | Your business, as it stands. | Consulting, Audits |
| 02 Connect | Circuit network | Every window becomes a signal. | Website Development, 3D Interactive Design, Custom Software Development |
| 03 Intelligence | Dissolving face and hand | Then the system starts to think. | AI Enablement & Implementation |
| 04 Cyrolabz | Logo mark | Transformation, engineered. | The brand line: AI Consulting, Software Development, Audits |

Three rules hold the story together on every page:

- **One scene, four states.** A single particle system morphs between the artworks, so each chapter turns into the next instead of cutting to it.
- **Alternating sides.** The scene and the copy swap left and right every chapter, with the copy set in 3D depth.
- **Settle, then sharpen.** Each artwork forms from particles, resolves into a clear image, then dissolves into the next.

The orbital hero image (rings, central orb, spheres) is not a chapter. Proposed use: the "system core" motif behind inner-page headers and the contact page.

## Sitemap

&#91;embedded content: sitemap · 1 home, 5 pages, 6 service pages\]

Home leads to Services, Work, About, Insights and Contact. Services opens one page per service, labelled with the story chapter it belongs to. Privacy and Terms sit in the footer.

## Page by page

The site has five top-level pages plus six service pages. Each page has one job and one story moment.

| Page | Job | Sections, in order | Story moment |
| --- | --- | --- | --- |
| Home | Make the pitch in one scroll and lead to an enquiry | Hero and pinned four-chapter story; services overview grouped by chapter; about block with three proof tiles (End-to-end, Secure by design, Outcome-led); process in five steps; live 3D demo; closing call to action and contact form | All four chapters in sequence, ending on the logo |
| Services | Route a visitor to the right service | Six service cards grouped under the chapter labels; one-line outcome per card; "How we work" strip; call to action | Card hover echoes the chapter artwork |
| Service pages (6) | Explain one service and convert | Template below | Opens on the service's chapter artwork as a sharp still with light parallax |
| Work | Prove capability | Case study cards (problem, approach, outcome) filtered by service | Chapter artwork as section dividers |
| About | Show who is behind the studio | Studio story; approach from strategy to engineering to audit; credentials and compliance posture | Foundation chapter, then the logo mark |
| Insights | Build authority and search traffic | Articles on AI strategy, governance and responsible AI, each tagged by chapter | Chapter artwork as article headers |
| Contact | Convert | Form (name, work email, company, need, details); response promise; "Book a Free Consultation" | Particles converge on the logo mark behind the form |

Footer pages: Privacy Policy and Terms.

### Service page template

1. Header: chapter label, headline, chapter artwork.
2. Outcome: what changes for the client, in one paragraph.
3. What you get: three to five deliverables.
4. How it works: three steps drawn from the five-step process (Discover, Design, Build, Audit & Launch, Evolve).
5. Proof: a linked case study, or the "How we work" strip until one exists.
6. Related services: the neighbours in the same chapter.
7. Call to action: "Start a Project" and "Book a Free Consultation".

Do not publish invented statistics, client logos or testimonials. Ship Work with real case studies only.

## Design system

The look is monochrome and engineered: near-black ink on cool paper, one blue accent, thin lines and corner marks taken from the logo's circuit geometry. All values below are already live in the prototype.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| Background | #F4F5F7 | #0A0B0D | Page |
| Ink | #0B0C0E | #EEF0F3 | Text, artwork, logo |
| Muted | #565B63 | #9AA0AA | Secondary text |
| Line | #D3D7DC | #2A2E35 | Borders, rails, corner marks |
| Accent | #2F6BFF | #6C97FF | Progress, signal particles, focus, primary button only |

**Type.** Sora for headlines, Manrope for body, Michroma for small uppercase labels with wide letter-spacing, echoing the logo tagline. Headlines scale from 1.9 to 3.1 rem.

**Layout.** Maximum width 1240 px, side gutters 16 to 48 px. Breakpoints at 820 px (scene stacks above copy) and 560 px (chapter names collapse to numbers).

**Components.**

- Primary button in the accent colour, secondary button as an outline; both with a visible focus ring.
- Uppercase tag chips with a 1 px border for services and chapters.
- Chapter rail: four segments, one progress bar each, play and pause.
- Corner marks (16 px) framing every scene, and 1 px rules instead of shadows.
- Service cards with a hover state that echoes the chapter artwork.

**Imagery rules.**

- Every artwork is stored once as a cut-out (ink and transparency) and tinted at run time, never as separate light and dark files.
- The logo is the supplied PNG, never redrawn or recoloured.
- Photographic artwork (the face) is remapped between ink and background so it stays clear in both themes.
- No stock photography. Chapter artwork and the orbital motif carry the visual identity.

## 3D, motion and scroll

One progress value drives the whole story, and everything else reads it. The prototype's engine is a canvas particle system, which keeps the first release light; a WebGL upgrade is reserved for the 3D Interactive Design demo.

- **Particles.** 11,000 on desktop, 6,000 on phones and low-core devices. Pixel density capped at 2 (1.5 on narrow screens).
- **Progress.** One value from 0 to 3 selects the chapter. On the home page it is set by scroll through a pinned section; on other pages the chapter is fixed.
- **Morphs.** Skyline windows fall and re-form as the network; the network bursts outward and gathers into the figure; the figure spirals into the logo mark.
- **Sharp reveals.** Each artwork cross-fades to its clear cut-out once its particles settle, then lets go before the next morph.
- **3D text.** Copy enters with a depth rotation, leans up to about 7 degrees toward the pointer, and keeps its lines on separate depth layers with a soft directional shadow on the headline. Desktop only; phones stack the scene above the copy.
- **Pointer.** Particles part around the cursor and shift by depth. Phones use a gentle automatic drift.

**Performance and fallbacks.**

- Pause rendering when the scene is off-screen or the tab is hidden.
- Under `prefers-reduced-motion`: no autoplay, no tilt, instant chapter changes, sharp images only.
- No canvas support: the four artworks as static images with the chapter copy.
- Ship artwork as separate optimised WebP files, not inline data, and lazy-load the scene after the hero text paints.
- Target Lighthouse Performance 90 or higher on a mid-range phone.

## Light and dark theming

Both themes are built from day one, and every element below changes with the theme token, never with a hard-coded colour.

| Element | Light | Dark | How |
| --- | --- | --- | --- |
| Page, text, lines | Paper and ink tokens | Inverted tokens | CSS variables on `:root`, redefined under `prefers-color-scheme: dark` and under `data-theme="dark"` |
| Logo | Multiply blend | Invert plus screen blend | One supplied PNG, never recoloured |
| Skyline, network, logo mark | Ink-tinted cut-out | Ink-tinted cut-out (light on dark) | Tinted at run time from the ink token |
| Face and hand | Remapped ink to paper | Remapped light to dark | Luminance plus transparency, so detail stays visible in both |
| Particles | Ink | Ink | Read from the token and re-read when the theme changes |
| Accent | #2F6BFF | #6C97FF | Passes contrast on its own theme background |

- **Toggle.** Auto (follows the system), Light, Dark in the header. The choice is remembered, and the page applies it before first paint to avoid a flash.
- **Test matrix.** Every page, form state, hover and focus state, and the scene, in both themes at 360 px and 1440 px.
- **Contrast.** Text and the accent meet WCAG AA in both themes, including copy that sits over the scene.

## Stack and build phases

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js (App Router), TypeScript strict | Server rendering for search visibility; no untyped code. Pending your decision. |
| Styling | Tailwind CSS with CSS variables | Both themes from one token set |
| Scene | Canvas particle engine from the prototype; three.js only for the 3D design demo | Light first load; WebGL where depth is the point |
| Scroll | GSAP ScrollTrigger and Lenis | Scroll sets the chapter progress |
| Forms | React Hook Form and Zod | Validated enquiry form with a success state |
| Build tool | Antigravity | Agent-driven build from the prompt set |

&#91;embedded content: build roadmap · 4 phases, 3 gates\]

Each gate is a pass or fail check. The next phase starts only when the gate before it is met.

## Open decisions

Six answers from you unlock the build.

- [ ] **Home opening.** Open on the skyline story (recommended), or on the orbital hero image first?
- [ ] **Accent colour.** Keep the blue accent, or go strictly black and white?
- [ ] **Framework.** Next.js for search visibility (recommended), or a plain single-page app?
- [ ] **Proof.** Do you have real case studies or testimonials for launch? If not, Work ships as "How we work" until you do.
- [ ] **Credentials.** Which qualifications and compliance claims go on the About page?
- [ ] **Enquiries.** Where should form submissions go, and which tool books the free consultation? Is a one-business-day reply realistic?
