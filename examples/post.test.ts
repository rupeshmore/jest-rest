/// <reference types="../types/global" />

describe('Post test', () => {
  test('/post', async () => {
    const post = await axios.post('https://httpbin.org/post', { foo: 'bar' }).catch((err) => err.response);
    expect(post.status).toBe(200);
  });
});
