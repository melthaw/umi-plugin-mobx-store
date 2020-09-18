import {observable, action} from "mobx";

export class Foo {

    root = null;

    constructor(root) {
        this.root = root
    }

    @observable bar = '';

    @action
    setBar(text) {
        this.bar = text;
        this.root.foo = null
    }

    @action
    clearBar() {
        this.bar = '';
    }
}

