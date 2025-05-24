/**
 * Represents a food item displayed as a ring in a visual interface.
 * Each ring contains nutritional data like glycemic index (GI), carbohydrates, and glycemic load (GL).
 * When hovered over, the ring displays a info card. 
 */
class Ring {
  /**
   * Constructs a Ring object to visually represent a food item.
   *
   * @param {number} x - The x-coordinate where the ring will be displayed.
   * @param {number} y - The y-coordinate where the ring will be displayed.
   * @param {number} r - The radius of the ring (note: fixed to 40 in the constructor).
   * @param {string} title - The title/name of the food item (e.g., "100 Apple").
   * @param {number} gi - The glycemic index (GI) value of the food item.
   * @param {p5.Color} ringColor - The color used to draw the ring, representing GI severity.
   * @param {number} carbs - Carbohydrates in grams. May be null if unknown.
   * @param {number} GL - Glycemic Load. May be null if unknown.
   *
   * @returns {Ring} A new instance of the Ring class.
   */
  constructor(x, y, r, title, gi, ringColor, carbs, GL) {
    this.x = x;
    this.y = y;
    this.r = 40; //fixed radius for all rings
    this.title = title;
    this.gi = gi;
    this.ringColor = ringColor;
    this.carbs = carbs;
    this.GL = GL;
    this.card = null; 
  }

  /**
   * Checks for mouse hover and displays a UICard with detailed nutritional info.
   * Also updates the UICard's display if already active.
   */
  update() {
    //calculate distance between mouse and ring center
    let d = dist(mouseX, mouseY, this.x, this.y);

    //if hovered and card is not already shown, create a new UIcard with the respective info for each ring
    if (d < this.r / 2 && !this.card) {
      let warning = getGIWarning(this.gi);
      let carbText = this.carbs !== null ? `Carbs: ${this.carbs}g` : "Carbs: Unknown";
      let GLText = this.GL !== null ? `GL: ${this.GL}` : "GL: Unknown";
      
      //format title by splitting "100 Apple" into "100 - Apple"
      let displayTitle = this.title;
      let match = this.title.match(/^(\d+)\s+(.*)/);
      if (match) {
        displayTitle = `${match[1]} - ${match[2]}`; // e.g., "100 - Apple"
      }
      //creates the UI card to show detailed info
      this.card = new UICard(
        width / 2 - 150, 
        height / 2 - 100, 
        300, 
        200,
        displayTitle, 
        "GI Index: " + this.gi + "\n" + warning + "\n" + carbText + "\n" + GLText //card body text
      );
    }
    
    if (this.card) {
      this.card.update();
    }
  }

  /**
   * Renders the ring on the canvas.
   * If a UICard is active, it is displayed instead of the ring.
   */
  display() {
    //only display the ring if the card is not being currently shown
    if (!this.card) {
      noFill();
      stroke(this.ringColor);
      strokeWeight(4);
      ellipse(this.x, this.y, this.r); //draw the ring as a circle with no fill
    }
    
    //display the UI card if it exists
    if (this.card) {
      this.card.display();
    }
  }
  /**
   * Handles mouse press events, allowing users to close the UI card.
   * If the close icon on the card is hovered and clicked, the card is dismissed.
   */
  handleMousePressed() {
    if (this.card && this.card.closeHovered()) {
      this.card = null; //closes the card
    }
  }
}

/**
 * Returns a health recommendation message based on the glycemic index value.
 *
 * @param {number} gi - The glycemic index of the food.
 * @returns {string} - A message advising how often the food should be consumed.
 */
function getGIWarning(gi) {
  if (gi <= 55) return "🟢 Go! Choose most often.";
  else if (gi <= 69) return "🟡 Caution. Choose less often.";
  else return "🔴 Stop & think. Choose least often.";
}