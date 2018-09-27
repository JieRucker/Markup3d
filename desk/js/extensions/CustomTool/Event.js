/**
 * Custom Tool
 * @author          jrucker
 * @date            Created on 18-9-21.
 * @description     Event
 */

export default class Event {
  constructor(toolName, event) {
    this.toolName = toolName;
    this.event = event;
  }

  getNames() {
    return [this.toolName];
  };

  getName() {
    return this.toolName;
  };

  activate(name) {
    // console.log(name);
  };

  deactivate(name) {
    // console.log(name);
  };

  handleSingleClick(event, button) {
    let type = 'handleSingleClick';
    this.event.call(this, {type, event, button});

    return false;
  };

  handleDoubleClick(event, button) {
    let type = 'handleDoubleClick';
    this.event.call(this, {type, event, button});

    return false;
  };

  handleSingleTap(event) {
    let type = 'handleSingleTap';
    this.event.call(this, {type, event});

    return false;
  };

  handleDoubleTap(event) {
    let type = 'handleDoubleTap';
    this.event.call(this, {type, event});

    return false;
  };

  handleKeyDown(event, keyCode) {
    let type = 'handleKeyDown';
    this.event.call(this, {type, event, keyCode});

    return false;
  };

  handleKeyUp(event, keyCode) {
    let type = 'handleKeyUp';
    this.event.call(this, {type, event, keyCode});

    return false;
  };

  handleWheelInput(delta) {
    let type = 'handleWheelInput';
    this.event.call(this, {type, delta});

    return false;
  };

  handleButtonDown(event, button) {
    let type = 'handleButtonDown';
    this.event.call(this, {type, event, button});

    return false;
  };

  handleButtonUp(event, button) {
    let type = 'handleButtonUp';
    this.event.call(this, {type, event, button});

    return false;
  };

  handleMouseMove(event) {
    let type = 'handleMouseMove';
    this.event.call(this, {type, event});

    return false;
  };

  handleGesture(event) {
    let type = 'handleGesture';
    this.event.call(this, {type, event});

    return false;
  };

  handleBlur(event) {
    let type = 'handleBlur';
    this.event.call(this, {type, event});

    return false;
  };

  handleResize() {
    let type = 'resize';
    this.event.call(this, type);
  };
}
