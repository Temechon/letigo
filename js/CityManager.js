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
                res.normal.push(mesh.position);
                mesh.dispose();
            }
        }

        return res;
    }
}