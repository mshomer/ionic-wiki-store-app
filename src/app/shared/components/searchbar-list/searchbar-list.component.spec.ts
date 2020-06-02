import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchbarListComponent } from './searchbar-list.component';

describe('SearchbarListComponent', () => {
  let component: SearchbarListComponent;
  let fixture: ComponentFixture<SearchbarListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchbarListComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchbarListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
