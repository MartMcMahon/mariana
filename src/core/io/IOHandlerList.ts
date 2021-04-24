import IOEventHandler from "../entity/IOEventHandler";
import {
  hasOnButtonDown,
  hasOnButtonUp,
  hasOnClick,
  hasOnInputDeviceChange,
  hasOnKeyDown,
  hasOnKeyUp,
  hasOnMouseDown,
  hasOnMouseUp,
  hasOnRightClick,
  hasOnRightDown,
  hasOnRightUp,
} from "../EntityFilter";
import FilterList from "../util/FilterList";
export default class IOHandlerList implements Iterable<IOEventHandler> {
  all = new Set<IOEventHandler>();

  filtered = {
    onButtonDown: new FilterList(hasOnButtonDown),
    onButtonUp: new FilterList(hasOnButtonUp),
    onClick: new FilterList(hasOnClick),
    onKeyDown: new FilterList(hasOnKeyDown),
    onKeyUp: new FilterList(hasOnKeyUp),
    onMouseDown: new FilterList(hasOnMouseDown),
    onMouseUp: new FilterList(hasOnMouseUp),
    onRightClick: new FilterList(hasOnRightClick),
    onRightDown: new FilterList(hasOnRightDown),
    onRightUp: new FilterList(hasOnRightUp),
    onInputDeviceChange: new FilterList(hasOnInputDeviceChange),
  };

  add(handler: IOEventHandler) {
    this.all.add(handler);
    for (const list of Object.values(this.filtered)) {
      list.addIfValid(handler);
    }
  }

  remove(handler: IOEventHandler) {
    this.all.delete(handler);
    for (const list of Object.values(this.filtered)) {
      list.remove(handler);
    }
  }

  [Symbol.iterator]() {
    return this.all[Symbol.iterator]();
  }
}
