import {expect} from 'chai';
import database from '../../../models/index';

describe('BlackCard Model', () => {

  let db = database({ env: 'test' })

  it('should exist on the db object', () => {
    expect(db).to.not.be.null;
    expect(db['BlackCard']).to.not.be.null;
    expect(db.BlackCard).to.not.be.null;
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
        expect(blackCard).to.not.be.null;
        expect(blackCard.id).to.equal(1);
        expect(blackCard.text).to.equal('test');
        expect(blackCard.draw).to.equal(0);
        expect(blackCard.pick).to.equal(1);
        expect(blackCard.watermark).to.be.undefined;
        cb();
      }).catch((err) => {
        cb(err);
      });
    });

  });

});
