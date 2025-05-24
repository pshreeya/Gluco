/**
 * Represents a highly risky food item with urgent GI warning.
 * Extends `MediumRiskRing` by adding a flashing visual effect and
 * thick border on hover to draw urgent attention.
 */

class UrgentRiskRing extends MediumRiskRing {
  /**
   * Constructs an UrgentRiskRing object with flashing animation and hover effects.
   * 
   * @param {number} x - X-position of the ring.
   * @param {number} y - Y-position of the ring.
   * @param {number} r - Base radius for the ring's pulsing and flashing.
   * @param {string} title - Title of the food (e.g., "100 Banana").
   * @param {number} gi - Glycemic Index value.
   * @param {p5.Color} ringColor - Ring stroke color for visual cues.
   * @param {boolean} hovering - Tracks if the mouse is hovering over this ring 
   * 
   * @returns {UrgentRiskRing} A new instance of UrgentRiskRing.
   */
  constructor(x, y, r, title, gi, ringColor) {
    super(x, y, r, title, gi, ringColor); //calls the MediumRiskRing (parent) class constructor
    this.hovering = false; 
  }

  /**
   * Updates the ring's state. Checks for mouse hover and updates visual card.
   * Also invokes the parent class’s update method to manage the UI card logic.
   */
  update() {
    //checks if the mouse is hovering near the ring center
    let d = dist(mouseX, mouseY, this.x, this.y);
    this.hovering = (d < this.baseRadius / 2.5);

    //calls Ring class's update (via MediumRiskRing class)
    super.update();
  }
  
  /**
   * Displays the flashing ring. If hovered, the ring becomes thicker.
   * If the UI card is active, it overrides the ring and displays the info card.
   */
  display() {
  if (!this.card) {
    //flashing effect using sine wave and altering transparency
    let alpha = map(sin(frameCount * 0.3), -1, 1, 100, 255); 
    stroke(this.ringColor.levels[0], this.ringColor.levels[1], this.ringColor.levels[2], alpha);
    strokeWeight(this.hovering ? 8 : 5); //thicker boarder if hovered
    noFill();
    ellipse(this.x, this.y, this.baseRadius + 5); //flashing ring is created
  }

  if (this.card) {
    this.card.display();
  }
 }
}
