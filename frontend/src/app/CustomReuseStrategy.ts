import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from "@angular/router";

export class CustomReuseStrategy implements RouteReuseStrategy {

    private handlers: Map<string, DetachedRouteHandle> = new Map;


    constructor () {

    }

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return true;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        //console.error(route.url?.slice(0, 1) + " ----- " + route.parent.url.join("/"))
        //this.handlers.set(route.url?.slice(0, 1).join("/") || route.parent.url.join("/") ,handle);
      if(route.data.shouldReuse)
        this.handlers.set(route.url?.slice(0, 1).join("/") || route.parent.url.join("/"), handle)
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        //return this.handlers.has(route.url?.slice(0, 1).join("/") || route.parent.url.join("/"));
        return this.handlers.has(route.url?.slice(0, 1).join("/") || route.parent.url.join("/"));
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        //return this.handlers.get(route.url?.slice(0, 1).join("/") || route.parent.url.join("/"));
        let handle =  this.handlers.get(route.url?.slice(0, 1).join("/") || route.parent.url.join("/"));
        return handle;
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }

}
