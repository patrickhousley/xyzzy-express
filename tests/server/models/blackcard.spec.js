import {expect} from 'chai';
import db from '../../../models/index';

describe('BlackCard Model', () => {

  it('should exist on the db object', () => {
    expect(db).to.not.be.null;
    expect(db['BlackCard']).to.not.be.null;
    expect(db.BlackCard).to.not.be.null;
  });

})
