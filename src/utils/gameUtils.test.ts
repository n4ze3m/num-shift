import { describe, test, expect, vi } from 'vitest';
import { generateDailyPuzzle, seedRandom } from './gameUtils';

describe('generateDailyPuzzle', () => {
  test('generates a valid puzzle with base number different from target number', () => {
    // Mock the Date to ensure consistent tests
    const mockDate = new Date('2023-05-15');
    vi.spyOn(global, 'Date').mockImplementation(() => mockDate);
    
    const puzzle = generateDailyPuzzle();
    
    // Check if base and target numbers have the same length
    expect(puzzle.baseNumber.length).toBe(puzzle.targetNumber.length);
    
    // Count how many digits are in the same position
    let samePositionCount = 0;
    for (let i = 0; i < puzzle.targetNumber.length; i++) {
      if (puzzle.baseNumber[i] === puzzle.targetNumber[i]) {
        samePositionCount++;
      }
    }
    
    // Ensure almost no digits are in the same position (at most 1)
    expect(samePositionCount).toBeLessThanOrEqual(1);
    console.log(`Base number: ${puzzle.baseNumber}, Target number: ${puzzle.targetNumber}, Same positions: ${samePositionCount}`);
    
    // Reset the Date mock
    vi.restoreAllMocks();
  });
  
  test('multiple puzzle generations always create base numbers with few matching positions', () => {
    // Run multiple puzzle generations to ensure consistency
    for (let i = 0; i < 10; i++) {
      const puzzle = generateDailyPuzzle();
      
      let samePositionCount = 0;
      for (let j = 0; j < puzzle.targetNumber.length; j++) {
        if (puzzle.baseNumber[j] === puzzle.targetNumber[j]) {
          samePositionCount++;
        }
      }
      
      expect(samePositionCount).toBeLessThanOrEqual(1);
    }
  });
  
  test('seedRandom produces consistent results for the same seed', () => {
    const random1 = seedRandom('test-seed');
    const random2 = seedRandom('test-seed');
    
    // Generate multiple values and compare
    for (let i = 0; i < 10; i++) {
      expect(random1()).toBe(random2());
    }
  });
  
  test('seedRandom produces different results for different seeds', () => {
    const random1 = seedRandom('seed-1');
    const random2 = seedRandom('seed-2');
    
    // The odds of all 10 values being exactly the same are extremely low
    let allSame = true;
    for (let i = 0; i < 10; i++) {
      if (random1() !== random2()) {
        allSame = false;
        break;
      }
    }
    
    expect(allSame).toBe(false);
  });
});