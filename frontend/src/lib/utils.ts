// Small utility helpers used across the app
// `cn` is a tiny className helper similar to the popular `clsx`/`classnames` packages.
export function cn(...inputs: Array<string | number | null | undefined | Record<string, any>>): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input));
      continue;
    }

    if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }

  return classes.join(' ');
}

export default cn;
