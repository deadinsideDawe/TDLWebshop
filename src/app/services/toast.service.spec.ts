import { ToastService } from './toast.service';
import { ToastMessage } from './toast.service';

describe('ToastService', () => {
  it('adds success toast to stream', () => {
    const service = new ToastService();
    service.success('Siker', 'Mentve', 5000);

    let current: ToastMessage[] = [];
    service.toasts$.subscribe(items => {
      current = items;
    }).unsubscribe();

    expect(current.length).toBe(1);
    expect(current[0].kind).toBe('success');
    expect(current[0].title).toBe('Siker');
  });

  it('removes toast by id', () => {
    const service = new ToastService();
    service.info('Info', 'Teszt', 5000);

    let current: any[] = [];
    service.toasts$.subscribe(items => {
      current = items;
    }).unsubscribe();

    const id = current[0].id;
    service.remove(id);

    service.toasts$.subscribe(items => {
      current = items;
    }).unsubscribe();

    expect(current.length).toBe(0);
  });
});
