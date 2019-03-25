import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlRoomComponent } from './control-room.component';

describe('ControlRoomComponent', () => {
  let component: ControlRoomComponent;
  let fixture: ComponentFixture<ControlRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
