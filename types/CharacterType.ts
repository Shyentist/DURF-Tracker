import { ItemType } from "./ItemType";
import { SpellType } from "./SpellType";

export type CharacterType = {
    id: string;
    name: string;
    hitdice: number;
    xp: number;
    strength: number;
    dexterity: number;
    will: number;
    description: string;
    biography: string;
    inventory: ItemType[];
    spells: SpellType[];
    gold: number;
    img: string
};
