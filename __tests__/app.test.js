const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Muppet = require('../lib/models/muppet');

describe('Lab-33-Fullstack-be routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('creates a muppet', () => {
    return request(app)
      .post('/api/v1/muppets')
      .send({
        name: 'Animal',
        performer: 'Frank Oz',
        image: 'https://static.wikia.nocookie.net/muppet/images/7/78/AN_004.jpg/revision/latest?cb=20111004221237'
      })

      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'Animal',
          performer: 'Frank Oz',
          image: 'https://static.wikia.nocookie.net/muppet/images/7/78/AN_004.jpg/revision/latest?cb=20111004221237'
        });
      });
  });

  it('gets all muppets', async() => {
    const muppets = await Promise.all([
      { name: 'Animal', performer: 'Frank Oz', image: 'https://static.wikia.nocookie.net/muppet/images/7/78/AN_004.jpg/revision/latest?cb=20111004221237' },
      { name: 'Kermit', performer: 'Jim Henson', image: 'https://static.wikia.nocookie.net/muppet/images/7/79/Kermit-the-frog.jpg/revision/latest?cb=20101015153557' },
      { name: 'Janice', performer: 'Richard Hunt', image: 'https://static.wikia.nocookie.net/muppet/images/e/e5/Janice_m15.jpg/revision/latest?cb=20151008230827' }
    ].map(muppet => Muppet.insert(muppet)));

    return request(app)
      .get('/api/v1/muppets')
      .then(res => {
        muppets.forEach(muppet => {
          expect(res.body).toContainEqual(muppet);
        });
      });
  });
});

it('gets a muppet by id', async() => {
  const expected = 
    {
      id: '1',
      name: 'Animal', 
      performer: 'Frank Oz', 
      image: 'https://static.wikia.nocookie.net/muppet/images/7/78/AN_004.jpg/revision/latest?cb=20111004221237'
    };

  const data = await request(app)
    .get('/api/v1/muppets/1');

  expect(data.body).toEqual(expected);
});

it('updates a muppet by id', async() => {
  const muppet = await Muppet.insert({
    name: 'Kermit',
    performer: 'Jim Henson',
    image: 'test.png'
  });

  return request(app)
    .put(`/api/v1/muppets/${muppet.id}`)
    .send({
      name: 'Gonzo',
      performer: 'Frank Oz',
      image: 'test2.png'
    })
    .then(res => {
      expect(res.body).toEqual({
        id: expect.any(String),
        name: 'Gonzo',
        performer: 'Frank Oz',
        image: 'test2.png'
      });
    });
});

it('deletes a muppet by id', async() => {
  const expectation = {};

  await request(app)
    .delete('/api/v1/muppets/1');
    
  const data = await request(app)
    .get('/api/v1/muppets/1');

  expect(data.body).toEqual(expectation);
});
