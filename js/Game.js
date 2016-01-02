// The function onload is loaded when the DOM has been loaded
window.addEventListener("DOMContentLoaded", () => {


    setTimeout(() => {
        // check that the window.screen.show method is available
        if (window.screen.show) {
            window.screen.show();
        }
        new Game('game-canvas');
    }, 2500);
});


class Game {
    constructor(canvasId) {

        let canvas          = document.getElementById(canvasId);
        this.engine         = new BABYLON.Engine(canvas, true, null, false);

        // Contains all loaded assets needed for this state
        this.assets  = [];

        // The state scene
        this.scene   = null;

        // Positions on cells that can be built on ([Position])
        this.availablePositions = [];

        // Positions with a building on it ([Position])
        this.takenPositions = [];

        // The mansion of the city
        this.mansion = null;

        // The player money
        this.money = 50;

        this.guiManager = new GUIManager(this);

        // At each tick, a month is spent.
        this.monthTimer = null;

        // The total time spent
        this.monthTime  = -1;

        // Resize window event
        window.addEventListener("resize", () => {
            this.engine.resize();
        });

        this.run();

    }
    _initScene() {

        let scene = new BABYLON.Scene(this.engine);
        // Camera attached to the canvas
        let camera = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(-14, 17, -20), scene);
        camera.rotation.x = camera.rotation.y = 0.65;
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

        let meshTask = loader.addMeshTask("city", "", "./assets/", "city.babylon");
        meshTask.onSuccess = (t) => {

            this.availablePositions = CityManager.GET_POSITIONS(t.loadedMeshes).normal;
        };

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

        this.monthTimer = new Timer(1000, this.scene, {repeat:-1});
        this.monthTimer.callback = () => {
            this._addMonth();
        };

        this.buyTimer = new Timer(1000, this.scene, {autostart:true, repeat:-1});
        this.buyTimer.callback = () => {
            let rp = this.getRandomPosition();
            if (rp){
                this.build(rp);
            }
        };
    }

    /**
     * Returns an integer in [min, max[
     */
    static randomNumber(min, max) {
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
        let ind = Game.randomNumber(0,this.availablePositions.length);
        let res = this.availablePositions.splice(ind, 1)[0];
        if (res) {
            this.takenPositions.push(res);
            return res;
        }
        return null;
    }

    build(position) {
        new House(this, position);
    }

    cleanPosition(building) {
        this.takenPositions.forEach((pos, index) => {
           if (pos.id === building.getPositionId()) {
               this.takenPositions.splice(index, 1);
               this.availablePositions.push(pos);
               return;
           }
        });
    }

    /**
     * Start the game by removing all building built during the menu time
     */
    start() {
        for (let ind=0; ind<this.scene.meshes.length; ind++) {
            let m = this.scene.meshes[ind];
            if (m instanceof House) {
                m.dispose();
            }
        }
        // Start the month timer
        this.monthTimer.reset();
        this.monthTimer.start();
    }

    /**
     * Increment the month/year timer, and updates the game GUI
     */
    _addMonth() {
        this.monthTime ++;
        this.guiManager.updateGui();
    }

}
