import { Controller, Get, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable, interval, map } from 'rxjs';


//Shape of the expected Data for Container:
interface MessageEvent {
  data: string | object;
}
@Controller("app")
export class AppController {



  constructor(private readonly appService: AppService) {}

  @Get("hello")
  getHello(): string {


    return this.appService.getHello();
  }
// Notification Controller
  @Sse('event')
    sendEvent(): Observable<MessageEvent> {
        return interval(1000).pipe(
          map((num: number) => ({
          data: 'hello ' + num,
        })),
        );
    }
}
