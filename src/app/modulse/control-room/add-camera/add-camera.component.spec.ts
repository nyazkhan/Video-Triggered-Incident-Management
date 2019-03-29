import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCameraComponent } from './add-camera.component';

describe('AddCameraComponent', () => {
  let component: AddCameraComponent;
  let fixture: ComponentFixture<AddCameraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCameraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
