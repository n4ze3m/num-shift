import { SeededRandom } from "./seed";

export const FLIP_MAP: Record<string, string> = {
  "2": "5",
  "5": "2",
  "6": "9",
  "9": "6",
};

const MUTATION_POOL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export class NumberGenerator {
  private rng: SeededRandom;
  private debug: boolean;

  constructor(seed: number = 12345, debug: boolean = false) {
    this.rng = new SeededRandom(seed);
    this.debug = debug;
  }

  private log(message: string): void {
    if (this.debug) {
      console.log(`[NumberGenerator Debug]: ${message}`);
    }
  }

  generateTarget(): string {
    let number = "";
    let lastDigit = -1;
    const avoidSimilar = this.rng.nextInt(0, 1) === 1;

    this.log(
      `Starting target generation. Avoid similar digits: ${avoidSimilar}`
    );

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
      this.log(
        `Position ${i}: Generated digit ${digit} (attempts: ${attempts})`
      );
    }

    this.log(`Generated target: ${number}`);
    return number;
  }

  swapOperation(number: string): string {
    const digits = number.split("");
    const numSwaps = this.rng.nextInt(2, 4);

    this.log(
      `Swap operation: Starting with ${number}, performing ${numSwaps} swaps`
    );

    for (let i = 0; i < numSwaps; i++) {
      const pos1 = this.rng.nextInt(0, 5);
      let pos2 = this.rng.nextInt(0, 5);

      // Ensure different positions
      while (pos2 === pos1) {
        pos2 = this.rng.nextInt(0, 5);
      }

      const before = digits.join("");
      [digits[pos1], digits[pos2]] = [digits[pos2], digits[pos1]];
      const after = digits.join("");

      this.log(
        `  Swap ${i + 1
        }: Swapped positions ${pos1} and ${pos2} - ${before} → ${after}`
      );
    }

    const result = digits.join("");
    this.log(`Swap operation complete: ${number} → ${result}`);
    return result;
  }

  flipOperation(number: string): string {
    this.log(`Flip operation: Starting with ${number}`);

    const result = number
      .split("")
      .map((digit, index) => {
        const flipped = FLIP_MAP[digit] || digit;
        if (flipped !== digit) {
          this.log(`  Position ${index}: Flipped ${digit} → ${flipped}`);
        }
        return flipped;
      })
      .join("");

    this.log(`Flip operation complete: ${number} → ${result}`);
    return result;
  }

  shiftOperation(number: string): string {
    let current = number;
    const numShifts = this.rng.nextInt(1, 3);

    this.log(
      `Shift operation: Starting with ${number}, performing ${numShifts} shifts`
    );

    for (let i = 0; i < numShifts; i++) {
      const direction = this.rng.nextInt(0, 1);
      const positions = this.rng.nextInt(1, 4);
      const before = current;

      if (direction === 0) {
        current = current.slice(positions) + current.slice(0, positions);
        this.log(
          `  Shift ${i + 1
          }: Left shift by ${positions} positions - ${before} → ${current}`
        );
      } else {
        current = current.slice(-positions) + current.slice(0, -positions);
        this.log(
          `  Shift ${i + 1
          }: Right shift by ${positions} positions - ${before} → ${current}`
        );
      }
    }

    this.log(`Shift operation complete: ${number} → ${current}`);
    return current;
  }

  replaceOperation(
    number: string,
    limitedMutationPool: number[],
    usedReplacementDigits: Set<number>
  ): string {
    const digits = number.split("");
    const numReplacements = this.rng.nextInt(1, 3);
    const usedPositions = new Set<number>();

    this.log(
      `Replace operation: Starting with ${number}, performing ${numReplacements} replacements`
    );
    this.log(`  Starting mutation pool: [${limitedMutationPool.join(", ")}]`);
    this.log(
      `  Already replaced digits: [${[...usedReplacementDigits].join(", ")}]`
    );

    for (let i = 0; i < numReplacements; i++) {
      let position = this.rng.nextInt(0, 5);
      while (usedPositions.has(position)) {
        position = this.rng.nextInt(0, 5);
      }
      usedPositions.add(position);

      const oldDigit = parseInt(digits[position]);

      // Filter mutation pool to avoid using digits already replaced earlier
      const availableChoices = limitedMutationPool.filter(
        (d) => !usedReplacementDigits.has(d) && d !== oldDigit
      );
      if (availableChoices.length === 0) {
        this.log(
          `  No more unique digits available for replacement, stopping early`
        );
        break;
      }

      const newDigit =
        availableChoices[this.rng.nextInt(0, availableChoices.length - 1)];
      digits[position] = newDigit.toString();
      usedReplacementDigits.add(newDigit);
      limitedMutationPool.push(oldDigit)

      // // Replace the used digit in the pool with the old one
      // const poolIndex = limitedMutationPool.indexOf(newDigit);
      // if (poolIndex !== -1) {
      //   limitedMutationPool[poolIndex] = oldDigit;
      //   this.log(
      //     `  Updated mutation pool: replaced ${newDigit} with ${oldDigit}`
      //   );
      // }

      this.log(
        `  Replace ${i + 1}: Position ${position} - ${oldDigit} → ${newDigit}`
      );
    }

    const result = digits.join("");
    this.log(`Replace operation complete: ${number} → ${result}`);
    this.log(`  Final mutation pool: [${limitedMutationPool.join(", ")}]`);
    return result;
  }

  // New method to ensure no digits are in the same position
  private finalCleanup(target: string, base: string): string {
    const targetDigits = target.split("");
    const baseDigits = base.split("");
    let current = base;

    this.log(`\n=== Final Cleanup ===`);
    this.log(`Target: ${target}`);
    this.log(`Base before cleanup: ${base}`);

    // Find positions where digits match
    const matchingPositions: number[] = [];
    for (let i = 0; i < targetDigits.length; i++) {
      if (targetDigits[i] === baseDigits[i]) {
        matchingPositions.push(i);
      }
    }

    if (matchingPositions.length === 0) {
      this.log(`No matching positions found, cleanup not needed`);
      return current;
    }

    this.log(`Found matching positions: [${matchingPositions.join(", ")}]`);

    // Try to fix matching positions by swapping or shifting
    let attempts = 0;
    const maxAttempts = 10;

    while (matchingPositions.length > 0 && attempts < maxAttempts) {
      attempts++;
      const currentDigits = current.split("");

      // Try swapping matching positions with non-matching ones
      for (let i = matchingPositions.length - 1; i >= 0; i--) {
        const matchingPos = matchingPositions[i];

        // Find a position that doesn't match and would create a valid swap
        for (let j = 0; j < currentDigits.length; j++) {
          if (
            j !== matchingPos &&
            targetDigits[j] !== currentDigits[matchingPos] &&
            targetDigits[matchingPos] !== currentDigits[j]
          ) {
            // Perform the swap
            const before = current;
            [currentDigits[matchingPos], currentDigits[j]] = [
              currentDigits[j],
              currentDigits[matchingPos],
            ];
            current = currentDigits.join("");

            this.log(
              `  Cleanup swap: positions ${matchingPos} and ${j} - ${before} → ${current}`
            );

            // Remove from matching positions if fixed
            if (targetDigits[matchingPos] !== currentDigits[matchingPos]) {
              matchingPositions.splice(i, 1);
            }
            break;
          }
        }
      }

      // If swapping didn't work, try a shift operation
      if (matchingPositions.length > 0) {
        const before = current;
        current = this.shiftOperation(current);

        // Recheck matching positions after shift
        const newCurrentDigits = current.split("");
        for (let i = matchingPositions.length - 1; i >= 0; i--) {
          const pos = matchingPositions[i];
          if (targetDigits[pos] !== newCurrentDigits[pos]) {
            matchingPositions.splice(i, 1);
          }
        }

        this.log(`  Cleanup shift applied: ${before} → ${current}`);
      }
    }

    // Final verification
    const finalDigits = current.split("");
    const remainingMatches = targetDigits.filter(
      (digit, index) => digit === finalDigits[index]
    ).length;

    this.log(`Cleanup complete: ${base} → ${current}`);
    this.log(`Remaining matching positions: ${remainingMatches}`);

    return current;
  }

  transformToBase(
    target: string,
    limitedMutationPool: number[]
  ): {
    target: string;
    base: string;
    operations: string[];
  } {
    const operations: string[] = [];
    let current = target;
    const usedDigits = new Set<number>();
    const numOperations = this.rng.nextInt(6, 12);
    this.log(`\n=== Transform to Base ===`);
    this.log(`Starting transformation: ${target}`);
    this.log(`Will perform ${numOperations} operations`);

    for (let i = 0; i < numOperations; i++) {
      const operation = this.rng.nextInt(0, 3);
      const before = current;

      this.log(`\nOperation ${i + 1}/${numOperations}:`);

      switch (operation) {
        case 0:
          current = this.swapOperation(current);
          operations.push("swap");
          break;
        case 1:
          current = this.flipOperation(current);
          operations.push("flip");
          break;
        case 2:
          current = this.shiftOperation(current);
          operations.push("shift");
          break;
        case 3:
          current = this.replaceOperation(
            current,
            limitedMutationPool,
            usedDigits
          );
          operations.push("replace");
          break;
      }

      this.log(
        `Step ${i + 1} summary: ${before} → ${current} (${operations[operations.length - 1]
        })`
      );
    }

    // Apply final cleanup to ensure no digits are in the same position
    current = this.finalCleanup(target, current);

    this.log(`\n=== Transformation Complete ===`);
    this.log(`Final result: ${target} → ${current}`);
    this.log(`Operations applied: [${operations.join(", ")}]`);

    return {
      target,
      base: current,
      operations,
    };
  }

  generateLimitedMutationPool(): number[] {
    const poolSize = this.rng.nextInt(3, 5);
    const selectedNumbers = new Set<number>();

    this.log(`Generating mutation pool of size ${poolSize}`);

    while (selectedNumbers.size < poolSize) {
      const randomIndex = this.rng.nextInt(0, MUTATION_POOL.length - 1);
      selectedNumbers.add(MUTATION_POOL[randomIndex]);
    }

    const result = Array.from(selectedNumbers).sort();
    this.log(`Generated mutation pool: [${result.join(", ")}]`);
    return result;
  }

  generatePuzzle(): {
    target: string;
    base: string;
    operations: string[];
    mutationPool: string[];
    seed: number;
  } {
    this.log(`\n🎯 === GENERATING NEW PUZZLE ===`);
    this.log(`Using seed: ${this.rng.seed}`);

    const target = this.generateTarget();
    const limitedMutationPool = this.generateLimitedMutationPool();
    const result = this.transformToBase(target, limitedMutationPool);

    const puzzle = {
      ...result,
      mutationPool: [...new Set(limitedMutationPool.map((num) => num.toString()))],
      seed: this.rng.seed,
    };

    this.log(`\n🎯 === PUZZLE GENERATED ===`);
    this.log(`Target: ${puzzle.target}`);
    this.log(`Base: ${puzzle.base}`);
    this.log(`Mutation Pool: [${puzzle.mutationPool.join(", ")}]`);
    this.log(`Operations Used: [${puzzle.operations.join(", ")}]`);
    this.log(`Seed: ${puzzle.seed}`);

    return puzzle;
  }

  setSeed(seed: number): void {
    this.rng.setSeed(seed);
    this.log(`Seed updated to: ${seed}`);
  }

  setDebug(debug: boolean): void {
    this.debug = debug;
    this.log(`Debug mode ${debug ? "enabled" : "disabled"}`);
  }
}
