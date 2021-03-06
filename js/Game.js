// The function onload is loaded when the DOM has been loaded
window.addEventListener("DOMContentLoaded", () => {

    if (window.screen.show) {
        setTimeout(() => {
            // check that the window.screen.show method is available
            window.screen.show();
            new Game('game-canvas');
        }, 2500);
    } else {
        new Game('game-canvas');
    }
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
        this.money = 1500;

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
        let camera = new BABYLON.FreeCamera("cam", new BABYLON.Vector3(-11, 34, -51), scene);
        camera.rotation.x = camera.rotation.y = 0.7;
        camera.attachControl(this.engine.getRenderingCanvas());

        // Hemispheric light to light the scene
        let h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0,-1,0), scene);
        h.intensity = 1.5;

        let dir = new BABYLON.DirectionalLight('dir', new BABYLON.Vector3(0,-1,-0.5), scene);
        //dir.intensity = 2;
        return scene;
    }

    run() {

        this.scene = this._initScene();

        // The loader
        let loader =  new BABYLON.AssetsManager(this.scene);

        let meshTask = loader.addMeshTask("city", "", "./assets/", "city.babylon");
        meshTask.onSuccess = (t) => {

            this.assets['house']        = CityManager.GET_HOUSE(t.loadedMeshes);
            this.assets['mansion']      = CityManager.GET_MANSION(t.loadedMeshes);
            this.availablePositions     = CityManager.GET_POSITIONS(t.loadedMeshes).normal;
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

        // Debug panel
        window.addEventListener("keydown", (evt) => {
            if (evt.keyCode == 32) {
                if (this.scene.debugLayer._enabled) {
                    this.scene.debugLayer.hide();
                } else {
                    this.scene.debugLayer.show();
                }
            }
        });

        // Track the time spent
        this.monthTimer = new Timer(1000, this.scene, {repeat:-1});
        this.monthTimer.callback = () => {
            this._addMonth();
        };

        // Build houses!
        this.buyTimer = new Timer(5000, this.scene, {autostart:true, repeat:-1, immediate:true});
        this.buyTimer.callback = () => {
            let rp = this.getRandomPosition();
            if (rp){
                this.build(rp);
            }
        };

        // Activate mansion
        new Mansion(this, new Position(BABYLON.Vector3.Zero()));

        // When the player touch a building
        this.scene.onPointerDown = (evt, pickResult) => {
            if (pickResult.pickedMesh && pickResult.pickedMesh.parent) {
                let house = pickResult.pickedMesh.parent;

                if (house.bought) {
                    // sell house
                    this.money += house.price;
                    house.dispose();

                } else {
                    if (house.price <= this.money) {
                        this.money -= house.price;
                        house.buy();
                    }
                }
                this.guiManager.updateGui();
            }
        }


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
        this.buyTimer.reset();
        this.buyTimer.immediate = true;
        this.buyTimer.start();
    }

    /**
     * Increment the month/year timer, and updates the game GUI
     */
    _addMonth() {
        this.monthTime ++;
        this.guiManager.updateGui();
    }

    /**
     * Win the game !
     */
    win() {
        this.monthTimer.stop();
        this.buyTimer.stop();

        for (let ind=0; ind<this.scene.meshes.length; ind++) {
            let m = this.scene.meshes[ind];
            if (m instanceof Building) {
                m.stop();
            }
        }

        // Display score and win screen
        this.guiManager.showWinScreen();

    }

}
