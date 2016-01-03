class Mansion extends Building {

    constructor(game, position) {
        super(game, position);

        // mansion shape
        let mansion = this.game.assets['mansion'];
        this.position = mansion.position;
        mansion.position = BABYLON.Vector3.Zero();
        this.addChildren(mansion);

        // Timer to update the building proce
        this.priceTimer = new Timer(100, this.getScene(), {autodestroy:true, repeat:-1});
        this.priceTimer.callback = () => {
            this.updatePrice();
        };

        this.basePrice = 10000;

        // Has this building been bought ?
        this.bought = false;


        this.setReady();

        this.priceTimer.start();
        this.displayPrice();
    }

    /**
     *
     */
    buy() {
        this.game.win();
    }

    stop() {
        this.priceTimer.stop();
    }


}