import {expect} from 'chai';
import R from 'ramda';
import database from '../../../models/index';

describe('BlackCard Model', () => {

  let db = database({ env: 'test' });
  let cardSet;

  before((cb) => {
    db.sequelize.sync({ force: true, logging: false }).then(() => {
      db.CardSet.create({
        active: true,
        name: 'test',
        base_deck: true,
        description: 'test'
      }, { logging: false }).then((res) => {
        cardSet = res;
        cb();
      }).catch((err) => {
        cb(new Error(err));
      });
    }).catch((err) => {
      cb(new Error(err));
    });
  });

  it('should exist on the db object', () => {
    expect(db).to.exist;
    expect(db['BlackCard']).to.exist;
    expect(db.BlackCard).to.exist;
  });

  describe('Insert', () => {

    it('should be capable of inserting with minimal attributes', (cb) => {
      db.BlackCard.create({
        text: 'test',
        card_set: cardSet
      }, { logging: false }).then((blackCard) => {
        expect(blackCard).to.exist;
        expect(blackCard.id).to.be.above(0);
        expect(blackCard.text).to.equal('test');
        expect(blackCard.draw).to.equal(0);
        expect(blackCard.pick).to.equal(1);
        expect(blackCard.watermark).to.not.exist;
        cb();
      }).catch((err) => {
        cb(new Error(err));
      });
    });

    it('should be capable of inserting with all attributes except id', (cb) => {
      db.BlackCard.create({
        text: 'test',
        draw: 1,
        pick: 0,
        watermark: 'mark',
        card_set: cardSet
      }, { logging: false }).then((blackCard) => {
        expect(blackCard).to.exist;
        expect(blackCard.id).to.be.above(0);
        expect(blackCard.text).to.equal('test');
        expect(blackCard.draw).to.equal(1);
        expect(blackCard.pick).to.equal(0);
        expect(blackCard.watermark).to.equal('mark');
        cb();
      }).catch((err) => {
        cb(new Error(err));
      });
    });

    it('should not allow insert with id', (cb) => {
      db.BlackCard.create({
        id: 9999999,
        text: 'test',
        card_set: cardSet
      }, { logging: false }).then((blackCard) => {
        cb(new Error('Database create promise was resolved incorrectly.'));
      }).catch((err) => {
        expect(err).to.exist;
        cb();
      });
    });

    it('should not allow more than 255 characters in text', (cb) => {
      db.BlackCard.create({
        text: R.repeat('a', 256).join(''),
        card_set: cardSet
      }, { logging: false }).then((blackCard) => {
        cb(new Error('Database create promise was resolved incorrectly.'));
      }).catch((err) => {
        expect(err).to.exist;
        cb();
      });
    });

    it('should not allow negative number for draw', (cb) => {
      db.BlackCard.create({
        text: 'test',
        draw: -1,
        card_set: cardSet
      }, { logging: false }).then((blackCard) => {
        cb(new Error('Database create promise was resolved incorrectly.'));
      }).catch((err) => {
        expect(err).to.exist;
        cb();
      });
    });

    it('should not allow negative number for pick', (cb) => {
      db.BlackCard.create({
        text: 'test',
        pick: -1,
        card_set: cardSet
      }, { logging: false }).then((blackCard) => {
        cb(new Error('Database create promise was resolved incorrectly.'));
      }).catch((err) => {
        expect(err).to.exist;
        cb();
      });
    });

    it('should not allow more than 5 characters in watermark', (cb) => {
      db.BlackCard.create({
        text: 'test',
        watermark: R.repeat('a', 6).join(''),
        card_set: cardSet
      }, { logging: false }).then((blackCard) => {
        cb(new Error('Database create promise was resolved incorrectly.'));
      }).catch((err) => {
        expect(err).to.exist;
        cb();
      });
    });

  });

  describe('Update', () => {

    let blackCard;

    before((cb) => {
      db.BlackCard.create({
        text: 'test',
        card_set: cardSet
      }, { logging: false }).then((res) => {
        blackCard = res;
        cb();
      }).catch((err) => {
        cb(new Error(err));
      });
    });
    
    it('should allow update of fields', (cb) => {
      blackCard.update({
        text: 'test2',
        draw: 2,
        pick: 2,
        watermark: 'water'
      }, { logging: false }).then((res) => {
        expect(res).to.exist;
        expect(res.id).to.be.above(0);
        expect(res.text).to.equal('test2');
        expect(res.draw).to.equal(2);
        expect(res.pick).to.equal(2);
        expect(res.watermark).to.equal('water');
        cb();
      }).catch((err) => {
        cb(new Error(err));
      });
    });

    it('should not allow update with id', (cb) => {
      /**
       * Sequelize is not throwing an exception when we try to update the
       * id. Instead it simply doesn't process the field change.
       */
      let tempId = blackCard.id;
      blackCard.update({
        id: 9999999,
        text: 'test2'
      }, { logging: false }).then((res) => {
        expect(res.id).to.equal(tempId);
        cb();
        //cb(new Error('Database create promise was resolved incorrectly.'));
      }).catch((err) => {
        expect(err).to.exist;
        cb();
      });
    });

    it('should not allow more than 255 characters in text', (cb) => {
      blackCard.update({
        text: R.repeat('a', 256).join(''),
        card_set: cardSet
      }, { logging: false }).then((res) => {
        cb(new Error('Database create promise was resolved incorrectly.'));
      }).catch((err) => {
        expect(err).to.exist;
        cb();
      });
    });

    it('should not allow negative number for draw', (cb) => {
      blackCard.update({
        text: 'test',
        draw: -1,
        card_set: cardSet
      }, { logging: false }).then((res) => {
        cb(new Error('Database create promise was resolved incorrectly.'));
      }).catch((err) => {
        expect(err).to.exist;
        cb();
      });
    });

    it('should not allow negative number for pick', (cb) => {
      blackCard.update({
        text: 'test',
        pick: -1,
        card_set: cardSet
      }, { logging: false }).then((res) => {
        cb(new Error('Database create promise was resolved incorrectly.'));
      }).catch((err) => {
        expect(err).to.exist;
        cb();
      });
    });

    it('should not allow more than 5 characters in watermark', (cb) => {
      blackCard.update({
        text: 'test',
        watermark: R.repeat('a', 6).join(''),
        card_set: cardSet
      }, { logging: false }).then((blackCard) => {
        cb(new Error('Database create promise was resolved incorrectly.'));
      }).catch((err) => {
        expect(err).to.exist;
        cb();
      });
    });

  });

  describe('Upsert', () => {

    /**
     * Sequelize uses a process of performing an update and then an insert
     * when dealing with an SQLite database. This results in the isNull
     * validation rule for the id field failing (throws a validation
     * exception). For more info, see the below link:
     * http://docs.sequelizejs.com/en/latest/api/model/?highlight=upsert
     *
     * Upsert should not be used in this project.
     */

    let blackCard;

    before((cb) => {
      db.BlackCard.create({
        text: 'test',
        card_set: cardSet
      }, { logging: false }).then((res) => {
        blackCard = res;
        cb();
      }).catch((err) => {
        cb(new Error(err));
      });
    });

    xit('should allow upsert of fields', (cb) => {
      db.BlackCard.upsert({
        id: blackCard.id,
        text: 'test2',
        draw: 2,
        pick: 2,
        watermark: 'water'
      }, { logging: false }).then((res) => {
        expect(res).to.exist;
        expect(res.id).to.be.above(0);
        expect(res.text).to.equal('test2');
        expect(res.draw).to.equal(2);
        expect(res.pick).to.equal(2);
        expect(res.watermark).to.equal('water');
        cb();
      }).catch((err) => {
        cb(new Error(err));
      });
    });

  });

  describe('Delete', () => {

    let blackCard;

    before((cb) => {
      db.BlackCard.create({
        text: 'test',
        card_set: cardSet
      }, { logging: false }).then((res) => {
        blackCard = res;
        cb();
      }).catch((err) => {
        cb(new Error(err));
      });
    });

    it('should allow deletion', (cb) => {
      blackCard.destroy({ logging: false }).then((res) => {
        // Model reference should still exist even after deletion
        // The entry in the database however will be deleted
        expect(res).to.exist;
        expect(res.id).to.be.above(0);
        expect(res.text).to.equal('test');
        expect(res.draw).to.equal(0);
        expect(res.pick).to.equal(1);
        expect(res.watermark).to.not.exist;
        cb();
      }).catch((err) => {
        cb(new Error(err));
      });
    });

  });

  describe('CardSet Integration', () => {

  });

});
