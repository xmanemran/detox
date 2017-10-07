/**

	This code is generated.
	For more information see generation/README.md.
*/


// Globally declared helpers

function sanitize_greyDirection(action) {
  switch (action) {
    case "left":
      return 1;
    case "right":
      return 2;
    case "up":
      return 3;
    case "down":
      return 4;
      
    default:
      throw new Error(`GREYAction.GREYDirection must be a 'left'/'right'/'up'/'down', got ${action}`);
  }
}

function sanitize_greyContentEdge(action) {
  switch (action) {
    case "left":
      return 0;
    case "right":
      return 1;
    case "top":
      return 2;
    case "bottom":
      return 3;

    default:
      throw new Error(`GREYAction.GREYContentEdge must be a 'left'/'right'/'top'/'bottom', got ${action}`);
  }
}



class DetoxAction {
  static multiClick(times) {
    if (typeof times !== "number") throw new Error("times should be a number, but got " + (times + (" (" + (typeof times + ")"))));
    return {
      target: {
        type: "Class",
        value: "DetoxAction"
      },
      method: "multiClick",
      args: [{
        type: "int",
        value: times
      }]
    };
  }

  static tapAtLocation(x, y) {
    if (typeof x !== "number") throw new Error("x should be a number, but got " + (x + (" (" + (typeof x + ")"))));
    if (typeof y !== "number") throw new Error("y should be a number, but got " + (y + (" (" + (typeof y + ")"))));
    return {
      target: {
        type: "Class",
        value: "DetoxAction"
      },
      method: "tapAtLocation",
      args: [{
        type: "int",
        value: x
      }, {
        type: "int",
        value: y
      }]
    };
  }

  static scrollToEdge(edge) {
    if (typeof edge !== "number") throw new Error("edge should be a number, but got " + (edge + (" (" + (typeof edge + ")"))));
    return {
      target: {
        type: "Class",
        value: "DetoxAction"
      },
      method: "scrollToEdge",
      args: [{
        type: "int",
        value: edge
      }]
    };
  }

  static scrollInDirection(direction, amountInDP) {
    if (typeof direction !== "number") throw new Error("direction should be a number, but got " + (direction + (" (" + (typeof direction + ")"))));
    if (typeof amountInDP !== "number") throw new Error("amountInDP should be a number, but got " + (amountInDP + (" (" + (typeof amountInDP + ")"))));
    return {
      target: {
        type: "Class",
        value: "DetoxAction"
      },
      method: "scrollInDirection",
      args: [{
        type: "int",
        value: direction
      }, {
        type: "double",
        value: amountInDP
      }]
    };
  }

}

module.exports = DetoxAction;