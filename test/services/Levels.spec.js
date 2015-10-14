import LevelsService from '../../src/services/Levels.js'
import { React, TestUtils, fixtures, testdom } from '../react-helpers';
import { Map, Stack }  from 'immutable';
require("babel/polyfill");

describe("Levels Service", () => {
  let Levels;
  let appState;
  let result;

  beforeEach(() => {
    Levels = new LevelsService();
  });

  describe("set viewModel", () => {
    let current;
    let expectation;
    let proposal;

    describe("selection is child", () => {
      beforeEach(() => {

        current = Map({
          waypoints: { id:1, title: 'home' },
          waypoint: { id: 1, title: 'tada' },
          checkpoint: { id: 1, title: 'tada' },
          resource: false
        });

        expectation = {
          current: 'resource',
          waypoints: { id:1, title: 'home' },
          waypoint: { id: 1, title: 'tada' },
          checkpoint: { id: 1, title: 'tada' },
          resource: { id: 1, title: 'yo' }
        };

        let selection = { type: 'resource', title: 'yo', id: 1 };
        proposal = Levels.set({ current, selection });
      });

      it("sets the model to the proposal", () => {
        expect(proposal).to.deep.equal(expectation);
      });
    });

    describe("selection is parent", () => {
      beforeEach(() => {

        current = Map({
          waypoints: { id:1, title: 'home' },
          waypoint: { id: 1, title: 'tada' },
          checkpoint: { id: 1, title: 'tada' },
          resource: { id: 1, title: 'tada' }
        });

        expectation = {
          current: 'waypoint',
          waypoints: { id:1, title: 'home' },
          waypoint: { id: 1, title: 'tada' },
          checkpoint: false,
          resource: false
        };

        let selection = { type: 'waypoint', title: 'tada', id: 1 };
        proposal = Levels.set({ current, selection });
      });

      it("sets the model to the proposal", () => {
        expect(proposal).to.deep.equal(expectation);
      });
    });
  });
});
