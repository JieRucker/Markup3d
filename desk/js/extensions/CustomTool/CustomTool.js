/**
 * Custom Tool
 * @author          jrucker
 * @date            Created on 18-9-21.
 * @description     Event Add Listener Tool
 */

AutodeskNamespace("Autodesk.ADN.Viewing.Extension");
import Event from './Event';

export default class CustomTool {
  constructor(viewer, callback) {
    this.viewer = viewer;
    this.tool = null;
    this.toolName = 'Autodesk.ADN.Viewing.Tool.CustomTool';
    this.callback = callback;
    setTimeout(() => this.load(), 500)
  }

  load() {
    this.tool = new Event(this.toolName, this.listen.bind(this));
    this.viewer.toolController.registerTool(this.tool);
    this.viewer.toolController.activateTool(this.toolName);
    return true;
  }

  unload() {
    this.viewer.toolController.deactivateTool(this.toolName);
    return true;
  }

  listen(params) {
    const change = (() => {
      return () => this.callback.call(this, params);
    })();

    switch (params.type) {
      case 'handleSingleClick':
        change();
        break;
      case 'handleDoubleClick':
        change();
        break;
      case 'handleSingleTap':
        change();
        break;
      case 'handleDoubleTap':
        change();
        break;
      case 'handleKeyDown':
        change();
        break;
      case 'handleKeyUp':
        change();
        break;
      case 'handleWheelInput':
        change();
        break;
      case 'handleButtonDown':
        change();
        break;
      case 'handleButtonUp':
        change();
        break;
      case 'handleMouseMove':
        change();
        break;
      case 'handleGesture':
        change();
        break;
      case 'handleBlur':
        change();
        break;
      case 'resize':
        change();
        break;
    }
  }
}
