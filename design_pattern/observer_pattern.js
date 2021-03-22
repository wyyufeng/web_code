class EventDispatcher {
  listen(type, listener, once = false) {
    if (this._listeners === undefined) this._listeners = {};
    const listeners = this._listeners;

    if (listeners[type] === undefined) {
      listeners[type] = [];
    }
    const ctx = this;
    if (listeners[type].indexOf(listener) === -1) {
      let handler = listener;
      if (once) {
        handler = function () {
          listener(arguments);
          ctx.remove(type, handler);
        };
      }
      listeners[type].push(handler);
    }
    return this;
  }

  remove(type, listener) {
    if (this._listeners === undefined) return;
    const listeners = this._listeners;
    const listenerArray = listeners[type];
    if (listenerArray !== undefined) {
      const index = listenerArray.indexOf(listener);
      if (index !== -1) {
        listenerArray.splice(index, 1);
      }
    }
  }

  dispatch(event) {
    if (this._listeners === undefined) return;

    const listeners = this._listeners;
    const listenerArray = listeners[event.type];

    if (listenerArray !== undefined) {
      event.target = this;

      const array = listenerArray.slice(0);

      for (let i = 0, l = array.length; i < l; i++) {
        array[i].call(this, event);
      }
    }
  }
}
