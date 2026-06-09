# Choi Meng Yew — Portfolio

Personal portfolio site. Built with React + Vite, deployed via GitHub Pages.

Live at: [citizencathay.github.io/portfolio-site](https://citizencathay.github.io/portfolio-site/)

## Dev

```bash
npm install
npm run dev
```

## Deploy

```bash
npm run deploy
```

Deploys to the `gh-pages` branch via the `gh-pages` package. Make sure `base` in `vite.config.js` matches the repo name.

## Adding Projects

Open `src/components/Projects.jsx` and add to the `PROJECTS` array:

```js
{
  title: 'Project Name',
  role: 'Your Role · Status',
  year: 'Month YYYY - Month YYYY',
  summary: 'One line shown on the card.',
  description: 'Full description shown in the expanded view.',
  keyFeatures: [
    'Feature one.',
    'Feature two.',
  ],
  stack: ['C++', 'CUDA', 'OpenGL'],
  links: [
    { label: 'Repository', href: 'https://github.com/...', icon: 'devicon-github-plain' },
  ],
},
```