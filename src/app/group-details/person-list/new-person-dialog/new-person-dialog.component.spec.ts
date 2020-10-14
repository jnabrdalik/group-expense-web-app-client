import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPersonDialogComponent } from './new-person-dialog.component';

describe('NewPersonDialogComponent', () => {
  let component: NewPersonDialogComponent;
  let fixture: ComponentFixture<NewPersonDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPersonDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPersonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
