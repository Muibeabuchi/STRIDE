export function generateInviteCode(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// type Horse = {
//   breed: string;
//   stallion: boolean;
// };

// type OnlyBoolsAndHorses = {
//   [key: string]: boolean | Horse;
// };

// type OnlyBoolsAndHorsesGeneric<Type extends Horse = Horse> = {
//   [key: string]: Type;
// };

// const conform: OnlyBoolsAndHorses = {
//   del: true,
//   rodney: false,
//   horse: {
//     breed: "italian",
//     stallion: true,
//   },
// };

// type GermanHorse = {
//   breed: string;
//   stallion: boolean;
//   long: boolean;
// };
// type GermanHorseGeneric = OnlyBoolsAndHorsesGeneric<GermanHorse>;

// const conform2: GermanHorseGeneric = {
//   "1": {
//     breed: "german",
//     stallion: false,
//     long: true,
//   },
// };

// type OptionsFlags<Type extends {alive:"false"}> = {
//   [Property in Type as Type["alive"]]: boolean;
// };

// type OptionsFlags<Type> = {
//   [Property in keyof Type]: boolean;
// };

// type Features = {
//   darkMode: () => void;
//   newUserProfile: () => void;
// };

// type ReverseOptionsFlags<Type> = {
//   -readonly [Property in keyof Type]: Property;
// };

// type LockedAccount = {
//   readonly id: string;
//   readonly name: string;
// };

// type FeatureOptions = ReverseOptionsFlags<LockedAccount>;

// // Capitalize<>

// // ---------------------FILTERING OUT KEYS-------------------------

// type RemoveKindField<Type extends Object> = {
//   [Property in keyof Type as Exclude<Property, "area">]: () => Type[Property];
// };

// interface Circle {
//   kind: "circle";
//   radius: number;
// }

// interface Rectangle {
//   kind: "rectangle";
//   area: number;
// }

// type KindlessCircle = RemoveKindField<Circle | Rectangle>;

// const KindlessShape: KindlessCircle = {
//   // area: 54,
//   kind: () => "circle",
//   radius: () => 2,
// };

// type Flatten<T> = T extends any[] ? T[number] : T;

// type stringy = Flatten<string[]>;
// type numbery = Flatten<number>;

// type GetReurnType<T> = T extends (a: any) => infer Value ? Value : never;
// type GetParameterType<T> = T extends (a: infer Value) => any ? Value : never;

// type wer = GetParameterType<(hello: string) => void>;
// type were = GetReurnType<(hello: string) => void>;
