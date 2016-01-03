/**
 * Read the babylon file and creates mansion and available positions for building
 */
class CityManager {

    /**
     * Regexp to search for normal position
     */
    static NORMAL_POSITION_REGEXP() {
        return /position(\d+)/i;
    }

    /**
     * Return the mesh called 'house'
     */
    static HOUSE_REGEXP() {
        return /house/i;
    }

    /**
     * Return the mesh called 'mansion'
     */
    static MANSION_REGEXP() {
        return /mansion/i;
    }

    /**
     * Returns the list of position
     * {
     * normal:[],
     * medium:[],
     * high:[]
     * }
     */
    static GET_POSITIONS(meshes) {
        let res = {};
        res.normal = [];
        for (let mesh of meshes) {
            // normal positions
            var result = CityManager.NORMAL_POSITION_REGEXP().exec(mesh.name);
            if (result) {
                res.normal.push(new Position(mesh.position));
                mesh.dispose();
            }
        }

        return res;
    }

    static GET_HOUSE(meshes) {
        let res = null;

        for (let mesh of meshes) {
            // normal positions
            var result = CityManager.HOUSE_REGEXP().exec(mesh.name);
            if (result) {
                mesh.setEnabled(false);
                res = mesh;
            }
        }
        if (!res) {
            console.warn('>> house not found!');
        }

        return res;
    }

    static GET_MANSION(meshes) {
        let res = null;

        for (let mesh of meshes) {
            // normal positions
            var result = CityManager.MANSION_REGEXP().exec(mesh.name);
            if (result) {
                res = mesh;
            }
        }
        if (!res) {
            console.warn('>> mansion not found!');
        }

        return res;
    }
}