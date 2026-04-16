import { Login } from './login';
import { BehaviorSubject } from 'rxjs';

describe('Login component logic', () => {
  it('reads adminOnly flag from query params', () => {
    const component = new Login(
      { user$: new BehaviorSubject(null), login: async () => ({}), logout: async () => undefined, isCurrentUserAdmin: () => false } as never,
      { navigateByUrl: async () => true } as never,
      { snapshot: { queryParamMap: { get: (key: string) => (key === 'adminOnly' ? '1' : null) } } } as never,
      { error: () => undefined, success: () => undefined, info: () => undefined } as never
    );

    expect(component.adminOnlyNotice).toBe(true);
    expect(component.requiresAdmin).toBe(true);
  });
});
