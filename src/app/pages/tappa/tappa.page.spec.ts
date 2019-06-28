import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TappaPage } from './tappa.page';

describe('TappaPage', () => {
  let component: TappaPage;
  let fixture: ComponentFixture<TappaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TappaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TappaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
