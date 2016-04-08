import { resolveProvider, ResolvedProvider_ } from 'angular2/src/core/di/provider';
import { Provider } from 'angular2/src/core/di';
export class PipeProvider extends ResolvedProvider_ {
    constructor(name, pure, key, resolvedFactories, multiBinding) {
        super(key, resolvedFactories, multiBinding);
        this.name = name;
        this.pure = pure;
    }
    static createFromType(type, metadata) {
        var provider = new Provider(type, { useClass: type });
        var rb = resolveProvider(provider);
        return new PipeProvider(metadata.name, metadata.pure, rb.key, rb.resolvedFactories, rb.multiProvider);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZV9wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtMm5iZ0RobngudG1wL2FuZ3VsYXIyL3NyYy9jb3JlL3BpcGVzL3BpcGVfcHJvdmlkZXIudHMiXSwibmFtZXMiOlsiUGlwZVByb3ZpZGVyIiwiUGlwZVByb3ZpZGVyLmNvbnN0cnVjdG9yIiwiUGlwZVByb3ZpZGVyLmNyZWF0ZUZyb21UeXBlIl0sIm1hcHBpbmdzIjoiT0FDTyxFQUFrQixlQUFlLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSwrQkFBK0I7T0FDMUYsRUFBd0IsUUFBUSxFQUFDLE1BQU0sc0JBQXNCO0FBR3BFLGtDQUFrQyxpQkFBaUI7SUFDakRBLFlBQW1CQSxJQUFZQSxFQUFTQSxJQUFhQSxFQUFFQSxHQUFRQSxFQUNuREEsaUJBQW9DQSxFQUFFQSxZQUFxQkE7UUFDckVDLE1BQU1BLEdBQUdBLEVBQUVBLGlCQUFpQkEsRUFBRUEsWUFBWUEsQ0FBQ0EsQ0FBQ0E7UUFGM0JBLFNBQUlBLEdBQUpBLElBQUlBLENBQVFBO1FBQVNBLFNBQUlBLEdBQUpBLElBQUlBLENBQVNBO0lBR3JEQSxDQUFDQTtJQUVERCxPQUFPQSxjQUFjQSxDQUFDQSxJQUFVQSxFQUFFQSxRQUFzQkE7UUFDdERFLElBQUlBLFFBQVFBLEdBQUdBLElBQUlBLFFBQVFBLENBQUNBLElBQUlBLEVBQUVBLEVBQUNBLFFBQVFBLEVBQUVBLElBQUlBLEVBQUNBLENBQUNBLENBQUNBO1FBQ3BEQSxJQUFJQSxFQUFFQSxHQUFHQSxlQUFlQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtRQUNuQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsWUFBWUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsRUFBRUEsUUFBUUEsQ0FBQ0EsSUFBSUEsRUFBRUEsRUFBRUEsQ0FBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsQ0FBQ0EsaUJBQWlCQSxFQUMxREEsRUFBRUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsQ0FBQ0E7SUFDNUNBLENBQUNBO0FBQ0hGLENBQUNBO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1R5cGV9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge1Jlc29sdmVkRmFjdG9yeSwgcmVzb2x2ZVByb3ZpZGVyLCBSZXNvbHZlZFByb3ZpZGVyX30gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvZGkvcHJvdmlkZXInO1xuaW1wb3J0IHtLZXksIFJlc29sdmVkUHJvdmlkZXIsIFByb3ZpZGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9kaSc7XG5pbXBvcnQge1BpcGVNZXRhZGF0YX0gZnJvbSAnLi4vbWV0YWRhdGEvZGlyZWN0aXZlcyc7XG5cbmV4cG9ydCBjbGFzcyBQaXBlUHJvdmlkZXIgZXh0ZW5kcyBSZXNvbHZlZFByb3ZpZGVyXyB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcsIHB1YmxpYyBwdXJlOiBib29sZWFuLCBrZXk6IEtleSxcbiAgICAgICAgICAgICAgcmVzb2x2ZWRGYWN0b3JpZXM6IFJlc29sdmVkRmFjdG9yeVtdLCBtdWx0aUJpbmRpbmc6IGJvb2xlYW4pIHtcbiAgICBzdXBlcihrZXksIHJlc29sdmVkRmFjdG9yaWVzLCBtdWx0aUJpbmRpbmcpO1xuICB9XG5cbiAgc3RhdGljIGNyZWF0ZUZyb21UeXBlKHR5cGU6IFR5cGUsIG1ldGFkYXRhOiBQaXBlTWV0YWRhdGEpOiBQaXBlUHJvdmlkZXIge1xuICAgIHZhciBwcm92aWRlciA9IG5ldyBQcm92aWRlcih0eXBlLCB7dXNlQ2xhc3M6IHR5cGV9KTtcbiAgICB2YXIgcmIgPSByZXNvbHZlUHJvdmlkZXIocHJvdmlkZXIpO1xuICAgIHJldHVybiBuZXcgUGlwZVByb3ZpZGVyKG1ldGFkYXRhLm5hbWUsIG1ldGFkYXRhLnB1cmUsIHJiLmtleSwgcmIucmVzb2x2ZWRGYWN0b3JpZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmIubXVsdGlQcm92aWRlcik7XG4gIH1cbn1cbiJdfQ==