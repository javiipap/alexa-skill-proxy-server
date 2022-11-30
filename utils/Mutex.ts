import { Mutex } from 'async-mutex';

export default class Queue {
  static pendung: { [key: string]: Mutex } = {};
  static async push(mail: string) {
    if (mail in Queue.pendung) {
      console.error(`PANIC: ${mail}`);
      return;
    }

    Queue.pendung[mail] = new Mutex();
    await Queue.pendung[mail].acquire();
    console.log('Bloqueando el thread');
  }

  static async wait(mail: string) {
    if (mail in Queue.pendung) {
      console.log('Esperando el thread');
      await Queue.pendung[mail].waitForUnlock();
      console.log('salió');
      delete Queue.pendung[mail];
    }
  }

  static release(mail: string) {
    if (mail in Queue.pendung) {
      console.log('Desbloqueando el thread');
      Queue.pendung[mail].release();
    } else {
      console.error('Ya estaba vacío!!');
    }
  }
}
