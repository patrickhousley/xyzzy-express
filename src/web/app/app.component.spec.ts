import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TestBed,
  ComponentFixture,
  async,
  inject
} from '@angular/core/testing';

import { AppComponent } from 'src/web/app/app.component';

@Component({
  selector: 'xyzzy2-test-component',
  template: '<div id="testComponent">test</div>'
})
class TestHostComponent {}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: '',
            component: TestHostComponent
          }
        ])
      ],
      declarations: [AppComponent, TestHostComponent]
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it(
    'should populate the primary component',
    async(
      inject([Router], (router: Router) => {
        fixture.detectChanges();

        expect(component).toBeTruthy();

        // Navigate and run tests
        router.navigate(['']).then(() => {
          fixture.detectChanges();

          const result: DebugElement = fixture.debugElement.query(
            By.css('#testComponent')
          );
          expect(result).toBeTruthy();
          expect(result.nativeNode.textContent.trim()).toBe('test');
        });
      })
    )
  );
});
