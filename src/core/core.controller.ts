import { Metadata, ServerDuplexStream, ServerUnaryCall } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable, Subject } from 'rxjs';
import { Book, Cart } from './core';
import { Hero, HeroById } from './hero';

@Controller()
export class CoreController {
  // @GrpcMethod('HeroesService', 'FindOne')
  // findOne(
  //   data: HeroById,
  //   metadata: Metadata,
  //   call: ServerUnaryCall<any, any>,
  // ): Hero {
  //   const items = [
  //     { id: 1, name: 'John' },
  //     { id: 2, name: 'Doe' },
  //   ];
  //   const item = items.find(({ id }) => id === data.id);
  //   return item;
  // }
  // @GrpcStreamMethod('HeroesService', 'liveCartValue')
  // cartValue(
  //   messages: Observable<Book>,
  //   metadata: Metadata,
  //   call: ServerDuplexStream<any, any>,
  // ): Observable<Cart> {
  //   const subject = new Subject<Cart>();
  //   const onNext = (message) => {
  //     console.log(message);
  //     subject.next({
  //       books: 0,
  //       price: 0,
  //     });
  //     const int = setInterval(() => {
  //       subject.next({
  //         books: 1,
  //         price: 1,
  //       });
  //     }, 1000);
  //   };
  //   const onComplete = () => subject.complete();
  //   messages.subscribe({
  //     next: onNext,
  //     complete: onComplete,
  //   });
  //   return subject.asObservable();
  // }
}
