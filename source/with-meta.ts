type metaType =
  | "ignore"
  | "double"
  | "double?"
  | "float"
  | "float?"
  | "int"
  | "int?";

type primitive = string | number | boolean | undefined;

type TypeLiteral = {
  [key: string]: primitive | TypeLiteral;
};

type TypeLiteralArray<Elements> = {
  [E in keyof Elements]: ViewModelMeta<Elements[E]>;
};

type MetaTypeArray<T> = T extends Array<infer U>
  ? DeepMetaTypeArray<U>
  : metaType;

interface DeepMetaTypeArray<T> extends Array<MetaTypeArray<T>> {}

export type ViewModelMeta<Props> = Props extends string
  ? "ignore"
  : {
      [P in keyof Props]?: Props[P] extends
        | TypeLiteral
        | TypeLiteral[]
        | undefined
        ? Props[P] extends TypeLiteral[] | undefined
          ? TypeLiteralArray<Props[P]>
          : ViewModelMeta<Props[P]> | "ignore"
        : MetaTypeArray<Props[P]>;
    };

export type WithMeta<T> = {
  viewModelMeta: ViewModelMeta<T>;
};
