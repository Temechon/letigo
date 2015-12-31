/**
 * A building is a structure that can be bought by the player
 */
class Building extends GameObject{

    constructor(game, position) {
        super(game);

        this.position = position;

        // The old price of this building (to know if the price is rising of decreasing)
        this._oldPrice = 0;

        // The price of this building
        this.price = 0;

        // debug
        this.addChildren(BABYLON.MeshBuilder.CreateBox('', {width:0.5, height:1, depth:0.5}, this.getScene()));

        this.setReady();


        // Arrows
        this.arrowUpTag = document.createElement('i');
        this.arrowUpTag.className = 'fa fa-arrow-up';

        this.arrowDownTag = document.createElement('i');
        this.arrowDownTag.className = 'fa fa-arrow-down';

        // Price label
        this.priceTag = document.createElement('div');
        this.priceTag.className = 'priceTag';
        this.priceTag.innerHTML = "99999";
        this.priceTag.appendChild(this.arrowUpTag);
    }

    spawn(callback) {
        let duration = 1000;
        let fps = 20;
        let quarter = duration*fps*0.001/4;

        if (this.animations.length == 0) {

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
        }

        this.getScene().beginAnimation(this, 0, duration, false, 1, () => {
            this.displayPrice();
            if (callback) {
                callback();
            }
        });
    }

    /**
     * Returns screen coordinates of the building
     */
    _project() {
        //this.scene.updateTransformMatrix();
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

        this.priceTag.style.top = p.y + "px";
        this.priceTag.style.left = p.x + "px";
    }

    updatePrice() {
        this.priceTag.innerHTML = this.price;
    }



}