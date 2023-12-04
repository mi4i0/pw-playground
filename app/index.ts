import { PageHolder } from './abstractClass';
import { DummyPage } from './dummyPage';

export class DummyApp extends PageHolder {
  public dummyPage: DummyPage = new DummyPage(this.page, this.context);
}
