/**
 * Represents a moderately risky food item based on its GI value.
 * Extends the base `Ring` class by adding a subtle pulsing animation
 * to visually signal caution.
 */

class MediumRiskRing extends Ring {
  /**
   * Constructs a MediumRiskRing object with a pulsing effect.
   * 
   * @param {number} x - The x-coordinate where the ring will be displayed.
   * @param {number} y - The y-coordinate where the ring will be displayed.
   * @param {number} r - The intended radius for pulsing base calculation.
   * @param {string} title - The name of the food item.
   * @param {number} gi - The glycemic index of the item.
   * @param {p5.Color} ringColor - The color used to represent this ring.
   * @param {number} baseRadius - The radius of this ring is slightly increased.
   * 
   * @returns {MediumRiskRing} A new instance of MediumRiskRing.
   */
  constructor(x, y, r, title, gi, ringColor) {
    super(x, y, r, title, gi, ringColor); //calls grandparent class constructor
    this.baseRadius = r* 0.75; 
  }

  /**
   * Displays the pulsing ring on the canvas.
   * If a card is active (on hover), displays the detailed info card instead.
   */
  display() {
    if (!this.card) {
      let pulse = sin(frameCount * 0.1) * 6; //create a smooth oscillating pulse effect
      noFill();
      stroke(this.ringColor);
      strokeWeight(4);
      ellipse(this.x, this.y, this.baseRadius + pulse); //draw ring with animated radius
    }

    if (this.card) {
      this.card.display();
    }
  }
}
