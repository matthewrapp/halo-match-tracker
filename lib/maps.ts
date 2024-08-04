import { Player, PlayerColor } from "./types";

const pillClassNames = `py-1 px-3 rounded-full text-white font-normal text-[12px] truncate`;
// const playerColors: { [player in Player | "other"]: string } = {
//    "zE tthrilla": "blue",
//    HafenNation: "green",
//    "zE eskky": "orange",
//    YungJaguar: "red",
//    mcddp15: "pink",
//    other: "gray",
// };

export const playerComponentClassNames: {
   [player in Player | "other"]: { [component: string]: string };
} = {
   "zE tthrilla": {
      pill: `${pillClassNames} bg-blue-700`,
   },
   HafenNation: {
      pill: `${pillClassNames} bg-green-700`,
   },
   "zE eskky": {
      pill: `${pillClassNames} bg-orange-700`,
   },
   YungJaguar: {
      pill: `${pillClassNames} bg-red-700`,
   },
   mcddp15: {
      pill: `${pillClassNames} bg-pink-700`,
   },
   other: {
      pill: `${pillClassNames} bg-gray-700`,
   },
};

export const playerPillClasses: Record<PlayerColor, string> = {
   blue: `${pillClassNames} bg-blue-700`,
   green: `${pillClassNames} bg-green-700`,
   orange: `${pillClassNames} bg-orange-700`,
   red: `${pillClassNames} bg-red-700`,
   pink: `${pillClassNames} bg-pink-700`,
   purple: `${pillClassNames} bg-purple-700`,
   cyan: `${pillClassNames} bg-cyan-700`,
   gray: `${pillClassNames} bg-gray-700`,
};
