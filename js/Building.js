/**
 * A building is a structure that can be bought by the player
 */
class Building extends GameObject{

    constructor(game, position) {
        super(game);

        // Building position
        this.position = position;

        // Knowing if the price is rising of decreasing)
        this._oldPrice = 0;
        this._oldArrow = null;

        // The time that a house can be bought
        this.canBuyTime = Game.randomNumber(5000, 10000);
        this.timer = new Timer(this.canBuyTime, this.getScene(), {autostart:true, autodestroy:true});
        this.timer.onFinish = () => {
            // If the player doesn't want to buy this building, make it disapear
            this.demolish(() => {
                this.game.cleanPosition(this);
            });
        };
        this.timer.start();

        // Has this building been bought ?
        this.bought = false;

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

        // placeholder shape
        let cube = BABYLON.MeshBuilder.CreateBox('', {width:0.5, height:1, depth:0.5}, this.getScene())
        cube.position.y = 0.5;
        this.addChildren(cube);

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

        // Set ready !
        this.setReady();

        // Build it !
        this.build();
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
            { frame: quarter*4, value: Math.PI*4 }
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