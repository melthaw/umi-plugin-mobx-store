import React, { Component } from 'react';
import { observer, inject } from 'umi';
import foo from '@/models/foo';

@inject('foo')
@observer
export default class Home extends Component {
  render() {
    const foo = this.props.foo;
    return (
      <div>
        record: {JSON.stringify(foo)}
        <input value={foo.bar} onChange={(event) => foo.setBar(event.target.value)} />
        <button onClick={foo.clearBar}>Clear</button>
      </div>
    );
  }
}
