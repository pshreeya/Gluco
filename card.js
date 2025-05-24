/**
 * Represents an interactive information card shown when a ring is clicked or hovered.
 * Displays a title and description with hover-based scale animation and a close button.
 */
class UICard {
  /**
   * Constructs a UICard object to show details of a food item.
   * 
   * @param {number} x - The x-coordinate (top-left corner) of the card.
   * @param {number} y - The y-coordinate (top-left corner) of the card.
   * @param {number} w - The width of the card.
   * @param {number} h - The height of the card.
   * @param {string} title - The title text (e.g., food item name).
   * @param {string} description - The detailed description (e.g., GI, GL, warnings).
   * @param {boolean} hovered - True when mouse is over the card, otherwise false
   * @param {number} scale - Scale used for hover animation
   * @param {number} closeSize - Size of the close button icon
   * 
   * @returns {UICard} A new instance of UICard.
   */
  constructor(x, y, w, h, title, description) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.title = title;
    this.description = description;
    this.hovered = false; 
    this.scale = 1; 
    this.closeSize = 24; 
  }

  /**
   * Updates the hover state and applies smooth scaling animation.
   * If the mouse is over the card, it scales up slightly.
   */
  update() {
    this.hovered = mouseX > this.x && mouseX < this.x + this.w &&
                   mouseY > this.y && mouseY < this.y + this.h;
    
    this.scale = lerp(this.scale, this.hovered ? 1.05 : 1, 0.1);
  }
  
  /**
   * Renders the card on the screen with title, description, and a close button.
   * Card slightly scales on hover, and visually changes background color.
   */
  display() {
    push(); 
    //center the card and apply scale
    translate(this.x + this.w / 2, this.y + this.h / 2);
    scale(this.scale);
    //draw background
    rectMode(CENTER);
    noStroke();
    fill(this.hovered ? '#e3e3e3' : '#f5f5f5'); //subtle color change on hover
    rect(0, 0, this.w, this.h, 20); 
    
    //draw title and description
    fill(50);
    textAlign(CENTER, CENTER);
    
    //title with text wrapping
    textSize(16);
    text(this.title, 0, -this.h * 0.3, this.w * 0.8, this.h * 0.25);
    
    //description with text wrapping
    textSize(12);
    text(this.description, 0, this.h * 0.1, this.w * 0.8, this.h * 0.5);
    
    pop();
    
    //draw close button icon in top-right corner
    imageMode(CORNER);
    image(closeImg, this.x + this.w - this.closeSize - 10, this.y + 10, this.closeSize, this.closeSize);
  }
  
  /**
   * Checks if the mouse is currently hovering over the close (X) button.
   * 
   * @returns {boolean} True if the close button is hovered, false otherwise.
   */
  closeHovered() {
    let cx = this.x + this.w - this.closeSize - 10;
    let cy = this.y + 10;
    return mouseX > cx && mouseX < cx + this.closeSize &&
           mouseY > cy && mouseY < cy + this.closeSize;
  }
}