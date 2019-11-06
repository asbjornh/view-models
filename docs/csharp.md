# C# generator

```js
import { generators } from "view-models";

// Pass this generator to the compiler or to the Webpack plugin in order to output C#
const generator = generators.csharp;
```

This is the default generator. This generator has been used in production for several medium-sized apps since 2018.

## About enums

Generated enums look like this:

```cs
public enum Theme
{
  [EnumMember(Value = "theme-blue")]
  ThemeBlue = 0
}
```

This allows for type safe passing of magic strings from the C# app to the client app. If you're using ReactJS.NET and the Newtonsoft json serializer, I'm told that you can serialize enums to their string values with something like this:

```cs
using Newtonsoft.Json.Converters;

ReactSiteConfiguration.Configuration
  .SetJsonSerializerSettings(new JsonSerializerSettings
  {
      Converters = new List<JsonConverter> { new StringEnumConverter() }
  });
```
