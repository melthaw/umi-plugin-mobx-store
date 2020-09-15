import { observable, action } from "mobx";

class Foo {
  @observable bar = '';

  @action
  setBar(text) {
    this.bar = text;
  }

  @action
  clearBar() {
    this.bar = '';
  }
}

export default new Foo();
