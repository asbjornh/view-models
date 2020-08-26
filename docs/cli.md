# CLI

All config options can be viewed by running `npx view-models --help`.

## About file paths

The CLI supports an unlimited number of file paths:

```bash
view-models --out=models source/a.jsx source/b.jsx source/c.jsx
```

Typing out every file like this is not very nice. Thankfully, both `bash` and `zsh` supports using globs instead:

```bash
view-models --out=models source/*.jsx
```

**IMPORTANT**: By default, glob patterns in `bash` and `zsh` are **not** recursive. For instance, the pattern `source/**/*.jsx` would include `source/a/a.jsx` but it would not include `source/a/b/c/c.jsx`.

If you have source files at multiple directory depths, supply paths like so:

```bash
view-models --out=models source/*.jsx source/**/*.jsx`
```

Or like this:

```bash
view-models --out=models source/{*,**/*}.jsx
```
