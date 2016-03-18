import {expect} from 'chai';
import database from '../../../models/index';

describe('Database', () => {

  let db = database({ env: 'test' })

  it('should contain environment', () => {
    expect(db.env).to.exist;
  });

  it('should be test environment', () => {
    expect(db.env).to.equal('test');
  });

  it('should contain config', () => {
    expect(db.config).to.exist;
  });

  it('should contain test config', () => {
    expect(db.config.storage).to.equal('./db/pyx.test.sqlite');
  });

  it('should contain reference to sequelize', () => {
    expect(db.sequelize).to.exist;
  });

  it('should be capable of syncing', (cb) => {
    db.sequelize.sync({ logging: false }).then((res) => {
      expect(res).to.exist;
      cb();
    }).catch((err) => {
      cb(err);
    });
  });

});
