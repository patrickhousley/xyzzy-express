import {expect} from 'chai';
import database from '../../../models/index';

describe('BlackCard Model', () => {

  let db = database({ env: 'test' })

  it('should exist on the db object', () => {
    expect(db).to.exist;
    expect(db['BlackCard']).to.exist;
    expect(db.BlackCard).to.exist;
  });

  describe('Insert', () => {
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
          cb(err);
        });
      }).catch((err) => {
        cb(err);
      });
    });

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
        cb(err);
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
        cb(err);
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

  });

});
