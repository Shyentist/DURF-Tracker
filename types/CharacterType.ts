import { ItemType } from "./ItemType";

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
    spells: string[];
    gold: number;
};
