import { Component } from '@angular/core';
import { faLink, faFax, faTrowel, faChartArea, faSearch, faUser , faGift} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  link = faLink;
  faceBook = faFax;
  tweet = faTrowel;
  insta = faChartArea;
  google = faSearch;
  linkedIn = faUser;
  git = faGift;
}
