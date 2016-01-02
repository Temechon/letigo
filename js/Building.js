/**
 * A building is a structure that can be bought by the player.
 * House and Mansion are two directs subclasses
 */
class Building extends GameObject{

    constructor(game, position) {
        super(game);

        // Building position
        this.position = position.position;

        // Position Object
        this._position = position;

        // Knowing if the price is rising of decreasing)
        this._oldPrice = 0;
        this._oldArrow = null;

        // The current price of this building
        this.price = 0;
        this.basePrice = 1000;
        let dr = this.basePrice/4;

        // Time to compute the building price
        this._time = 0;

        this.parameters = [
            0, //Math.random() < 0.5 ? -1 : 1, //inflation
            Game.randomNumber(this.basePrice-dr, this.basePrice+dr), // range
            Math.random(), // frequency 1
            Math.random(), // frequency 2
            Math.random()  // frequency 3
        ];

        // Arrows
        this.arrowTag = document.createElement('i');

        // Price label
        this.priceText = document.createElement('span');
        this.priceText.innerHTML = this.basePrice;

        this.priceTag = document.createElement('div');
        this.priceTag.className = 'priceTag';
        this.priceTag.appendChild(this.priceText);
        this.priceTag.appendChild(this.arrowTag);
    }

    getPositionId() {
        return this._position.id;
    }

    displayPrice() {
        document.getElementsByTagName('body')[0].appendChild(this.priceTag);
        var p = this._project();

        // center horizontally
        p.x -= this.priceTag.clientWidth / 2;

        this.priceTag.style.top = Math.floor(p.y) + "px";
        this.priceTag.style.left = Math.floor(p.x) + "px";
    }

    updatePrice() {
        this._oldPrice = this.price;
        this._time += 0.01;
        this.price = Math.floor(
            this.basePrice
            + 1 //this.parameters[0] // inflation
            * this.parameters[1] // range
            * Math.sin(this.parameters[2]*this._time) // frequency 1
            //* Math.cos(this.parameters[3]*this._time)
            //* Math.sin(this.parameters[4]*this._time)
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

    dispose() {

        // remove price tags
        if (this.priceTag.parentNode) {
            this.priceTag.parentNode.removeChild(this.priceTag);
        }
        super.dispose();
    }

    /**
     * Returns screen coordinates of the building
     */
    _project() {
        var tmpPos = this.position.clone();
        return BABYLON.Vector3.Project(
            tmpPos,
            BABYLON.Matrix.Identity(),
            this.getScene().getTransformMatrix(),
            this.getScene().activeCamera.viewport.toGlobal(this.getScene().getEngine())
        );
    };
}