/**
 * A building is a structure that can be bought by the player.
 * House and Mansion are two directs subclasses
 */
class Building extends GameObject{

    constructor(game, position) {
        super(game);

        // Building position
        this.position = position;

        // Knowing if the price is rising of decreasing)
        this._oldPrice = 0;
        this._oldArrow = null;

        // The current price of this building
        this.price = 0;
        this.basePrice = 1000;
        let dr = this.basePrice/4;

        this.parameters = [
            Game.randomNumber(-7,7), //inflation
            Game.randomNumber(this.basePrice-dr, this.basePrice+dr), // range
            Math.random(), // frequency 1
            Math.random(), // frequency 2
            Math.random()  // frequency 3
        ];

        // Arrows
        //this.arrowTag = document.createElement('i');
        //
        //// Price label
        //this.priceText = document.createElement('span');
        //this.priceText.innerHTML = '99999';
        //
        //this.priceTag = document.createElement('div');
        //this.priceTag.className = 'priceTag';
        //this.priceTag.appendChild(this.priceText);
        //this.priceTag.appendChild(this.arrowTag);
    }

    displayPrice() {
        document.getElementsByTagName('body')[0].appendChild(this.priceTag);
        var p = this._project();

        p.y += this.priceTag.clientHeight / 2;
        p.x -= this.priceTag.clientWidth / 2;

        this.priceTag.style.top = Math.floor(p.y) + "px";
        this.priceTag.style.left = Math.floor(p.x) + "px";
    }

    updatePrice() {
        this._oldPrice = this.price;
        this.time += 0.005;
        this.price = Math.floor(
            this.basePrice +
            this.parameters[0]*this.time+
            this.parameters[1]*
            Math.sin(this.parameters[2]*this.time) *
            Math.cos(this.parameters[3]*this.time) *
            Math.sin(this.parameters[4]*this.time)
        );

        let arrow = this._oldArrow;
        if (this._oldPrice > this.price) {
            arrow ='fa fa-arrow-down';
            this._oldArrow = arrow;
        } else if (this._oldPrice < this.price) {
            arrow ='fa fa-arrow-up';
            this._oldArrow = arrow;
        }
        // display
        this.arrowTag.className = arrow;
        this.priceText.innerHTML = this.price;
    }
}