const test = require('ava');

const { compile, parsers } = require('../../../index');
const normalize = require('../../utils/_normalize-string');
const {
  components,
  classes
} = require('../../../fixtures/typescript/source-code');

const template = (t, sourceCode, expected, options) => {
  const transformedSource = compile(
    sourceCode,
    Object.assign({}, options, { parser: parsers.typescript })
  );
  t.is(normalize(expected), normalize(transformedSource.code));
};

const csharpImports = `using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;`;

test(
  'Class component',
  template,
  components.classComponent,
  classes.classComponent
);

test(
  'Functional component',
  template,
  components.funcComponent,
  classes.funcComponent
);

test(
  'Empty component',
  template,
  `const Component = (props: {}) => {}; export default Component;`,

  `${csharpImports}
  public class Component
  {
  }
`
);

test(
  'With type definition',
  template,
  `type A = { b?: string };
  export const C = (p: A) => null;`,
  `${csharpImports}
  public class A
  {
    public string B { get; set; }
  }
  `
);

test(
  'With interface definition',
  template,
  `interface A { b?: string }
  export const C = (p: A) => null;`,
  `${csharpImports}
  public class A
  {
    public string B { get; set; }
  }`
);

test(
  'With react type',
  template,
  `type A = { b?: string };
  export const C: React.FunctionComponent<A> = props => null;`,
  `${csharpImports}
  public class A
  {
    public string B { get; set; }
  }`
);

test(
  'With react type literal',
  template,
  `export const C: React.FunctionComponent<{ b?: string }> = props => null;`,
  `${csharpImports}
  public class C
  {
    public string B { get; set; }
  }`
);

test(
  'Type literal (class)',
  template,
  `export class C extends React.Component<{ b?: string }> {}`,
  `${csharpImports}
  public class C
  {
    public string B { get; set; }
  }`
);

test('Throws on multiple exports', t => {
  const sourceCode = `
  export const Component = (props: {}) => null,
  A = true;`;
  const error = t.throws(() => {
    compile(sourceCode, { parser: parsers.typescript });
  });

  t.is(
    "Couldn't get component name because of multiple exports.",
    error.message
  );
});

test('Throws on name collisions', t => {
  const sourceCode = `
  const Component = (props: { component: string }) => <div>{props.component}</div>;
  export default Component;`;
  const error = t.throws(() => {
    compile(sourceCode, { parser: parsers.typescript });
  });

  t.is(
    "Illegal prop name 'component'. Prop names must be different from component name.",
    error.message
  );
});

test(
  'Strips client-only types',
  template,
  `
  type ComponentProps = {
    a: () => void;
    b: JSX.Element;
  };
  const Component = (props: ComponentProps) => <div></div>;
  export default Component;`,

  `${csharpImports}
  public class ComponentProps
  {
  }`
);

test(
  'Imported type reference',
  template,
  `import { AnotherComponent } from './another-component';
  const Component = (props: AnotherComponent) => <div />;
  export default Component;`,

  `${csharpImports}
  public class Component : AnotherComponent
  {
  }`
);

test(
  'Excluded component',
  template,
  `const Component = (props: {}) => {};
  Component.propTypesMeta = "exclude";
  export default Component;`,
  undefined
);

test(
  'Excluded props',
  template,
  `const Component = (props: {
    a: string,
    b?: { c: string }
  }) => {};
  Component.propTypesMeta = {
    a: "exclude",
    b: { c: "exclude" }
  };
  export default Component;`,
  `${csharpImports}
  public class Component
  {
    public Component_B B { get; set; }
  }
  public class Component_B
  {
  }`
);

test(
  'Meta types',
  template,
  `const Component = (props: {
    a?: number,
    b?: { c?: number },
    d?: number[]
  }) => {};
  Component.propTypesMeta = {
    a: "float?",
    b: { c: "double" },
    d: ["int?"]
  };
  export default Component;`,
  `${csharpImports}
  public class Component
  {
    public float? A { get; set; }
    public Component_B B { get; set; }
    public IList<int?> D { get; set; }
  }
  public class Component_B
  {
    public double C { get; set; }
  }`
);

test(
  'Replaces "number" with "int" by default',
  template,
  `const Component = (props: { a?: number }) => {};
  export default Component;`,
  `${csharpImports}
  public class Component
  {
    public int A { get; set; }
  }`
);
