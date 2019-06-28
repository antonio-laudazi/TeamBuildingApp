import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GruppiPage } from './gruppi.page';

describe('GruppiPage', () => {
  let component: GruppiPage;
  let fixture: ComponentFixture<GruppiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GruppiPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GruppiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
