class SeededRandom {
    seed: number;

    constructor(seed: number = 12345) {
        this.seed = seed % 2147483647;
        if (this.seed <= 0) this.seed += 2147483646;
    }

    // Generate next random number between 0 and 1
    next(): number {
        this.seed = (this.seed * 16807) % 2147483647;
        return (this.seed - 1) / 2147483646;
    }

    // Generate random integer between min and max (inclusive)
    nextInt(min: number, max: number): number {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }

    // Reset seed
    setSeed(seed: number): void {
        this.seed = seed % 2147483647;
        if (this.seed <= 0) this.seed += 2147483646;
    }
}

// Flipable number mappings
const FLIP_MAP: Record<string, string> = {
    "0": "8",
    "1": "7",
    "6": "9",
    "8": "0",
    "7": "1",
    "9": "6",
    "3": "8"
};

// Mutation pool for replacement
const MUTATION_POOL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

class NumberGenerator {
    private rng: SeededRandom;

    constructor(seed: number = 12345) {
        this.rng = new SeededRandom(seed);
    }

    // Generate more complex target with strategic digit patterns
    generateTarget(): string {
        let number = '';
        let lastDigit = -1;
        const avoidSimilar = this.rng.nextInt(0, 1) === 1; // Sometimes avoid similar-looking digits

        for (let i = 0; i < 6; i++) {
            let digit: number;
            let attempts = 0;

            do {
                digit = this.rng.nextInt(0, 9);
                attempts++;

                // Avoid consecutive same digits
                if (digit === lastDigit) continue;

                // Sometimes avoid visually similar digits for extra difficulty
                if (avoidSimilar && attempts < 20) {
                    if (lastDigit === 6 && digit === 9) continue;
                    if (lastDigit === 9 && digit === 6) continue;
                    if (lastDigit === 0 && digit === 8) continue;
                    if (lastDigit === 8 && digit === 0) continue;
                    if (lastDigit === 1 && digit === 7) continue;
                    if (lastDigit === 7 && digit === 1) continue;
                }

                break;
            } while (attempts < 30);

            number += digit.toString();
            lastDigit = digit;
        }

        return number;
    }

    // Swap multiple random positions (2-4 swaps)
    swapOperation(number: string): string {
        const digits = number.split('');
        const numSwaps = this.rng.nextInt(2, 4); // Multiple swaps make it harder

        for (let i = 0; i < numSwaps; i++) {
            const pos1 = this.rng.nextInt(0, 5);
            let pos2 = this.rng.nextInt(0, 5);

            // Ensure different positions
            while (pos2 === pos1) {
                pos2 = this.rng.nextInt(0, 5);
            }

            // Swap
            [digits[pos1], digits[pos2]] = [digits[pos2], digits[pos1]];
        }

        return digits.join('');
    }

    // Flip numbers using the flip map
    flipOperation(number: string): string {
        return number.split('').map(digit => {
            return FLIP_MAP[digit] || digit;
        }).join('');
    }

    // Shift number with variable positions and multiple shifts
    shiftOperation(number: string): string {
        let current = number;
        const numShifts = this.rng.nextInt(1, 3); // Multiple shifts

        for (let i = 0; i < numShifts; i++) {
            const direction = this.rng.nextInt(0, 1); // 0 = left, 1 = right
            const positions = this.rng.nextInt(1, 4); // shift 1-4 positions

            if (direction === 0) {
                // Shift left
                current = current.slice(positions) + current.slice(0, positions);
            } else {
                // Shift right
                current = current.slice(-positions) + current.slice(0, -positions);
            }
        }

        return current;
    }

    // Replace multiple random digits with ones from limited mutation pool
    replaceOperation(number: string, limitedMutationPool: number[]): string {
        const digits = number.split('');
        const numReplacements = this.rng.nextInt(1, 3); // Replace 1-3 digits
        const usedPositions = new Set<number>();

        for (let i = 0; i < numReplacements; i++) {
            let position = this.rng.nextInt(0, 5);

            // Ensure we don't replace the same position twice
            while (usedPositions.has(position)) {
                position = this.rng.nextInt(0, 5);
            }
            usedPositions.add(position);

            const newDigit = limitedMutationPool[this.rng.nextInt(0, limitedMutationPool.length - 1)];
            digits[position] = newDigit.toString();
        }

        return digits.join('');
    }

    // Apply all transformations to get base number from target
    transformToBase(target: string, limitedMutationPool: number[]): {
        target: string;
        base: string;
        operations: string[];
    } {
        const operations: string[] = [];
        let current = target;

        // Apply 6-12 random operations (much more complex)
        const numOperations = this.rng.nextInt(6, 12);

        for (let i = 0; i < numOperations; i++) {
            const operation = this.rng.nextInt(0, 3);

            switch (operation) {
                case 0:
                    current = this.swapOperation(current);
                    operations.push('swap');
                    break;
                case 1:
                    current = this.flipOperation(current);
                    operations.push('flip');
                    break;
                case 2:
                    current = this.shiftOperation(current);
                    operations.push('shift');
                    break;
                case 3:
                    current = this.replaceOperation(current, limitedMutationPool);
                    operations.push('replace');
                    break;
            }
        }

        return {
            target,
            base: current,
            operations
        };
    }

    // Generate limited mutation pool (3-5 numbers from full pool)
    generateLimitedMutationPool(): number[] {
        const poolSize = this.rng.nextInt(3, 5); // 3-5 numbers only
        const selectedNumbers = new Set<number>();

        while (selectedNumbers.size < poolSize) {
            const randomIndex = this.rng.nextInt(0, MUTATION_POOL.length - 1);
            selectedNumbers.add(MUTATION_POOL[randomIndex]);
        }

        return Array.from(selectedNumbers).sort();
    }

    // Generate complete puzzle
    generatePuzzle(): {
        target: string;
        base: string;
        operations: string[];
        mutationPool: number[];
        seed: number;
    } {
        const target = this.generateTarget();
        const limitedMutationPool = this.generateLimitedMutationPool();
        const result = this.transformToBase(target, limitedMutationPool);

        return {
            ...result,
            mutationPool: limitedMutationPool,
            seed: this.rng.seed
        };
    }

    setSeed(seed: number): void {
        this.rng.setSeed(seed);
    }
}

function demonstrateGenerator() {
    const generator = new NumberGenerator(42);

    console.log("=== CHALLENGING Number Generator Demo ===");
    console.log("Each puzzle now uses 6-12 complex operations!");

    for (let i = 0; i < 3; i++) {
        generator.setSeed(42 + i);
        const puzzle = generator.generatePuzzle();

        console.log(`\n🧩 HARD Puzzle ${i + 1}:`);
        console.log(`Seed: ${42 + i}`);
        console.log(`🎯 Target: ${puzzle.target}`);
        console.log(`🔢 Base:   ${puzzle.base}`);
        console.log(`🔄 Operations (${puzzle.operations.length}): ${puzzle.operations.join(' -> ')}`);
        console.log(`🔢 Mutation Pool: ${puzzle.mutationPool.join(', ')}`);

        const hasConsecutive = /(.)\1/.test(puzzle.target);
        console.log(`✅ No consecutive digits: ${!hasConsecutive ? '✓' : '✗'}`);

        const opCounts = puzzle.operations.reduce((acc, op) => {
            acc[op] = (acc[op] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        console.log(`📊 Operation breakdown:`, opCounts);
        console.log(`🔥 Difficulty: ${puzzle.operations.length >= 10 ? 'EXTREME' : puzzle.operations.length >= 8 ? 'VERY HARD' : 'HARD'}`);
    }
}

// Verify seed consistency
function verifySeedConsistency() {
    console.log("\n=== Seed Consistency Test ===");

    const seed = 12345;
    const generator1 = new NumberGenerator(seed);
    const generator2 = new NumberGenerator(seed);

    const puzzle1 = generator1.generatePuzzle();
    const puzzle2 = generator2.generatePuzzle();

    console.log(`Generator 1 - Target: ${puzzle1.target}, Base: ${puzzle1.base}`);
    console.log(`Generator 2 - Target: ${puzzle2.target}, Base: ${puzzle2.base}`);
    console.log(`Results match: ${puzzle1.target === puzzle2.target && puzzle1.base === puzzle2.base ? '✓' : '✗'}`);
}

demonstrateGenerator();
verifySeedConsistency();
// Export for use
export { NumberGenerator, SeededRandom, FLIP_MAP, MUTATION_POOL };