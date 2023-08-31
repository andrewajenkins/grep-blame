import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Command<T> {
  action: T;
  payload?: any;
}

export enum Action {
  PREVIEW_DATA = 'ACTION_PREVIEW_DATA',
  OPEN_PAGE = 'ACTION_OPEN_PAGE',
  DO_GREP = 'ACTION_DO_GREP',
}

@Injectable({
  providedIn: 'root',
})
export class CommandService {
  private commandSubject = new Subject<Command<Action>>();
  action$ = this.commandSubject.asObservable();

  constructor() {}

  send(command: Command<Action>) {
    this.commandSubject.next(command);
  }
}
