import { expect } from 'chai';
import { describe, it } from 'mocha';
import {
  InteractionResponseType,
  InteractionType,
  InteractionResponseFlags,
} from 'discord-interactions';
import sinon from 'sinon';
import server from '../src/server.js';
import * as dotenv from 'dotenv';
import { ROLL_COMMAND } from '../src/commands.js';

dotenv.config({path: './.dev.vars'});
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const env = {SUPABASE_URL, SUPABASE_KEY};
console.log(process.env.SUPABASE_URL);

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
