import * as express from 'express';

module 'express' {
  interface Response implements express.Response {
    _header: any;
  }
}
