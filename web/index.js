// Remove the `noscript` class
document.body.className = '';

const lightPalette = [
  // blue
  'hsl(218, 68%, 43%)',
  // purple
  'hsl(318, 68%, 43%)',
  // red,
  'hsl(349, 68%, 43%)',
  // pink
  'hsl(311, 80%, 50%)',
  // orange
  'hsl(28, 68%, 43%)',
  // yellow
  'hsl(41, 68%, 43%)',
  // green
  'hsl(106, 68%, 43%)'
];
const darkPalette = [
  // blue
  'hsl(218, 68%, 53%)',
  // purple
  'hsl(318, 68%, 53%)',
  // red,
  'hsl(349, 68%, 53%)',
  // pink
  'hsl(311, 80%, 50%)',
  // orange
  'hsl(28, 68%, 53%)',
  // yellow
  'hsl(41, 68%, 53%)',
  // green
  'hsl(106, 68%, 53%)'
];

function updateThemeColor(color) {
  const existingColor = document.querySelector('meta[name="theme-color"]');

  if (existingColor) {
    existingColor.setAttribute('content', color);
  } else {
    const newColor = document.createElement('meta');
    newColor.name = 'theme-color';
    newColor.content = color;

    document.head.appendChild(newColor);
  }
}

const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
const palette = darkModeQuery.matches ? darkPalette : lightPalette;

const d = new Date();
// Compute a semi-random hue
const index = Math.round(d.getHours() + d.getMinutes() + Math.random() * 300) % palette.length;

darkModeQuery.addEventListener('change', ev => {
  const newPalette = ev.matches ? darkPalette : lightPalette;
  const newColor = newPalette[index];
  document.body.style.setProperty('--bg-color', newColor);
  updateThemeColor(ev.matches ? '#2a2c2f' : newColor);
});
const color = palette[index];

// Apply the "random" color
document.body.style.setProperty('--bg-color', color);
updateThemeColor(darkModeQuery.matches ? '#2a2c2f' : color);

document.addEventListener('DOMContentLoaded', () => {
  // Small "sleep"-like function.
  const wait = time => new Promise(resolve => setTimeout(resolve, time));

  // Grab all the elements we will animate.
  const nodesToAnimate = Array.from(document.querySelectorAll('.with-fade-in'));

  // Apply a staggered delay on them.
  nodesToAnimate.forEach((el, i) => {
    el.style.transitionDelay = `${(i + 1) * 200}ms`;
  });

  // Show them after delay has passed.
  wait(150).then(() => {
    nodesToAnimate.forEach(el => el.classList.add('show'));
  });
});
