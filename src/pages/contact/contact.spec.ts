import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Contact } from './contact';

describe('Contact', () => {
  let component: Contact;
  let fixture: ComponentFixture<Contact>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contact],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Contact);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('validates required contact fields before sending', () => {
    expect(component.canSend()).toBeFalsy();

    component.name = 'Teszt Elek';
    component.email = 'teszt@example.com';
    component.message = 'Szeretnék ajánlatot kérni.';

    expect(component.canSend()).toBeTruthy();
  });
});
