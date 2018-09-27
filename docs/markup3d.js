/**
 * Markup 3D
 * @author          jrucker
 * @date            Created on 18-9-22.
 * @description     This is a Markup 3D by forge
 */

Autodesk.Viewing.Markup3d = function (viewer) {
  this.viewer = viewer;
  this.raycaster = new THREE.Raycaster();
  this.raycaster.params.PointCloud.threshold = 5; // hit-test markup size.  Change this if markup 'hover' doesn't work
  this.size = 30.0; // markup size.  Change this if markup size is too big or small
  this.lineColor = 0xcccccc; // off-white
  this.labelOffset = new THREE.Vector3(120, 120, 0);  // label offset 3D line offset position
  this.xDivOffset = -0.2;  // x offset position of the div label wrt 3D line.
  this.yDivOffset = 0.4;  // y offset position of the div label wrt 3D line.
  this.scene = this.viewer.impl.scene; // change this to viewer.impl.sceneAfter with transparency, if you want the markup always on top.
  this.markupItems = []; // array containing markup data
  this.pointCloud = null; // three js point-cloud mesh object
  this.line3d = null; // three js point-cloud mesh object
  this.camera = this.viewer.impl.camera;
  this.selectedIndex = null; // index of selected pointCloud id, based on markupItems array
  this.label = null; // x,y div position of selected pointCloud. updated on mouse-move
  this.offset = null; // global offset
  this.vertexShader = `
    uniform float size;
    varying vec3 vColor;
    void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_PointSize = size;
        gl_Position = projectionMatrix * mvPosition;
    }`;

  this.fragmentShader = `
    uniform sampler2D tex;
    varying vec3 vColor;
    void main() {
        gl_FragColor = vec4( vColor.x, vColor.x, vColor.x, 1.0 );
        gl_FragColor = gl_FragColor * texture2D(tex, vec2((gl_PointCoord.x+vColor.y*1.0)/4.0, 1.0-gl_PointCoord.y));
        if (gl_FragColor.w < 0.5) discard;
    }`;

};
/**
 * Load updateHitPick
 * @param event
 */
Autodesk.Viewing.Markup3d.prototype.updateHitPick = function (event) {
  if (!this.pointCloud) return;
  let x = ((event.clientX - 210 - this.viewer.canvas.offsetLeft) / this.viewer.canvas.width) * 2 - 1;
  let y = -((event.clientY - 70 - this.viewer.canvas.offsetTop) / this.viewer.canvas.height) * 2 + 1;
  let vector = new THREE.Vector3(x, y, 0.5).unproject(this.camera);
  this.raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize());
  let nodes = this.raycaster.intersectObject(this.pointCloud);
  this.selectedIndex = nodes.length ? nodes[0].index : null;
  this.viewer.impl.invalidate(true);
};

/**
 * Load markup points into Point Cloud
 * @param data
 */
Autodesk.Viewing.Markup3d.prototype.setMarkupData = function (data) {
  this.markupItems = data;
  this.geometry = new THREE.Geometry();
  data.map(item => {
    let point = (new THREE.Vector3(item.x, item.y, item.z));
    this.geometry.vertices.push(point);
    this.geometry.colors.push(new THREE.Color(1.0, item.icon, 0));
  });

  this.initMeshPointCloud();
  this.initMeshLine();
  setTimeout(() => BimViewer.view.impl.invalidate(true), 200)
};

/**
 * Load Mesh into Point Cloud
 */
Autodesk.Viewing.Markup3d.prototype.initMeshPointCloud = function () {
  this.pointCloud && this.scene.remove(this.pointCloud);
  let texture = THREE.ImageUtils.loadTexture("static/desk/js/extensions/PointCloudMarkup/img/icons.png");
  let material = new THREE.ShaderMaterial({
    vertexColors: THREE.VertexColors,
    fragmentShader: this.fragmentShader,
    vertexShader: this.vertexShader,
    depthWrite: true,
    depthTest: true,
    uniforms: {
      size: {type: "f", value: this.size},
      tex: {type: "t", value: texture}
    }
  });

  this.pointCloud = new THREE.PointCloud(this.geometry, material);
  this.pointCloud.position.sub({x: 0, y: 0, z: 0});
  this.scene.add(this.pointCloud);
};

/**
 * Load Mesh line into markup
 */
Autodesk.Viewing.Markup3d.prototype.initMeshLine = function () {
  let geom = new THREE.Geometry();
  geom.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1),);
  this.line3d = new THREE.Line(geom, new THREE.LineBasicMaterial({color: this.lineColor, linewidth: 4.0,}));
  this.line3d.position.sub(this.offset);
  this.scene.add(this.line3d);
};

/**
 * Dispatch Message when a point is clicked
 */
Autodesk.Viewing.Markup3d.prototype.onClick = function () {
  this.updateHitPick(event);
  this.viewer.impl.invalidate(true);
  this.viewer.clearSelection();
  if (this.selectedIndex !== null) {
    let item = this.markupItems[this.selectedIndex];
    window.dispatchEvent(new CustomEvent('onMarkupClick', {
      detail: item
    }));
  }
};

/**
 * init markup3D load
 * @returns {boolean}
 */
Autodesk.Viewing.Markup3d.prototype.load = function () {
  this.offset = this.viewer.model.getData().globalOffset;
  document.addEventListener('mousedown', e => this.onClick(e), true);
  document.addEventListener('touchstart', e => this.onClick(e.changedTouches[0]), false);
  return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('Autodesk.Viewing.Markup3d', Autodesk.Viewing.Markup3d);


