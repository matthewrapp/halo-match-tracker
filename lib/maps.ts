import { Player, PlayerColor } from "./types";

const pillClassNames = `py-1 px-3 rounded-full text-white font-normal text-[12px] truncate`;

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
