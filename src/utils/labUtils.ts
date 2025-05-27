import { NumberGenerator, FLIP_MAP } from "../lib/generator";
import type { GameState } from "../types/gameTypes";

export const generateLabPuzzle = (level: number): GameState => {
    const seed = level * 1000;
    const generator = new NumberGenerator(seed);
    generator.setDebug(false);
    const puzzle = generator.generatePuzzle();

    const specialPatterns = [
        {
            pattern: /(\d)\1{2,}/,
            bonus: 5,
            description: "Three or more identical digits in a row",
        },
        {
            pattern: /(\d)(\d)(\d)\3\2\1/,
            bonus: 10,
            description: "Palindrome sequence",
        },
        {
            pattern: /012|123|234|345|456|567|678|789|890/,
            bonus: 7,
            description: "Sequence of ascending digits",
        },
    ];

    const baseDifficulty = puzzle.operations.length;
    let maxAttempts: number;

    maxAttempts = Math.floor(baseDifficulty * 1.5);


    const availableMutations: any = ["swap", "flip", "replace", "bump"];

    return {
        baseNumber: puzzle.base,
        targetNumber: puzzle.target,
        mutationPool: puzzle.mutationPool,
        flipMap: FLIP_MAP,
        maxAttempts,
        availableMutations,
        lockedPositions: [],
        specialPatterns,
        date: new Date().toISOString(),
    };
};