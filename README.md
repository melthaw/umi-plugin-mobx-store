# umi-plugin-mobx-store

The umi plugin for [mobx-react](https://github.com/mobxjs/mobx-react).

You can use it instead of dva, or use it with [@umijs/plugin-dva](https://umijs.org/zh-CN/plugins/plugin-dva) and [@umijs/plugin-model](https://umijs.org/zh-CN/plugins/plugin-model).

These three types of models(dva, hooks, mobx) can coexist in the `models/` directory.

## Install

```shell script
npm install umi-plugin-mobx-store --dev
```

## Usage

> Visit [here](/example) to see the whole example

Create a model file and use the standard mobx syntax to define your models under `models/` dir:

```typescript
/**
 * @file models/foo.ts
 */
import {observable,action} from "mobx";

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

```

Using mobx-react with React Hooks (**recommended**):

```typescript jsx
/**
 * @file pages/index.tsx
 */
import React from 'react';
import { userMobxStore, observer } from 'umi';

function Index(): JSX.Element {
  const { foo } = userMobxStore(); // the property name is same as model file's basename.
  return (
    <div>
      record: {JSON.stringify(foo)}
      <input
        value={foo.bar}
        onChange={event => foo.setBar(event.target.value)}
      />
      <button onClick={foo.clearBar}>Clear</button>
    </div>
  );
}

export default observer(Index);
```

Using mobx-react with Decorator:

```typescript jsx
/**
 * @file pages/home.tsx
 */
import React, { Component } from 'react';
import { observer, inject } from 'umi';
import foo from '@/models/foo';

@inject('foo') // the property name is same as model file's basename.
@observer
export default class Home extends Component {
  render(): JSX.Element {
    const foo = this.props.foo;
    return (
      <div>
        record: {JSON.stringify(foo)}
        <input
          value={foo.bar}
          onChange={event => foo.setBar(event.target.value)}
        />
        <button onClick={foo.clearBar}>Clear</button>
      </div>
    );
  }
}
```
