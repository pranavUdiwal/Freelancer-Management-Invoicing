class BaseController {
  sendSuccess(res, data, statusCode = 200, message = 'Success') {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data,
    });
  }

  sendCreated(res, data, message = 'Created successfully.') {
    return this.sendSuccess(res, data, 201, message);
  }

  sendNoContent(res) {
    return res.status(204).send();
  }
}

module.exports = BaseController;
