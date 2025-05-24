/*
  Name: Gluco Web Application
  Purpose: To visualize the glycemic indexes of various foods, helping both diabetic and non-diabetic people understand how different foods may impact their blood sugar levels.
  Author:  Shreeya Prasanna
  Created: 12-May-2025
  Updated: 23-May-2025
*/

//initializing global variables of arrays and variables
let rings = []; 
let originalRings = [];
let sortedRingsByCarbs = [];
let foodData;
let searchInput;
let button;
let showMealPlan = false;
let suggestedMeals = [];
let resetButton;

/**
 * Preloads the food data csv file and close icon beforehand.
 */
function preload() {
  foodData = loadTable('Table1.csv', 'csv', 'header')
  closeImg = loadImage('assets/close.png'); 
}

/**
 * Sets up the canvas for visualization, processes the CSV data to create ring objects and sets up UI elements.
 */
function setup() {
  createCanvas(windowWidth, windowHeight);
  //layout of the grid the rings will be organized in
  let spacing = 100; 
  let index = 1;
  let maxItems = 1879; //total number of food items

  let currentCuisine = ""; //tracks the current cuisine category
  
  //loops through each row in the food data CSV file
  for (let i = 0; i < foodData.getRowCount(); i++) {
      if (index >= maxItems) break; //stops if maximum number of items is reached

      let dataRow  = foodData.getRow(i); 
      let col0 = dataRow.getString(0)?.trim()
      
      //skips rows with empty first column
      if (!col0) continue;

      let col1 = dataRow.getString(1)?.trim() || ""; 
     
      let name;
      if (/^\d+$/.test(col0)) {
        name = `${col0} ${col1}`; 
      } else {
        name = col0; //sets the first column value as the name
      }

      let giStr = dataRow .getString(3); //gets the GI value in column 3
      
      //updates the current cuisine if the name matches a certain pattern
      if (!giStr && /[A-Z\s&/]+$/.test(name)) {
        currentCuisine = name.toLowerCase(); 
        continue;
      }
      
      //skips entries that are headers of invalid (eg; continued descriptions)
      if (!name || name.toLowerCase().includes("food") ||    name === "" || !giStr) continue;
      if (!/^\d/.test(name)) continue; //skips if name doesn't start with a number
      
      //parses the GI value by removing characters like "�"
      let giMatch = giStr.match(/\d+(\.\d+)?/);
      let gi = giMatch ? parseFloat(giMatch[0]) : NaN;
      if (isNaN(gi)) continue;

      //parses carbohydrate data from column 11
      let carbStr = dataRow.getString(11);
      let carbMatch = carbStr?.match(/\d+(\.\d+)?/);
      let carbs = carbMatch ? parseFloat(carbMatch[0]) : NaN
      
      //parses GL data from column 12
      let GLStr = dataRow.getString(12);
      let GLMatch = GLStr?.match(/\d+(\.\d+)?/);
      let GL = GLMatch ? parseFloat(GLMatch[0]) : NaN;
      
      //calculates grid coordinates for each ring
      let cols = Math.floor(width /spacing);
      let topMargin = 65;
      let x = spacing / 2 + ((index - 1) % cols) * spacing;
      let y = topMargin + spacing / 2 + Math.floor((index - 1) / cols) * spacing;
    
      let color = getColorByGI(gi); //determines the color of ring based on GI value

      let ring;
      //creates the ring object based on GI value
      if (gi <= 55) {
        ring = new Ring(x, y, 80, name, gi, color, carbs, GL);
      } else if (gi <= 69) {
        ring = new MediumRiskRing(x, y, 80, name, gi, color);
      } else {
        ring = new UrgentRiskRing(x, y, 80, name, gi, color);
      }
      
      rings.push(ring); //adding ring objects to the array
      //stores original x and y coordinate of each ring
      ring.origX = x; 
      ring.origY = y;
      ring.cuisine = currentCuisine;
      ring.carbs = carbs;
      ring.GL = GL
      index++;
  }
  originalRings = rings.slice(); //creates a copy of the original 'ring' array

  //setting up sorting dropdown menu
  let sortSelect = select('#sortSelect');
  sortSelect.changed(() => {
  let val = sortSelect.value();

  if (val === "gi") {
    quickSortRings(); //sorting rings by GI values
    repositionRings(false); 
  } 
  //filtering rings based on color 'buckets'
  else if (val === "green" || val === "yellow" || val === "red") {
    let greenRings = originalRings.filter(r => r.gi <= 55);
    let yellowRings = originalRings.filter(r => r.gi > 55 && r.gi <= 69);
    let redRings = originalRings.filter(r => r.gi > 69);

    if (val === "green") {
      rings = greenRings.concat(yellowRings, redRings);
    } else if (val === "yellow") {
      rings = yellowRings.concat(greenRings, redRings);
    } else {
      rings = redRings.concat(yellowRings, greenRings);
    }

    repositionRings(false); //updates each of the ring positions
  } else {
    //when this option is clicked: "-- Select --", the rings reset to their original order
    rings = originalRings.slice();
    repositionRings(true);
  }
  });

  //setting up search input
  searchInput = select('#searchInput');
  searchInput.input(() => {
    triggerSearch(); //performs the search based on the input
  });

  searchInput.elt.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();  
    triggerSearch(); 
    }
  });
  
  //setting up cuisine filter radio buttons
  let cuisineRadios = selectAll('input[name="cuisine"]');
  for (let radio of cuisineRadios) {
  //this linear search algorithm iterates over every ring in original rings array, for each one checking if the cuisine category is matched 
  radio.mousePressed(() => {
    let selected = radio.value().toLowerCase();
    if (!selected) {
      rings = originalRings.slice(); //reset rings
    } else {
      rings = originalRings.filter(r => r.cuisine && r.cuisine.includes(selected)); //filters the rings based on the cuisine if matched
    }
    repositionRings(false);
  });
 }

  //sorting the rings based on carbohydrate content
  sortedRingsByCarbs = [...originalRings].filter(r => !isNaN(r.carbs)).sort((a, b) => a.carbs - b.carbs);
  
  //creating and styling the 'Suggest Meal Plan' button 
  button = createButton("Suggest Meal Plan");
  button.position((windowWidth - button.width) / 2, 145);
  button.style('padding', '8px 14px');
  button.style('background-color', '#007bff');
  button.style('color', 'white');
  button.style('border', 'none');
  button.style('border-radius', '6px');
  button.style('cursor', 'pointer');
  button.style('font-size', '14px');
  button.style('box-shadow', '0 2px 5px rgba(0,0,0,0.15)');
  button.style('transition', 'background-color 0.3s, transform 0.2s');
  
  //hover effects for the button
  button.mouseOver(() => {
    button.style('background-color', '#0056b3');
    button.style('transform', 'scale(1.03)');
  });
  button.mouseOut(() => {
    button.style('background-color', '#007bff');
    button.style('transform', 'scale(1)');
  });
  
  //handles the button click to suggest a meal plan
  button.mousePressed(() => {
  suggestMeal(); //generates meal suggestions
  rings = suggestedMeals; //displays suggested meals
  showMealPlan = true;

  //creating a reset button to revert back to the main layout
  if (!resetButton) {
    resetButton = createButton("Reset");
    resetButton.position((windowWidth - resetButton.width) / 2 + 150, 145); 
    resetButton.style('padding', '8px 14px');
    resetButton.style('background-color', '#6c757d');
    resetButton.style('color', 'white');
    resetButton.style('border', 'none');
    resetButton.style('border-radius', '6px');
    resetButton.style('cursor', 'pointer');
    resetButton.style('font-size', '14px');
    resetButton.style('box-shadow', '0 2px 5px rgba(0,0,0,0.15)');
    resetButton.style('transition', 'background-color 0.3s, transform 0.2s');

    //hover effects for the reset button
    resetButton.mouseOver(() => {
      resetButton.style('background-color', '#5a6268');
      resetButton.style('transform', 'scale(1.03)');
    });

    resetButton.mouseOut(() => {
      resetButton.style('background-color', '#6c757d');
      resetButton.style('transform', 'scale(1)');
    });
    
    //handles reset button click
    resetButton.mousePressed(() => {
      rings = originalRings.slice(); //resets rings
      repositionRings(true);
      showMealPlan = false;
      suggestedMeals = []; //clears suggested meals

      //removes the reset button itself
      resetButton.remove();
      resetButton = null;
    });
   }
  });
 };


/**
 * Continuously renders the rings and the food UI cards for each ring. 
 */
function draw() {
  background(200);
  let activeCard = null;
    //main ring rendering
    for (let ring of rings) {
      ring.update(); //updating the animations for the ring
      ring.display(); //draws the ring
      
      //tracking the current info food card that is being displayed for a ring
      if (ring.card) {
        activeCard = ring.card;
      }
    }
  
  if (activeCard) activeCard.display();
  
  //the following layout appears if the user has clicked on the 'Suggest Meal Plan' button
  if (showMealPlan) {
    fill(0);
    textSize(16);
    textAlign(CENTER);
    noStroke();
    text("Everyday it is important for diabetic patients and people in general to consume a daily glycemic load (GL) of 100 or less.", width / 2, 220);

    let totalGL = suggestedMeals.reduce((sum, m) => sum + m.GL, 0);
    textSize(18);
    noStroke();
    text(`Total Glycemic Load (GL): ${totalGL}`, width / 2, 250);
    
    //showing and positioning only 3 suggested meals visually
    let spacing = 100;
    let centerX = width / 2;
    let centerY = 350;

    let activeCard = null;

    //loops through each of the 3 suggested meals to render them 
    for (let i = 0; i < suggestedMeals.length; i++) {
    let ring = suggestedMeals[i];
    
    //positioning each ring near the center, spaced evenly 
    ring.x = centerX + (i - 1) * spacing;
    ring.y = centerY;
    
    ring.update();
    ring.display();
    
    if (ring.card) {
      activeCard = ring.card;
    }
  }

  if (activeCard) {
    activeCard.display();
  }

  } else {
    //default view is maintained when the user doesn't click on 'Suggest Meal Plan' button
    let activeCard = null;
    for (let ring of rings) {
      ring.update();
      ring.display();

      if (ring.card) {
        activeCard = ring.card;
      }
    }

    if (activeCard) activeCard.display();
  }
}

/**
 * Handles mouse press events.
 */
function mousePressed() {
  //when 'Suggest Meal Plan' button is clicked, allow users to see the food info card for only the suggested meals
  if (showMealPlan) {
    suggestedMeals.forEach(ring => ring.handleMousePressed());
  } else {
    //otherwise, allow for all rings
    rings.forEach(ring => ring.handleMousePressed());
  }
}

/**
 * Returns a color based on Glycemic Index (GI) value.
 * 
 * @param {number} gi - Glycemic Index value.
 * @returns {p5.Color} - A color object representing the GI range.
 */
function getColorByGI(gi) {
  if (gi <= 55) return color(100, 200, 100); // green
  else if (gi <= 69) return color(255, 215, 0); // yellow
  else return color(255, 100, 100); // red
}

/**
 * Sorts the rings array in ascending order by Glycemic Index (GI) using the QuickSort sorting algorithm.
 * 
 * @param {number} [start=0] - Starting index.
 * @param {number} [end=rings.length - 1] - Ending index.
 * @returns {void}
 */
function quickSortRings(start = 0, end = rings.length - 1) {
  if (start >= end) return;
  let index = partition(start, end); //partitions the array and gets the pivot index
  quickSortRings(start, index - 1); //sorts left side
  quickSortRings(index + 1, end); //sorts right side
}

/**
 * Partitions the rings array to perform the QuickSort sorting algorithm. 
 * Moves items less than pivot to the left of it and vice versa.
 * 
 * @param {number} start - Starting index.
 * @param {number} end - Ending index.
 * @returns {number} - Index position of the pivot.
 */
function partition(start, end) {
  let pivot = rings[end].gi; //uses GI value of the last food item as pivot
  let i = start - 1;

  for (let j = start; j < end; j++) {
    //checks if food item's GI value is less than pivot
    if (rings[j].gi < pivot) {
      i++; //moves pivot one step to the right
      [rings[i], rings[j]] = [rings[j], rings[i]]; //swaps to move the smaller item to the left
    }
  }
  [rings[i + 1], rings[end]] = [rings[end], rings[i + 1]]; 
  return i + 1; 
}
/**
 * Repositions rings by resetting them to their respective original positions.
 * 
 * @param {boolean} [revert=false] - If true, reverts to original coordinates.
 * @returns {void}
 */
function repositionRings(revert = false) {
  let spacing = 100;
  let cols = Math.floor(width / spacing); //maximum rings per row
  let topMargin = 65;

  for (let i = 0; i < rings.length; i++) {
    if (revert) {
      //restore original x and y coordinates if revert = true
      rings[i].x = rings[i].origX;
      rings[i].y = rings[i].origY;
    } else {
      //arrange the rings in a responsive grid layout
      let x = spacing / 2 + (i % cols) * spacing;
      let y = topMargin + spacing / 2 + Math.floor(i / cols) * spacing;
      rings[i].x = x;
      rings[i].y = y;
    }
  }
}

/**
 * Triggers a search through rings based on specific carbohydrate search query inputs.
 */
function triggerSearch() {
  let query = searchInput.value().toLowerCase().trim(); //gets and trims the user input
  if (!query) {
    //if input is empty, restore to original rings position
    rings = originalRings.slice();
    repositionRings(true);
    return;
  }
  //match the search results only for queries like "under 30g of carbs" or "greater than 40g of carbs"
  let carbUnderMatch = query.match(/under\s*(\d+)\s*g\s*of\s*carbs/i);
  let carbOverMatch = query.match(/greater\s*than\s*(\d+)\s*g\s*of\s*carbs/i);

  let resultRings = originalRings;

  if (carbUnderMatch || carbOverMatch) {
    //extract threhold and direction (greater or less than X carbs) of search
    let threshold = parseFloat(carbUnderMatch ? carbUnderMatch[1] : carbOverMatch[1]);
    let isUnder = !!carbUnderMatch;

    //perform binary search
    resultRings = binarySearchCarbs(threshold, isUnder);
  }

  rings = resultRings; //updates rings and their respective positions to show the results
  repositionRings(false);
}

/**
 * Performs a binary search on sorted rings by carbohydrates content to filter based on the specific search query.
 * 
 * @param {number} target - Carbohydrate threshold.
 * @param {boolean} [isUnder=true] - If true, find rings under the threshold.
 * @returns {Ring[]} - Filtered array of rings.
 */
function binarySearchCarbs(target, isUnder = true) {
  let low = 0;
  let high = sortedRingsByCarbs.length - 1;
  let result = -1;

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    let carbs = sortedRingsByCarbs[mid].carbs;

    if (isUnder) {
      //find the highest index where carbs are less than the target
      if (carbs < target) {
        result = mid;
        low = mid + 1; //move to the right to find a larger candidate
      } else {
        high = mid - 1;
      }
    } else {
      //find the lowest index where carbs are greater than the target
      if (carbs > target) {
        result = mid;
        high = mid - 1; //move left to find smaller candidate that is still greater than target
      } else {
        low = mid + 1;
      }
    }
  }

  if (result === -1) return []; //no match found
  
  //return a filtered slice of the array of only the matching rings 
  if (isUnder) {
    return sortedRingsByCarbs.slice(0, result + 1);
  } else {
    return sortedRingsByCarbs.slice(result);
  }
}

/**
 * Suggests a combination of three meals using a recurcion algorithm. The three meals should have a total Glycemic Load (GL) that is less than or equal to 100. 
 * 
 * @returns {void}
 */
function suggestMeal() {
  suggestedMeals = [];

  //shuffle the array of original rings to randomize the meal suggestions 
  let candidates = shuffle(originalRings.filter(r => !isNaN(r.GL))); //filters out any rings that don't have a valid GL value
  
  /**
   * Recursively attempts to pick a valid combination of 3 meals from the filtered/shuffled (candidates) rings.
   * 
   * @param {Ring[]} selected - The current array of selected meals.
   * @param {number} startIndex - Index to start picking from the filtered/shuffled rings 
   * @param {number} currentGL - The running total of the GL of current selection
   * @returns {boolean} - True if a valid combination is found, otherwise false
   */
  function pickMealsRecursive(selected = [], startIndex = 0, currentGL = 0) {
    //checks to see if 3 meals have a total GL of less than or equal to 100 and then stores it
    if (selected.length === 3 && currentGL <= 100) {
      suggestedMeals = selected; //stores the valid meal combination
      return true;
    }

    //checks if there are too many meals, too much GL, or no candidates left and exits
    if (startIndex >= candidates.length || selected.length > 3 || currentGL > 100) {
      return false;
    }
    
    //loops through each of the candidates 
    for (let i = startIndex; i < candidates.length; i++) {
      let ring = candidates[i];

      //skip if the candidate is invalid
      if (!ring || isNaN(ring.GL)) continue;
      
      //adds this candidate to the current selection and updates the running total of the GL
      let newSelected = [...selected, ring];
      let newGL = currentGL + ring.GL;
      
      //if a valid combination is found down this path, then recursion is stopped
      if (pickMealsRecursive(newSelected, i + 1, newGL)) {
        return true; 
      }
    }

    return false; //no valid combination found
  }

  pickMealsRecursive(); //initiates the recursive algorithm
}





