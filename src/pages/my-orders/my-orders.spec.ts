import { MyOrders } from './my-orders';
import { BehaviorSubject } from 'rxjs';

describe('MyOrders timeline logic', () => {
  function createComponent() {
    return new MyOrders(
      { user$: new BehaviorSubject(null), getUser: () => null } as never,
      { getOrdersByUserStream: () => () => undefined } as never
    );
  }

  it('returns correct timeline step for statuses', () => {
    const component = createComponent();

    expect(component.getTimelineStep('uj')).toBe(1);
    expect(component.getTimelineStep('feldolgozas alatt')).toBe(2);
    expect(component.getTimelineStep('teljesitve')).toBe(3);
    expect(component.getTimelineStep('lemondva')).toBe(-1);
  });

  it('marks reached timeline steps', () => {
    const component = createComponent();

    expect(component.isTimelineReached('feldolgozas alatt', 1)).toBe(true);
    expect(component.isTimelineReached('feldolgozas alatt', 2)).toBe(true);
    expect(component.isTimelineReached('feldolgozas alatt', 3)).toBe(false);
  });
});
