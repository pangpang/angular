'use strict';var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
var EventListener = (function () {
    function EventListener(name, callback) {
        this.name = name;
        this.callback = callback;
    }
    ;
    return EventListener;
})();
exports.EventListener = EventListener;
var DebugNode = (function () {
    function DebugNode(nativeNode, parent) {
        this.nativeNode = nativeNode;
        if (lang_1.isPresent(parent) && parent instanceof DebugElement) {
            parent.addChild(this);
        }
        else {
            this.parent = null;
        }
        this.listeners = [];
        this.providerTokens = [];
    }
    DebugNode.prototype.setDebugInfo = function (info) {
        this.injector = info.injector;
        this.providerTokens = info.providerTokens;
        this.locals = info.locals;
        this.componentInstance = info.component;
    };
    DebugNode.prototype.inject = function (token) { return this.injector.get(token); };
    DebugNode.prototype.getLocal = function (name) { return this.locals.get(name); };
    return DebugNode;
})();
exports.DebugNode = DebugNode;
var DebugElement = (function (_super) {
    __extends(DebugElement, _super);
    function DebugElement(nativeNode, parent) {
        _super.call(this, nativeNode, parent);
        this.properties = new Map();
        this.attributes = new Map();
        this.childNodes = [];
        this.nativeElement = nativeNode;
    }
    DebugElement.prototype.addChild = function (child) {
        if (lang_1.isPresent(child)) {
            this.childNodes.push(child);
            child.parent = this;
        }
    };
    DebugElement.prototype.removeChild = function (child) {
        var childIndex = this.childNodes.indexOf(child);
        if (childIndex !== -1) {
            child.parent = null;
            this.childNodes.splice(childIndex, 1);
        }
    };
    DebugElement.prototype.insertChildrenAfter = function (child, newChildren) {
        var siblingIndex = this.childNodes.indexOf(child);
        if (siblingIndex !== -1) {
            var previousChildren = this.childNodes.slice(0, siblingIndex + 1);
            var nextChildren = this.childNodes.slice(siblingIndex + 1);
            this.childNodes =
                collection_1.ListWrapper.concat(collection_1.ListWrapper.concat(previousChildren, newChildren), nextChildren);
            for (var i = 0; i < newChildren.length; ++i) {
                var newChild = newChildren[i];
                if (lang_1.isPresent(newChild.parent)) {
                    newChild.parent.removeChild(newChild);
                }
                newChild.parent = this;
            }
        }
    };
    DebugElement.prototype.query = function (predicate) {
        var results = this.queryAll(predicate);
        return results.length > 0 ? results[0] : null;
    };
    DebugElement.prototype.queryAll = function (predicate) {
        var matches = [];
        _queryElementChildren(this, predicate, matches);
        return matches;
    };
    DebugElement.prototype.queryAllNodes = function (predicate) {
        var matches = [];
        _queryNodeChildren(this, predicate, matches);
        return matches;
    };
    Object.defineProperty(DebugElement.prototype, "children", {
        get: function () {
            var children = [];
            this.childNodes.forEach(function (node) {
                if (node instanceof DebugElement) {
                    children.push(node);
                }
            });
            return children;
        },
        enumerable: true,
        configurable: true
    });
    DebugElement.prototype.triggerEventHandler = function (eventName, eventObj) {
        this.listeners.forEach(function (listener) {
            if (listener.name == eventName) {
                listener.callback(eventObj);
            }
        });
    };
    return DebugElement;
})(DebugNode);
exports.DebugElement = DebugElement;
function asNativeElements(debugEls) {
    return debugEls.map(function (el) { return el.nativeElement; });
}
exports.asNativeElements = asNativeElements;
function _queryElementChildren(element, predicate, matches) {
    element.childNodes.forEach(function (node) {
        if (node instanceof DebugElement) {
            if (predicate(node)) {
                matches.push(node);
            }
            _queryElementChildren(node, predicate, matches);
        }
    });
}
function _queryNodeChildren(parentNode, predicate, matches) {
    if (parentNode instanceof DebugElement) {
        parentNode.childNodes.forEach(function (node) {
            if (predicate(node)) {
                matches.push(node);
            }
            if (node instanceof DebugElement) {
                _queryNodeChildren(node, predicate, matches);
            }
        });
    }
}
// Need to keep the nodes in a global Map so that multiple angular apps are supported.
var _nativeNodeToDebugNode = new Map();
function getDebugNode(nativeNode) {
    return _nativeNodeToDebugNode.get(nativeNode);
}
exports.getDebugNode = getDebugNode;
function getAllDebugNodes() {
    return collection_1.MapWrapper.values(_nativeNodeToDebugNode);
}
exports.getAllDebugNodes = getAllDebugNodes;
function indexDebugNode(node) {
    _nativeNodeToDebugNode.set(node.nativeNode, node);
}
exports.indexDebugNode = indexDebugNode;
function removeDebugNodeFromIndex(node) {
    _nativeNodeToDebugNode.delete(node.nativeNode);
}
exports.removeDebugNodeFromIndex = removeDebugNodeFromIndex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWdfbm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtQmM0bXc2dlgudG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2RlYnVnL2RlYnVnX25vZGUudHMiXSwibmFtZXMiOlsiRXZlbnRMaXN0ZW5lciIsIkV2ZW50TGlzdGVuZXIuY29uc3RydWN0b3IiLCJEZWJ1Z05vZGUiLCJEZWJ1Z05vZGUuY29uc3RydWN0b3IiLCJEZWJ1Z05vZGUuc2V0RGVidWdJbmZvIiwiRGVidWdOb2RlLmluamVjdCIsIkRlYnVnTm9kZS5nZXRMb2NhbCIsIkRlYnVnRWxlbWVudCIsIkRlYnVnRWxlbWVudC5jb25zdHJ1Y3RvciIsIkRlYnVnRWxlbWVudC5hZGRDaGlsZCIsIkRlYnVnRWxlbWVudC5yZW1vdmVDaGlsZCIsIkRlYnVnRWxlbWVudC5pbnNlcnRDaGlsZHJlbkFmdGVyIiwiRGVidWdFbGVtZW50LnF1ZXJ5IiwiRGVidWdFbGVtZW50LnF1ZXJ5QWxsIiwiRGVidWdFbGVtZW50LnF1ZXJ5QWxsTm9kZXMiLCJEZWJ1Z0VsZW1lbnQuY2hpbGRyZW4iLCJEZWJ1Z0VsZW1lbnQudHJpZ2dlckV2ZW50SGFuZGxlciIsImFzTmF0aXZlRWxlbWVudHMiLCJfcXVlcnlFbGVtZW50Q2hpbGRyZW4iLCJfcXVlcnlOb2RlQ2hpbGRyZW4iLCJnZXREZWJ1Z05vZGUiLCJnZXRBbGxEZWJ1Z05vZGVzIiwiaW5kZXhEZWJ1Z05vZGUiLCJyZW1vdmVEZWJ1Z05vZGVGcm9tSW5kZXgiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEscUJBQXdCLDBCQUEwQixDQUFDLENBQUE7QUFHbkQsMkJBQXNDLGdDQUFnQyxDQUFDLENBQUE7QUFHdkU7SUFBNkJBLHVCQUFtQkEsSUFBWUEsRUFBU0EsUUFBa0JBO1FBQXZDQyxTQUFJQSxHQUFKQSxJQUFJQSxDQUFRQTtRQUFTQSxhQUFRQSxHQUFSQSxRQUFRQSxDQUFVQTtJQUFFQSxDQUFDQTs7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LEdBQUdBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO0FBQ3BEQSxDQUFDQTtBQUZlLHNCQUFjLGlCQUU3QixDQUFBO0FBRUQsa0NBQXlDLElBQWU7SUFDdERDLHNCQUFzQkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7QUFDakRBLENBQUNBO0FBRmUsZ0NBQXdCLDJCQUV2QyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc1ByZXNlbnR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge1ByZWRpY2F0ZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7SW5qZWN0b3J9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcbmltcG9ydCB7TGlzdFdyYXBwZXIsIE1hcFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge1JlbmRlckRlYnVnSW5mb30gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvcmVuZGVyL2FwaSc7XG5cbmV4cG9ydCBjbGFzcyBFdmVudExpc3RlbmVyIHsgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIGNhbGxiYWNrOiBGdW5jdGlvbil7fTsgfVxuXG5leHBvcnQgY2xhc3MgRGVidWdOb2RlIHtcbiAgbmF0aXZlTm9kZTogYW55O1xuICBsaXN0ZW5lcnM6IEV2ZW50TGlzdGVuZXJbXTtcbiAgcGFyZW50OiBEZWJ1Z0VsZW1lbnQ7XG4gIHByb3ZpZGVyVG9rZW5zOiBhbnlbXTtcbiAgbG9jYWxzOiBNYXA8c3RyaW5nLCBhbnk+O1xuICBpbmplY3RvcjogSW5qZWN0b3I7XG4gIGNvbXBvbmVudEluc3RhbmNlOiBhbnk7XG5cbiAgY29uc3RydWN0b3IobmF0aXZlTm9kZTogYW55LCBwYXJlbnQ6IERlYnVnTm9kZSkge1xuICAgIHRoaXMubmF0aXZlTm9kZSA9IG5hdGl2ZU5vZGU7XG4gICAgaWYgKGlzUHJlc2VudChwYXJlbnQpICYmIHBhcmVudCBpbnN0YW5jZW9mIERlYnVnRWxlbWVudCkge1xuICAgICAgcGFyZW50LmFkZENoaWxkKHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMubGlzdGVuZXJzID0gW107XG4gICAgdGhpcy5wcm92aWRlclRva2VucyA9IFtdO1xuICB9XG5cbiAgc2V0RGVidWdJbmZvKGluZm86IFJlbmRlckRlYnVnSW5mbykge1xuICAgIHRoaXMuaW5qZWN0b3IgPSBpbmZvLmluamVjdG9yO1xuICAgIHRoaXMucHJvdmlkZXJUb2tlbnMgPSBpbmZvLnByb3ZpZGVyVG9rZW5zO1xuICAgIHRoaXMubG9jYWxzID0gaW5mby5sb2NhbHM7XG4gICAgdGhpcy5jb21wb25lbnRJbnN0YW5jZSA9IGluZm8uY29tcG9uZW50O1xuICB9XG5cbiAgaW5qZWN0KHRva2VuOiBhbnkpOiBhbnkgeyByZXR1cm4gdGhpcy5pbmplY3Rvci5nZXQodG9rZW4pOyB9XG5cbiAgZ2V0TG9jYWwobmFtZTogc3RyaW5nKTogYW55IHsgcmV0dXJuIHRoaXMubG9jYWxzLmdldChuYW1lKTsgfVxufVxuXG5leHBvcnQgY2xhc3MgRGVidWdFbGVtZW50IGV4dGVuZHMgRGVidWdOb2RlIHtcbiAgbmFtZTogc3RyaW5nO1xuICBwcm9wZXJ0aWVzOiBNYXA8c3RyaW5nLCBhbnk+O1xuICBhdHRyaWJ1dGVzOiBNYXA8c3RyaW5nLCBhbnk+O1xuICBjaGlsZE5vZGVzOiBEZWJ1Z05vZGVbXTtcbiAgbmF0aXZlRWxlbWVudDogYW55O1xuXG4gIGNvbnN0cnVjdG9yKG5hdGl2ZU5vZGU6IGFueSwgcGFyZW50OiBhbnkpIHtcbiAgICBzdXBlcihuYXRpdmVOb2RlLCBwYXJlbnQpO1xuICAgIHRoaXMucHJvcGVydGllcyA9IG5ldyBNYXA8c3RyaW5nLCBhbnk+KCk7XG4gICAgdGhpcy5hdHRyaWJ1dGVzID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKTtcbiAgICB0aGlzLmNoaWxkTm9kZXMgPSBbXTtcbiAgICB0aGlzLm5hdGl2ZUVsZW1lbnQgPSBuYXRpdmVOb2RlO1xuICB9XG5cbiAgYWRkQ2hpbGQoY2hpbGQ6IERlYnVnTm9kZSkge1xuICAgIGlmIChpc1ByZXNlbnQoY2hpbGQpKSB7XG4gICAgICB0aGlzLmNoaWxkTm9kZXMucHVzaChjaGlsZCk7XG4gICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUNoaWxkKGNoaWxkOiBEZWJ1Z05vZGUpIHtcbiAgICB2YXIgY2hpbGRJbmRleCA9IHRoaXMuY2hpbGROb2Rlcy5pbmRleE9mKGNoaWxkKTtcbiAgICBpZiAoY2hpbGRJbmRleCAhPT0gLTEpIHtcbiAgICAgIGNoaWxkLnBhcmVudCA9IG51bGw7XG4gICAgICB0aGlzLmNoaWxkTm9kZXMuc3BsaWNlKGNoaWxkSW5kZXgsIDEpO1xuICAgIH1cbiAgfVxuXG4gIGluc2VydENoaWxkcmVuQWZ0ZXIoY2hpbGQ6IERlYnVnTm9kZSwgbmV3Q2hpbGRyZW46IERlYnVnTm9kZVtdKSB7XG4gICAgdmFyIHNpYmxpbmdJbmRleCA9IHRoaXMuY2hpbGROb2Rlcy5pbmRleE9mKGNoaWxkKTtcbiAgICBpZiAoc2libGluZ0luZGV4ICE9PSAtMSkge1xuICAgICAgdmFyIHByZXZpb3VzQ2hpbGRyZW4gPSB0aGlzLmNoaWxkTm9kZXMuc2xpY2UoMCwgc2libGluZ0luZGV4ICsgMSk7XG4gICAgICB2YXIgbmV4dENoaWxkcmVuID0gdGhpcy5jaGlsZE5vZGVzLnNsaWNlKHNpYmxpbmdJbmRleCArIDEpO1xuICAgICAgdGhpcy5jaGlsZE5vZGVzID1cbiAgICAgICAgICBMaXN0V3JhcHBlci5jb25jYXQoTGlzdFdyYXBwZXIuY29uY2F0KHByZXZpb3VzQ2hpbGRyZW4sIG5ld0NoaWxkcmVuKSwgbmV4dENoaWxkcmVuKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmV3Q2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIG5ld0NoaWxkID0gbmV3Q2hpbGRyZW5baV07XG4gICAgICAgIGlmIChpc1ByZXNlbnQobmV3Q2hpbGQucGFyZW50KSkge1xuICAgICAgICAgIG5ld0NoaWxkLnBhcmVudC5yZW1vdmVDaGlsZChuZXdDaGlsZCk7XG4gICAgICAgIH1cbiAgICAgICAgbmV3Q2hpbGQucGFyZW50ID0gdGhpcztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBxdWVyeShwcmVkaWNhdGU6IFByZWRpY2F0ZTxEZWJ1Z0VsZW1lbnQ+KTogRGVidWdFbGVtZW50IHtcbiAgICB2YXIgcmVzdWx0cyA9IHRoaXMucXVlcnlBbGwocHJlZGljYXRlKTtcbiAgICByZXR1cm4gcmVzdWx0cy5sZW5ndGggPiAwID8gcmVzdWx0c1swXSA6IG51bGw7XG4gIH1cblxuICBxdWVyeUFsbChwcmVkaWNhdGU6IFByZWRpY2F0ZTxEZWJ1Z0VsZW1lbnQ+KTogRGVidWdFbGVtZW50W10ge1xuICAgIHZhciBtYXRjaGVzOiBEZWJ1Z0VsZW1lbnRbXSA9IFtdO1xuICAgIF9xdWVyeUVsZW1lbnRDaGlsZHJlbih0aGlzLCBwcmVkaWNhdGUsIG1hdGNoZXMpO1xuICAgIHJldHVybiBtYXRjaGVzO1xuICB9XG5cbiAgcXVlcnlBbGxOb2RlcyhwcmVkaWNhdGU6IFByZWRpY2F0ZTxEZWJ1Z05vZGU+KTogRGVidWdOb2RlW10ge1xuICAgIHZhciBtYXRjaGVzOiBEZWJ1Z05vZGVbXSA9IFtdO1xuICAgIF9xdWVyeU5vZGVDaGlsZHJlbih0aGlzLCBwcmVkaWNhdGUsIG1hdGNoZXMpO1xuICAgIHJldHVybiBtYXRjaGVzO1xuICB9XG5cbiAgZ2V0IGNoaWxkcmVuKCk6IERlYnVnRWxlbWVudFtdIHtcbiAgICB2YXIgY2hpbGRyZW46IERlYnVnRWxlbWVudFtdID0gW107XG4gICAgdGhpcy5jaGlsZE5vZGVzLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRGVidWdFbGVtZW50KSB7XG4gICAgICAgIGNoaWxkcmVuLnB1c2gobm9kZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9XG5cbiAgdHJpZ2dlckV2ZW50SGFuZGxlcihldmVudE5hbWU6IHN0cmluZywgZXZlbnRPYmo6IEV2ZW50KSB7XG4gICAgdGhpcy5saXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIpID0+IHtcbiAgICAgIGlmIChsaXN0ZW5lci5uYW1lID09IGV2ZW50TmFtZSkge1xuICAgICAgICBsaXN0ZW5lci5jYWxsYmFjayhldmVudE9iaik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzTmF0aXZlRWxlbWVudHMoZGVidWdFbHM6IERlYnVnRWxlbWVudFtdKTogYW55IHtcbiAgcmV0dXJuIGRlYnVnRWxzLm1hcCgoZWwpID0+IGVsLm5hdGl2ZUVsZW1lbnQpO1xufVxuXG5mdW5jdGlvbiBfcXVlcnlFbGVtZW50Q2hpbGRyZW4oZWxlbWVudDogRGVidWdFbGVtZW50LCBwcmVkaWNhdGU6IFByZWRpY2F0ZTxEZWJ1Z0VsZW1lbnQ+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoZXM6IERlYnVnRWxlbWVudFtdKSB7XG4gIGVsZW1lbnQuY2hpbGROb2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgIGlmIChub2RlIGluc3RhbmNlb2YgRGVidWdFbGVtZW50KSB7XG4gICAgICBpZiAocHJlZGljYXRlKG5vZGUpKSB7XG4gICAgICAgIG1hdGNoZXMucHVzaChub2RlKTtcbiAgICAgIH1cbiAgICAgIF9xdWVyeUVsZW1lbnRDaGlsZHJlbihub2RlLCBwcmVkaWNhdGUsIG1hdGNoZXMpO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIF9xdWVyeU5vZGVDaGlsZHJlbihwYXJlbnROb2RlOiBEZWJ1Z05vZGUsIHByZWRpY2F0ZTogUHJlZGljYXRlPERlYnVnTm9kZT4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hlczogRGVidWdOb2RlW10pIHtcbiAgaWYgKHBhcmVudE5vZGUgaW5zdGFuY2VvZiBEZWJ1Z0VsZW1lbnQpIHtcbiAgICBwYXJlbnROb2RlLmNoaWxkTm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgIGlmIChwcmVkaWNhdGUobm9kZSkpIHtcbiAgICAgICAgbWF0Y2hlcy5wdXNoKG5vZGUpO1xuICAgICAgfVxuICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBEZWJ1Z0VsZW1lbnQpIHtcbiAgICAgICAgX3F1ZXJ5Tm9kZUNoaWxkcmVuKG5vZGUsIHByZWRpY2F0ZSwgbWF0Y2hlcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuLy8gTmVlZCB0byBrZWVwIHRoZSBub2RlcyBpbiBhIGdsb2JhbCBNYXAgc28gdGhhdCBtdWx0aXBsZSBhbmd1bGFyIGFwcHMgYXJlIHN1cHBvcnRlZC5cbnZhciBfbmF0aXZlTm9kZVRvRGVidWdOb2RlID0gbmV3IE1hcDxhbnksIERlYnVnTm9kZT4oKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldERlYnVnTm9kZShuYXRpdmVOb2RlOiBhbnkpOiBEZWJ1Z05vZGUge1xuICByZXR1cm4gX25hdGl2ZU5vZGVUb0RlYnVnTm9kZS5nZXQobmF0aXZlTm9kZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBbGxEZWJ1Z05vZGVzKCk6IERlYnVnTm9kZVtdIHtcbiAgcmV0dXJuIE1hcFdyYXBwZXIudmFsdWVzKF9uYXRpdmVOb2RlVG9EZWJ1Z05vZGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5kZXhEZWJ1Z05vZGUobm9kZTogRGVidWdOb2RlKSB7XG4gIF9uYXRpdmVOb2RlVG9EZWJ1Z05vZGUuc2V0KG5vZGUubmF0aXZlTm9kZSwgbm9kZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVEZWJ1Z05vZGVGcm9tSW5kZXgobm9kZTogRGVidWdOb2RlKSB7XG4gIF9uYXRpdmVOb2RlVG9EZWJ1Z05vZGUuZGVsZXRlKG5vZGUubmF0aXZlTm9kZSk7XG59XG4iXX0=