import { generateDailyPuzzle, calculateOptimalMoves } from './gameUtils';

/**
 * Generates a puzzle for a specific date and tests solution movements
 * @param daysInFuture Number of days in the future to generate the puzzle for
 * @returns Test results including the puzzle and solution information
 */
export function runQATest(daysInFuture: number = 0) {
  // Override the Date.prototype.toDateString to return our future date
  const originalToDateString = Date.prototype.toDateString;
  
  // Create future date
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysInFuture);
  const futureDateString = futureDate.toDateString();
  
  // Mock the date function
  Date.prototype.toDateString = function() {
    return futureDateString;
  };

  try {
    // Generate the puzzle with our mocked date
    const puzzle = generateDailyPuzzle();
    
    // Calculate optimal moves
    const optimalMoves = calculateOptimalMoves(puzzle.baseNumber, puzzle.targetNumber);
    
    // Log the test results
    console.log(`===== QA TEST RESULTS (${futureDateString}) =====`);
    console.log(`Base Number: ${puzzle.baseNumber}`);
    console.log(`Target Number: ${puzzle.targetNumber}`);
    console.log(`Optimal Moves: ${optimalMoves}`);
    console.log(`Max Attempts: ${puzzle.maxAttempts}`);
    console.log(`Mutation Pool: ${puzzle.mutationPool.join(', ')}`);
    console.log(`Available Mutations: ${puzzle.availableMutations.join(', ')}`);
    
    // Compare digit positions
    let samePositionCount = 0;
    for (let i = 0; i < puzzle.baseNumber.length; i++) {
      if (puzzle.baseNumber[i] === puzzle.targetNumber[i]) {
        samePositionCount++;
      }
    }
    console.log(`Same Position Count: ${samePositionCount}`);
    
    return {
      date: futureDateString,
      puzzle,
      optimalMoves
    };
  } finally {
    // Restore the original date function
    Date.prototype.toDateString = originalToDateString;
  }
}

// Helper function to run tests for multiple future days
export function runMultipleDayTests(days: number = 7) {
  const results = [];
  
  for (let i = 0; i < days; i++) {
    console.log(`\nTesting puzzle for ${i} days in the future:`);
    results.push(runQATest(i));
  }
  
  return results;
}
