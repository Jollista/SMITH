import { expect } from 'chai';
import { describe, it, beforeEach, afterEach } from 'mocha';
import server from '../src/server.js';

describe('Server', () => {
  describe('GET /', () => {
    it('should return a greeting message with the Discord application ID', async () => {
      const request = {
        method: 'GET',
        url: new URL('/', 'http://discordo.example'),
      };
      const env = { DISCORD_APPLICATION_ID: '123456789' };

      const response = await server.fetch(request, env);
      const body = await response.text();

      expect(body).to.equal('👋 123456789');
    });
  });
});
