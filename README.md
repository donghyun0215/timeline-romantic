# ThatDay - A Romantic Timeline Template

> To be honest , she broke with me i guess it can help you , i really loved her. No worries enjoy this feel free to modify or to contribute TBH i don't want to continue this :( but maybe someone can be happy cuz of me ,  the latest commits is done by Github Copilot including this Readme. this is built in just 2hr there can be bugs sorry for that.

A beautiful, animated love story website built with **Next.js**, **Framer Motion**, and **Tailwind CSS**. Use it to document and share your own love story with a personalised timeline, a heartfelt letter, and a romantic "You & Me" section.

## Features

- Animated hero section with a gradient name display
- Interactive folding-card timeline to document your key moments
- Floating words orbit animation in the "You & Me" section
- A customisable love letter with animated effects
- Floating hearts background
- Smooth scroll & parallax effects
- Fully responsive (mobile-first)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20.9.0+
- [Bun](https://bun.sh/) (recommended) or npm/yarn/pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/love-story-template.git
cd love-story-template

# Install dependencies
bun install
# or: npm install

# Start the development server
bun dev
# or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Customisation

### 1. Change the Name (Hero Section)

Open `src/app/page.tsx` and find the `<h1>` hero block:

```tsx
<motion.span ...>
  Your Name   {/* replace with your person's name */}
</motion.span>
```

Also update the subtitle text just below it.

### 2. Edit the Timeline

In `src/app/page.tsx`, find the `TIMELINE` array near the top of the file:

```ts
const TIMELINE = [
  {
    emoji: "💬",
    time: "19:00",             // time of the moment
    date: "DD Month YYYY",     // date of the moment
    title: "The First Message",
    description: "Replace with your story...",
    image: null,               // set to "/photos/your-image.png" or keep null
  },
  // add or remove entries as needed
];
```

- **Add** as many cards as you like.
- **Remove** cards you don't need.
- **Add images**: place your screenshot/photo in `public/photos/` and set `image: "/photos/your-file.png"`.

### 3. Edit the Floating Words

Find the `FLOATING_WORDS` array and replace with words meaningful to you:

```ts
const FLOATING_WORDS = ["forever", "us", "home", "dream", "always", "together", "yours", "heart"];
```

### 4. Edit the Love Letter

Scroll down in `src/app/page.tsx` to the **LETTER** section and replace the placeholder paragraphs with your own heartfelt words.

### 5. Update the Page Title & Description

Open `src/app/layout.tsx` and update the `metadata` object:

```ts
export const metadata: Metadata = {
  title: "For You, [Name]",
  description: "Your personal message here.",
  // ...
};
```

### 6. Add / Replace Photos

Place your images in the `public/photos/` folder and reference them in the `TIMELINE` array:

```ts
image: "/photos/your-screenshot.png",
```

Images are displayed as a tappable card thumbnail that opens in a full-screen lightbox modal.

## Build for Production

```bash
bun run build
bun run start
# or: npm run build && npm start
```

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | React framework & routing |
| Framer Motion | Animations |
| Tailwind CSS | Styling |
| Lenis | Smooth scrolling |

## License

MIT - feel free to fork, customise, and share your own love story.

## Music Credit

Background music: "Heartwarming" by Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 4.0 License
http://creativecommons.org/licenses/by/4.0/
