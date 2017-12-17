class Result {
    constructor() {
        this.status = Result.STATUS_ERROR;
        this.message = '';
        this.obj = null;
        this.list = [];
    }
}
Result.STATUS_SUCCESS = 'SUCCESS';
Result.STATUS_ERROR = 'ERROR';
Result.STATUS_TIMEOUT = 'TIMEOUT';
Result.STATUS_REDIRECT = 'REDIRECT';

module.exports = Result;