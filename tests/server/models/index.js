import {expect} from 'chai';
import database from '../../../models/index';

describe('Database', () => {

  let db = database({ env: 'test' })

  it('should contain environment', () => {
    expect(db.env).to.not.be.null;
    expect(db.env).to.not.be.undefined;
  });

  it('should be test environment', () => {
    expect(db.env).to.equal('test');
  });

  it('should contain config', () => {
    expect(db.config).to.not.be.null;
    expect(db.config).to.not.be.undefined;
  });

  it('should contain test config', () => {
    expect(db.config.storage).to.equal('./db/pyx.test.sqlite');
  });

  it('should contain reference to sequelize', () => {
    expect(db.sequelize).to.not.be.null;
    expect(db.sequelize).to.not.be.undefined;
    expect(db.Sequelize).to.not.be.null;
    expect(db.Sequelize).to.not.be.undefined;
  });

  it('should be capable of syncing', (cb) => {
    db.sequelize.sync({ logging: false }).then((res) => {
      expect(res).to.not.be.null;
      cb();
    }).catch((err) => {
      cb(err);
    })
  });

});
