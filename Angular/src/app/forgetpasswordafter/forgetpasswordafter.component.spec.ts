import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetpasswordafterComponent } from './forgetpasswordafter.component';

describe('ForgetpasswordafterComponent', () => {
  let component: ForgetpasswordafterComponent;
  let fixture: ComponentFixture<ForgetpasswordafterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForgetpasswordafterComponent]
    });
    fixture = TestBed.createComponent(ForgetpasswordafterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
