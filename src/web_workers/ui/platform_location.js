'use strict';var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var browser_platform_location_1 = require('angular2/src/router/location/browser_platform_location');
var di_1 = require('angular2/src/core/di');
var messaging_api_1 = require('angular2/src/web_workers/shared/messaging_api');
var service_message_broker_1 = require('angular2/src/web_workers/shared/service_message_broker');
var serializer_1 = require('angular2/src/web_workers/shared/serializer');
var bind_1 = require('./bind');
var serialized_types_1 = require('angular2/src/web_workers/shared/serialized_types');
var message_bus_1 = require('angular2/src/web_workers/shared/message_bus');
var async_1 = require('angular2/src/facade/async');
var MessageBasedPlatformLocation = (function () {
    function MessageBasedPlatformLocation(_brokerFactory, _platformLocation, bus, _serializer) {
        this._brokerFactory = _brokerFactory;
        this._platformLocation = _platformLocation;
        this._serializer = _serializer;
        this._platformLocation.onPopState(bind_1.bind(this._sendUrlChangeEvent, this));
        this._platformLocation.onHashChange(bind_1.bind(this._sendUrlChangeEvent, this));
        this._broker = this._brokerFactory.createMessageBroker(messaging_api_1.ROUTER_CHANNEL);
        this._channelSink = bus.to(messaging_api_1.ROUTER_CHANNEL);
    }
    MessageBasedPlatformLocation.prototype.start = function () {
        this._broker.registerMethod("getLocation", null, bind_1.bind(this._getLocation, this), serialized_types_1.LocationType);
        this._broker.registerMethod("setPathname", [serializer_1.PRIMITIVE], bind_1.bind(this._setPathname, this));
        this._broker.registerMethod("pushState", [serializer_1.PRIMITIVE, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._platformLocation.pushState, this._platformLocation));
        this._broker.registerMethod("replaceState", [serializer_1.PRIMITIVE, serializer_1.PRIMITIVE, serializer_1.PRIMITIVE], bind_1.bind(this._platformLocation.replaceState, this._platformLocation));
        this._broker.registerMethod("forward", null, bind_1.bind(this._platformLocation.forward, this._platformLocation));
        this._broker.registerMethod("back", null, bind_1.bind(this._platformLocation.back, this._platformLocation));
    };
    MessageBasedPlatformLocation.prototype._getLocation = function () {
        return async_1.PromiseWrapper.resolve(this._platformLocation.location);
    };
    MessageBasedPlatformLocation.prototype._sendUrlChangeEvent = function (e) {
        var loc = this._serializer.serialize(this._platformLocation.location, serialized_types_1.LocationType);
        var serializedEvent = { 'type': e.type };
        async_1.ObservableWrapper.callEmit(this._channelSink, { 'event': serializedEvent, 'location': loc });
    };
    MessageBasedPlatformLocation.prototype._setPathname = function (pathname) { this._platformLocation.pathname = pathname; };
    MessageBasedPlatformLocation = __decorate([
        di_1.Injectable(), 
        __metadata('design:paramtypes', [service_message_broker_1.ServiceMessageBrokerFactory, browser_platform_location_1.BrowserPlatformLocation, message_bus_1.MessageBus, serializer_1.Serializer])
    ], MessageBasedPlatformLocation);
    return MessageBasedPlatformLocation;
})();
exports.MessageBasedPlatformLocation = MessageBasedPlatformLocation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhdGZvcm1fbG9jYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLUJjNG13NnZYLnRtcC9hbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvdWkvcGxhdGZvcm1fbG9jYXRpb24udHMiXSwibmFtZXMiOlsiTWVzc2FnZUJhc2VkUGxhdGZvcm1Mb2NhdGlvbiIsIk1lc3NhZ2VCYXNlZFBsYXRmb3JtTG9jYXRpb24uY29uc3RydWN0b3IiLCJNZXNzYWdlQmFzZWRQbGF0Zm9ybUxvY2F0aW9uLnN0YXJ0IiwiTWVzc2FnZUJhc2VkUGxhdGZvcm1Mb2NhdGlvbi5fZ2V0TG9jYXRpb24iLCJNZXNzYWdlQmFzZWRQbGF0Zm9ybUxvY2F0aW9uLl9zZW5kVXJsQ2hhbmdlRXZlbnQiLCJNZXNzYWdlQmFzZWRQbGF0Zm9ybUxvY2F0aW9uLl9zZXRQYXRobmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsMENBQXNDLHdEQUF3RCxDQUFDLENBQUE7QUFDL0YsbUJBQXlCLHNCQUFzQixDQUFDLENBQUE7QUFDaEQsOEJBQTZCLCtDQUErQyxDQUFDLENBQUE7QUFDN0UsdUNBR08sd0RBQXdELENBQUMsQ0FBQTtBQUNoRSwyQkFBb0MsNENBQTRDLENBQUMsQ0FBQTtBQUNqRixxQkFBbUIsUUFBUSxDQUFDLENBQUE7QUFDNUIsaUNBQTJCLGtEQUFrRCxDQUFDLENBQUE7QUFDOUUsNEJBQXlCLDZDQUE2QyxDQUFDLENBQUE7QUFDdkUsc0JBQThELDJCQUEyQixDQUFDLENBQUE7QUFHMUY7SUFLRUEsc0NBQW9CQSxjQUEyQ0EsRUFDM0NBLGlCQUEwQ0EsRUFBRUEsR0FBZUEsRUFDM0RBLFdBQXVCQTtRQUZ2QkMsbUJBQWNBLEdBQWRBLGNBQWNBLENBQTZCQTtRQUMzQ0Esc0JBQWlCQSxHQUFqQkEsaUJBQWlCQSxDQUF5QkE7UUFDMUNBLGdCQUFXQSxHQUFYQSxXQUFXQSxDQUFZQTtRQUN6Q0EsSUFBSUEs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T0EsRUFBRUEsZUFBZUEsRUFBRUEsVUFBVUEsRUFBRUEsR0FBR0EsRUFBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDN0ZBLENBQUNBO0lBRU9KLG1EQUFZQSxHQUFwQkEsVUFBcUJBLFFBQWdCQSxJQUFVSyxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLFFBQVFBLEdBQUdBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO0lBdEM5Rkw7UUFBQ0EsZUFBVUEsRUFBRUE7O3FDQXVDWkE7SUFBREEsbUNBQUNBO0FBQURBLENBQUNBLEFBdkNELElBdUNDO0FBdENZLG9DQUE0QiwrQkFzQ3hDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0Jyb3dzZXJQbGF0Zm9ybUxvY2F0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvcm91dGVyL2xvY2F0aW9uL2Jyb3dzZXJfcGxhdGZvcm1fbG9jYXRpb24nO1xuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaSc7XG5pbXBvcnQge1JPVVRFUl9DSEFOTkVMfSBmcm9tICdhbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvc2hhcmVkL21lc3NhZ2luZ19hcGknO1xuaW1wb3J0IHtcbiAgU2VydmljZU1lc3NhZ2VCcm9rZXJGYWN0b3J5LFxuICBTZXJ2aWNlTWVzc2FnZUJyb2tlclxufSBmcm9tICdhbmd1bGFyMi9zcmMvd2ViX3dvcmtlcnMvc2hhcmVkL3NlcnZpY2VfbWVzc2FnZV9icm9rZXInO1xuaW1wb3J0IHtQUklNSVRJVkUsIFNlcmlhbGl6ZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvc2VyaWFsaXplcic7XG5pbXBvcnQge2JpbmR9IGZyb20gJy4vYmluZCc7XG5pbXBvcnQge0xvY2F0aW9uVHlwZX0gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9zZXJpYWxpemVkX3R5cGVzJztcbmltcG9ydCB7TWVzc2FnZUJ1c30gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9tZXNzYWdlX2J1cyc7XG5pbXBvcnQge0V2ZW50RW1pdHRlciwgT2JzZXJ2YWJsZVdyYXBwZXIsIFByb21pc2VXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2FzeW5jJztcbmltcG9ydCB7VXJsQ2hhbmdlTGlzdGVuZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9yb3V0ZXIvbG9jYXRpb24vcGxhdGZvcm1fbG9jYXRpb24nO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTWVzc2FnZUJhc2VkUGxhdGZvcm1Mb2NhdGlvbiB7XG4gIHByaXZhdGUgX2NoYW5uZWxTaW5rOiBFdmVudEVtaXR0ZXI8T2JqZWN0PjtcbiAgcHJpdmF0ZSBfYnJva2VyOiBTZXJ2aWNlTWVzc2FnZUJyb2tlcjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9icm9rZXJGYWN0b3J5OiBTZXJ2aWNlTWVzc2FnZUJyb2tlckZhY3RvcnksXG4gICAgICAgICAgICAgIHByaXZhdGUgX3BsYXRmb3JtTG9jYXRpb246IEJyb3dzZXJQbGF0Zm9ybUxvY2F0aW9uLCBidXM6IE1lc3NhZ2VCdXMsXG4gICAgICAgICAgICAgIHByaXZhdGUgX3NlcmlhbGl6ZXI6IFNlcmlhbGl6ZXIpIHtcbiAgICB0aGlzLl9wbGF0Zm9ybUxvY2F0aW9uLm9uUG9wU3RhdGUoPFVybENoYW5nZUxpc3RlbmVyPmJpbmQodGhpcy5fc2VuZFVybENoYW5nZUV2ZW50LCB0aGlzKSk7XG4gICAgdGhpcy5fcGxhdGZvcm1Mb2NhdGlvbi5vbkhhc2hDaGFuZ2UoPFVybENoYW5nZUxpc3RlbmVyPmJpbmQodGhpcy5fc2VuZFVybENoYW5nZUV2ZW50LCB0aGlzKSk7XG4gICAgdGhpcy5fYnJva2VyID0gdGhpcy5fYnJva2VyRmFjdG9yeS5jcmVhdGVNZXNzYWdlQnJva2VyKFJPVVRFUl9DSEFOTkVMKTtcbiAgICB0aGlzLl9jaGFubmVsU2luayA9IGJ1cy50byhST1VURVJfQ0hBTk5FTCk7XG4gIH1cblxuICBzdGFydCgpOiB2b2lkIHtcbiAgICB0aGlzLl9icm9rZXIucmVnaXN0ZXJNZXRob2QoXCJnZXRMb2NhdGlvblwiLCBudWxsLCBiaW5kKHRoaXMuX2dldExvY2F0aW9uLCB0aGlzKSwgTG9jYXRpb25UeXBlKTtcbiAgICB0aGlzLl9icm9rZXIucmVnaXN0ZXJNZXRob2QoXCJzZXRQYXRobmFtZVwiLCBbUFJJTUlUSVZFXSwgYmluZCh0aGlzLl9zZXRQYXRobmFtZSwgdGhpcykpO1xuICAgIHRoaXMuX2Jyb2tlci5yZWdpc3Rlck1ldGhvZChcInB1c2hTdGF0ZVwiLCBbUFJJTUlUSVZFLCBQUklNSVRJVkUsIFBSSU1JVElWRV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQodGhpcy5fcGxhdGZvcm1Mb2NhdGlvbi5wdXNoU3RhdGUsIHRoaXMuX3BsYXRmb3JtTG9jYXRpb24pKTtcbiAgICB0aGlzLl9icm9rZXIucmVnaXN0ZXJNZXRob2QoXCJyZXBsYWNlU3RhdGVcIiwgW1BSSU1JVElWRSwgUFJJTUlUSVZFLCBQUklNSVRJVkVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kKHRoaXMuX3BsYXRmb3JtTG9jYXRpb24ucmVwbGFjZVN0YXRlLCB0aGlzLl9wbGF0Zm9ybUxvY2F0aW9uKSk7XG4gICAgdGhpcy5fYnJva2VyLnJlZ2lzdGVyTWV0aG9kKFwiZm9yd2FyZFwiLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kKHRoaXMuX3BsYXRmb3JtTG9jYXRpb24uZm9yd2FyZCwgdGhpcy5fcGxhdGZvcm1Mb2NhdGlvbikpO1xuICAgIHRoaXMuX2Jyb2tlci5yZWdpc3Rlck1ldGhvZChcImJhY2tcIiwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZCh0aGlzLl9wbGF0Zm9ybUxvY2F0aW9uLmJhY2ssIHRoaXMuX3BsYXRmb3JtTG9jYXRpb24pKTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldExvY2F0aW9uKCk6IFByb21pc2U8TG9jYXRpb24+IHtcbiAgICByZXR1cm4gUHJvbWlzZVdyYXBwZXIucmVzb2x2ZSh0aGlzLl9wbGF0Zm9ybUxvY2F0aW9uLmxvY2F0aW9uKTtcbiAgfVxuXG5cbiAgcHJpdmF0ZSBfc2VuZFVybENoYW5nZUV2ZW50KGU6IEV2ZW50KTogdm9pZCB7XG4gICAgbGV0IGxvYyA9IHRoaXMuX3NlcmlhbGl6ZXIuc2VyaWFsaXplKHRoaXMuX3BsYXRmb3JtTG9jYXRpb24ubG9jYXRpb24sIExvY2F0aW9uVHlwZSk7XG4gICAgbGV0IHNlcmlhbGl6ZWRFdmVudCA9IHsndHlwZSc6IGUudHlwZX07XG4gICAgT2JzZXJ2YWJsZVdyYXBwZXIuY2FsbEVtaXQodGhpcy5fY2hhbm5lbFNpbmssIHsnZXZlbnQnOiBzZXJpYWxpemVkRXZlbnQsICdsb2NhdGlvbic6IGxvY30pO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2V0UGF0aG5hbWUocGF0aG5hbWU6IHN0cmluZyk6IHZvaWQgeyB0aGlzLl9wbGF0Zm9ybUxvY2F0aW9uLnBhdGhuYW1lID0gcGF0aG5hbWU7IH1cbn1cbiJdfQ==