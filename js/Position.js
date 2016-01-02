/**
 * A position is a set of world coordinates (vector3)
 */
class Position {

    constructor(position) {
        // The world coordinates of this position
        this.position = position;

        // An unique ID
        this.id = Position.UNIQUE_ID();

    }

    // from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#answer-2117523
    // be aware Math.random() could cause collisions
    static UNIQUE_ID () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}