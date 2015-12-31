// The function onload is loaded when the DOM has been loaded
window.addEventListener("DOMContentLoaded", function() {
    new Game('game-canvas');
});


class Game {
    constructor(canvasId) {

        let canvas          = document.getElementById(canvasId);
        this.engine         = new BABYLON.Engine(canvas, true, null, false);

        // Contains all loaded assets needed for this state
        this.assets  = [];

        // The state scene
        this.scene   = null;

        // Positions on cells that can be built on
        this.availablePositions = [];

        // Positions with a building on it
        this.takenPositions = [];

        // Resize window event
        window.addEventListener("resize", () => {
            this.engine.resize();
        });

        this.run();

    }
    _initScene() {

        let scene = new BABYLON.Scene(this.engine);
        // Camera attached to the canvas
        let camera = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(9.4, 15, -14), scene);
        camera.rotation.x = 0.5;
        camera.attachControl(this.engine.getRenderingCanvas());

        // Hemispheric light to light the scene
        let h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0,1,0), scene);
        h.intensity = 0.9;
        return scene;
    }

    run() {

        this.scene = this._initScene();

        // The loader
        let loader =  new BABYLON.AssetsManager(this.scene);

        //    var meshTask = this.loader.addMeshTask("skull task", "", "./assets/", "block02.babylon");
        //    meshTask.onSuccess = this._initMesh;

        loader.onFinish = () => {

            // Init the game
            this._initGame();

            // The state is ready to be played
            this.isReady = true;

            this.engine.runRenderLoop(() => {
                this.scene.render();
            });
        };

        loader.load();
    }

    _initGame() {

        window.addEventListener("keydown", (evt) => {
            if (evt.keyCode == 32) {
                if (this.scene.debugLayer._enabled) {
                    this.scene.debugLayer.hide();
                } else {
                    this.scene.debugLayer.show();
                }
            }
        });


        for (let x=0; x<5; x++) {
            for (let z=0; z<5; z++) {
                let cell = new Cell(this);
                cell.updatePosition(new BABYLON.Vector3(x*5, 0, z*5));
                this.availablePositions.push(...cell.positions);
            }
        }
        setInterval(() => {
            this.build(this.getRandomPosition());
        }, 200);
    }

    /**
     * Returns an integer in [min, max[
     */
    static _randomNumber(min, max) {
        if (min === max) {
            return (min);
        }
        let random = Math.random();
        return Math.floor(((random * (max - min)) + min));
    }

    /**
     * Returns a random available position, removes it from availablePositions
     * and push it to takenPositions
     * @returns {T}
     */
    getRandomPosition() {
        let ind = Game._randomNumber(0,this.availablePositions.length);
        let res = this.availablePositions.splice(ind, 1)[0];
        this.takenPositions.push(res);
        return res;
    }

    build(position) {
        if (position) {
            let b = new Building(this, position);
            b.spawn();
        }
    }

}
