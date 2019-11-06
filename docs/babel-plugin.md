# Babel plugin

Having a bunch of `viewModelMeta` scattered all around your production code might not be what you want. To solve this issue, a Babel plugin is included which, if enabled, will strip all instances of `ComponentName.viewModelMeta` or `static viewModelMeta` when compiling with Babel.

**IMPORTANT**

`view-models/babel-plugin` needs to be the first plugin to run on your code. If other plugins have transformed the code first, it can't be guaranteed to work like expected.

**.babelrc**:

```json
{
  "plugins": ["view-models/babel-plugin"]
}
```
