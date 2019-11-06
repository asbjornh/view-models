# Eslint plugin

```
npm install --save-dev eslint-plugin-view-models
```

The plugin has a single rule that checks many things: `view-models/all`.

.eslintrc.json:

```json
{
  "plugins": ["eslint-plugin-view-models"],
  "rules": {
    "view-models/all": "error"
  }
}
```

Note that while the eslint plugin is installed separately from `view-models`, the source code actually lives in this package. This means that whenever you upgrade `view-models` the eslint plugin is also upgraded. `eslint-plugin-view-models` is merely a proxy package that imports files form `view-models`.
