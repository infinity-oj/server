/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "hero";

export interface HeroById {
  id: number;
}

export interface Hero {
  id: number;
  name: string;
}

export interface Book {
  name: string;
  author: string;
  price: number;
}

export interface Cart {
  books: number;
  price: number;
}

export const HERO_PACKAGE_NAME = "hero";

export interface HeroesServiceClient {
  findOne(request: HeroById, metadata?: Metadata): Observable<Hero>;

  liveCartValue(request: Observable<Book>, metadata?: Metadata): Observable<Cart>;
}

export interface HeroesServiceController {
  findOne(request: HeroById, metadata?: Metadata): Promise<Hero> | Observable<Hero> | Hero;

  liveCartValue(request: Observable<Book>, metadata?: Metadata): Observable<Cart>;
}

export function HeroesServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findOne"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("HeroesService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = ["liveCartValue"];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("HeroesService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const HEROES_SERVICE_NAME = "HeroesService";
