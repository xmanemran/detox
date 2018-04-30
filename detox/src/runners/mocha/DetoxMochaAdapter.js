class DetoxMochaAdapter {
    constructor(detox) {
        this.detox = detox;
    }

    async beforeEach(context) {
        await this.detox.beforeEach({
            title: context.currentTest.title,
            fullName: '',
            status: 'running',
        });
    }

    async afterEach(context) {
        await this.detox.beforeEach({
            title: context.currentTest.title,
            fullName: '',
            status: 'running',
        });
    }
}

module.exports = DetoxMochaAdapter;