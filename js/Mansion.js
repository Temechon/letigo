class Mansion extends Building {

    constructor(game, position) {
        super(game, position);

        // placeholder shape
        let cube = BABYLON.MeshBuilder.CreateBox('', {width:0.5, height:1, depth:0.5}, this.getScene());
        cube.position.y = 0.5;
        this.addChildren(cube);


    }


}