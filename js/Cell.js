/**
 * A cell is a block divided in 4 part where buildings can spawn.
 * The Game instance will keep the link between cell, positions and buildings.
 */
class Cell extends GameObject{

    constructor(game) {
        super(game);

        this.position = BABYLON.Vector3.Zero();
        this.size = 4;

        // The list of building available on this cell
        this.buildings = [];

        // Positions available on this cell
        this.positions = null;
        this.updatePosition();


        this.isVisible = true;

        // A cell is a squared plane
        var vd = BABYLON.VertexData.CreateGround({
            width: this.size,  height: this.size, subdivisions: 1
        });
        vd.applyToMesh(this, false);

        this.material = new BABYLON.StandardMaterial("", this.getScene());
    }

    updatePosition(newpos = BABYLON.Vector3.Zero()) {
        this.position = newpos;
        let hf = this.size/4;
        this.positions = [
            new BABYLON.Vector3(this.position.x-hf, this.position.y, this.position.z-hf),
            new BABYLON.Vector3(this.position.x-hf, this.position.y, this.position.z+hf),
            new BABYLON.Vector3(this.position.x+hf, this.position.y, this.position.z-hf),
            new BABYLON.Vector3(this.position.x+hf, this.position.y, this.position.z+hf)
        ];
    }

}