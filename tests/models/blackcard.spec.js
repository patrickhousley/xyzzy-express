import db from '../../models/index';

describe('BlackCard Model', () => {

  it('should exist on the db object', () => {
    expect(db).not.toBe(null);
    expect(db.BlackCard).not.toBe(null);
  });

})
