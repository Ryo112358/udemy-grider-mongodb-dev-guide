const assert = require('assert');

const User = require('../src/model/user');

describe('Updating records –', () => {
  let neal;
  let armstrong;

  beforeEach((done) => {
    neal = new User({ name: 'Neal', postCount: 0 });
    armstrong = new User({ name: 'Neal', postCount: 22 });
    neal.save()
      .then(() => armstrong.save())
      .then(() => done());
  });

  // --- Helper ------------------------
  /* Performs same asserts as first it() test */
  function assert_recordCountOne_nameNealCaffrey(persist, done) {
    persist
      .then(() => User.find({}))
      .then((users) => {
        assert(users.length === 2);
        assert(users[0]['name'] === 'Neal Caffrey');
        done();
      });
  }

  // --- Tests -------------------------
  it('instance type using set & save', (done) => {
    neal.set('name', 'Neal Caffrey'); // Changes 'name' in-memory; to be persisted
    neal.save()
      .then(() => User.find({}))
      .then((users) => {
        assert(users.length === 2);
        assert(users[0]['name'] === 'Neal Caffrey');
        done();
      });
  });

  it('instance type using update', (done) => {
    assert_recordCountOne_nameNealCaffrey(neal.updateOne({ name: 'Neal Caffrey' }), done);
  });

  it('class type using update', (done) => {
    assert_recordCountOne_nameNealCaffrey(
      User.updateMany({ name: 'Neal' }, { name: 'Neal Caffrey' }),
      done
    );
  });

  it('class type updating one record', (done) => {
    assert_recordCountOne_nameNealCaffrey(
      User.findOneAndUpdate(
        { name: 'Neal' },
        { name: 'Neal Caffrey' },
        { useFindAndModify: false }
      ),
      done
    );
  });

  it('class type updating record found by id', (done) => {
    assert_recordCountOne_nameNealCaffrey(
      User.findByIdAndUpdate(neal._id, { name: 'Neal Caffrey' }, { useFindAndModify: false }),
      done
    );
  });

  it('increment users post count by 1', (done) => {
    User.updateMany({ name: 'Neal' }, { $inc: { postCount: 1 }})
      .then(() => User.find({ name: 'Neal' }))
      .then((users) => {
        assert(users.length === 2);
        assert(users[0]['postCount'] === 1);
        assert(users[1]['postCount'] === 23);
        done();
      });
  });

});