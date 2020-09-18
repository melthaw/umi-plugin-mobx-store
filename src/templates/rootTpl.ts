export default `
{{{ imports }}}

class RootStore {
    {{{ declareFields }}}

    constructor() {
        {{{ initFields }}}
    }
}

export default new RootStore()

`;
