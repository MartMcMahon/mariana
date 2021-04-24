// import decomp from "poly-decomp";

// function fromPolygon(path: [number, number][], options: {}) {
//   options = options || {};

//   var p = new decomp.Polygon();
//   p.vertices = path;

//   // Make it counter-clockwise
//   p.makeCCW();

//   if (typeof options.removeCollinearPoints === "number") {
//     p.removeCollinearPoints(options.removeCollinearPoints);
//   }

//   // Check if any line segment intersects the path itself
//   if (typeof options.skipSimpleCheck === "undefined") {
//     if (!p.isSimple()) {
//       return false;
//     }
//   }

//   // Save this path for later
//   this.concavePath = p.vertices.slice(0);
//   for (var i = 0; i < this.concavePath.length; i++) {
//     var v = [0, 0];
//     vec2.copy(v, this.concavePath[i]);
//     this.concavePath[i] = v;
//   }

//   // Slow or fast decomp?
//   var convexes;
//   if (options.optimalDecomp) {
//     convexes = p.decomp();
//   } else {
//     convexes = p.quickDecomp();
//   }

//   var cm = vec2.create();

//   // Add convexes
//   for (var i = 0; i !== convexes.length; i++) {
//     // Create convex
//     var c = new Convex({ vertices: convexes[i].vertices });

//     // Move all vertices so its center of mass is in the local center of the convex
//     for (var j = 0; j !== c.vertices.length; j++) {
//       var v = c.vertices[j];
//       vec2.sub(v, v, c.centerOfMass);
//     }

//     vec2.scale(cm, c.centerOfMass, 1);
//     c.updateTriangles();
//     c.updateCenterOfMass();
//     c.updateBoundingRadius();

//     // Add the shape
//     this.addShape(c, cm);
//   }

//   this.adjustCenterOfMass();

//   this.aabbNeedsUpdate = true;

//   return true;
// }
