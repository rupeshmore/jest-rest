/// <reference types="../types/global" />

describe('Get test', () => {
  test('get', async () => {
    const get = await axios.get('https://httpbin.org/get', { headers: { token: 'sometoken' } });
    await jestRest.debug();
    expect(get.status).toBe(200);
  });
});
