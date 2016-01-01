class House extends Building {

    constructor(game, position) {
        super(game, position);

        // placeholder shape
        let cube = BABYLON.MeshBuilder.CreateBox('', {width:0.5, height:1, depth:0.5}, this.getScene());
        cube.position.y = 0.5;
        this.addChildren(cube);

        // The time that a house can be bought
        this.canBuyTime = Game.randomNumber(5000, 10000);
        this.timer = new Timer(this.canBuyTime, this.getScene(), {autostart:true, autodestroy:true});
        this.timer.onFinish = () => {
            this.dispose();
        };
        this.timer.start();

        // Has this building been bought ?
        this.bought = false;


        this.build();
    }

    /**
     * Overrides mesh.dispose().
     */
    dispose() {

        // If the player doesn't want to buy this building, make it disapear
        this.demolish(() => {
            super.dispose();
            this.game.cleanPosition(this);
        });
    }

    /**
     * Remove this building
     */
    demolish(callback) {

        let duration = 1000;
        let fps = 20;
        let quarter = duration*fps*0.001/4;

        this.animations = [];
        // Position animation
        let position = new BABYLON.Animation("", "position.y", fps, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        position.setKeys([
            { frame: 0, value: this.position.y },
            { frame: quarter, value: this.position.y+1 },
            { frame: quarter*4, value: 0 }
        ]);
        let e = new BABYLON.CubicEase();
        e.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        position.setEasingFunction(e);
        this.animations.push(position);

        // Scaling
        let scaling = new BABYLON.Animation("", "scaling", fps, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        scaling.setKeys([
            { frame: 0, value: new BABYLON.Vector3(1,1,1) },
            { frame: quarter*2, value: new BABYLON.Vector3(1.2,1.2,1.2) },
            { frame: quarter*4, value: BABYLON.Vector3.Zero() }
        ]);
        this.animations.push(scaling);

        // Rotation
        let rotation = new BABYLON.Animation("", "rotation.y", fps, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        rotation.setKeys([
            { frame: 0, value: 0 },
            { frame: quarter*4, value: Math.PI*2 }
        ]);
        rotation.setEasingFunction(e);
        this.animations.push(rotation);

        this.getScene().beginAnimation(this, 0, duration, false, 1, () => {
            callback();
        });
    }

    build(callback) {
        let duration = 1000;
        let fps = 20;
        let quarter = duration*fps*0.001/4;

        this.animations = [];
        // Position animation
        let position = new BABYLON.Animation("", "position.y", fps, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        position.setKeys([
            { frame: 0, value: 0 },
            { frame: quarter, value: this.position.y+1 },
            { frame: quarter*4, value: this.position.y }
        ]);
        let e = new BABYLON.CubicEase();
        e.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        position.setEasingFunction(e);
        this.animations.push(position);

        // Scaling
        let scaling = new BABYLON.Animation("", "scaling", fps, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        scaling.setKeys([
            { frame: 0, value: BABYLON.Vector3.Zero() },
            { frame: quarter*3, value: new BABYLON.Vector3(1.2,1.2,1.2) },
            { frame: quarter*4, value: new BABYLON.Vector3(1,1,1) }
        ]);
        let f = new BABYLON.ElasticEase();
        f.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        scaling.setEasingFunction(f);
        this.animations.push(scaling);

        // Rotation
        let rotation = new BABYLON.Animation("", "rotation.y", fps, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        rotation.setKeys([
            { frame: 0, value: 0 },
            { frame: quarter*4, value: Math.PI*2 }
        ]);
        rotation.setEasingFunction(e);
        this.animations.push(rotation);


        this.getScene().beginAnimation(this, 0, duration, false, 1, () => {
            //this.displayPrice();
            if (callback) {
                callback();
            }
        });
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