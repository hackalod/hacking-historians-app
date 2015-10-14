import AppStoreStore from '../../src/stores/AppState.js';
import AppStoreConstants from '../../src/constants/AppStateConstants.js';
import { React, TestUtils, fixtures, testdom } from '../react-helpers';
import { Map, Stack }  from 'immutable';

describe("AppStore Store", () => {
  let AppStore;
  let TimeMachine;
  let state;
  let ViewModel;
  let selection;
  let Levels;
  let Modes;

  let modes = Map({
    current: 'curate',
    learn: 'disabled',
    curate: 'active'
  });

  let levels = Map({
    current: 'waypoint',
    waypoints: 'all',
    waypoint: 1,
    checkpoint: false
  });

  beforeEach(() => {
    state = Map({
      user: 'yeehaa',
      modes,
      levels
    });
    TimeMachine = {};
    ViewModel = {};
    Levels = {};
    Modes = {};

    ViewModel.get = sinon.spy();
    TimeMachine.get = sinon.stub().returns(state);

    AppStore = new AppStoreStore(TimeMachine, ViewModel, Levels, Modes);

    AppStore.emitChange = sinon.spy();
    AppStore.Levels.set = sinon.stub().returns(selection);
    AppStore.Modes.set = sinon.stub().returns(selection);
    AppStore.Modes.toggle = sinon.stub().returns(selection);
    AppStore.TimeMachine.update = sinon.stub().returns(true);
  });

  describe("get current state", () => {
    let appState;

    beforeEach((done) => {
      AppStore.get().then((data) => {
        appState = data.appState;
        done();
      });
    });

    it("gets the current state from the time machine", () => {
      expect(TimeMachine.get).to.be.called;
    })

    it("gets the corresponding view model", () => {
      expect(ViewModel.get).to.be.calledWith(state);
    })
  })

  describe("actions", () => {
    let action;

    describe("authentication", () => {

      beforeEach(() => {
        action = { actionType: AppStoreConstants.AUTHENTICATE }
        AppStore.TimeMachine.update = sinon.stub().returns(true);
        AppStore.handleAction(action);
      });

      it("passes the new user to the Time Machine", () => {
        let viewModel = { waypoints: 'user' };
        expect(AppStore.TimeMachine.update).calledWith({ user: 'yeehaa', viewModel });
      });
    });

    describe("set Levels", () => {
      let current;

      beforeEach(() => {
        current = state.get('levels');
        action = { actionType: AppStoreConstants.SET_LEVEL, selection }

        AppStore.handleAction(action);
      });

      it("calls the view model set function", () => {
        expect(AppStore.Levels.set).calledWith({ current, selection });
      });

      it("passes the selection to the Time Machine", () => {
        let levels = selection;
        expect(AppStore.TimeMachine.update).calledWith({ levels });
      });

      it("emits a change", () => {
        expect(AppStore.emitChange).called;
      });
    });

    describe("set a new mode", () => {

      beforeEach(() => {
        action = {
          actionType: AppStoreConstants.SET_MODE,
          mode: 'learn'
        }
        AppStore.TimeMachine.update = sinon.stub().returns(true);
        AppStore.handleAction(action);
      });

      it("calls the view model set function", () => {
        expect(AppStore.Modes.set).calledWith('learn');
      });

      it("passes the new user to the Time Machine", () => {
        let modes = selection;
        expect(AppStore.TimeMachine.update).calledWith({ modes });
      });

      it("emits a change", () => {
        expect(AppStore.emitChange).called;
      });
    });

    describe("toggle between modes", () => {

      beforeEach(() => {
        action = {
          actionType: AppStoreConstants.TOGGLE_MODE,
        }
        AppStore.TimeMachine.update = sinon.stub().returns(true);
        AppStore.handleAction(action);
      });

      it("calls the view model set function", () => {
        expect(AppStore.Modes.toggle).called;
      });

      it("passes the new user to the Time Machine", () => {
        let modes = selection;
        expect(AppStore.TimeMachine.update).calledWith({ modes });
      });

      it("emits a change", () => {
        expect(AppStore.emitChange).called;
      });
    });


    describe("move history back", () => {

      beforeEach(() => {
        action = { actionType: AppStoreConstants.REVERT_HISTORY }
      });

      describe("if changes are accepted", () => {

        beforeEach(() => {
          AppStore.TimeMachine.revertHistory = sinon.stub().returns(true);
          AppStore.handleAction(action);
        });

        it("should pass the new user to the Time Machine", () => {
          expect(AppStore.TimeMachine.revertHistory).called;
        });

        it("should emit a change", () => {
          expect(AppStore.emitChange).called;
        });
      });

      describe("if changes are declined", () => {

        beforeEach(() => {
          AppStore.TimeMachine.revertHistory = sinon.stub().returns(false);
          AppStore.handleAction(action);
        });

        it("should pass the new user to the Time Machine", () => {
          expect(AppStore.TimeMachine.revertHistory).called;
        });

        it("should emit a change", () => {
          expect(AppStore.emitChange).not.called;
        });
      });
    });

    describe("move history forward", () => {

      beforeEach(() => {
        action = { actionType: AppStoreConstants.FORWARD_HISTORY }
      });

      describe("if changes are accepted", () => {

        beforeEach(() => {
          AppStore.TimeMachine.forwardHistory = sinon.stub().returns(true);
          AppStore.handleAction(action);
        });

        it("should pass the new user to the Time Machine", () => {
          expect(AppStore.TimeMachine.forwardHistory).called;
        });

        it("should emit a change", () => {
          expect(AppStore.emitChange).called;
        });
      });

      describe("if changes are declined", () => {

        beforeEach(() => {
          AppStore.TimeMachine.forwardHistory = sinon.stub().returns(false);
          AppStore.handleAction(action);
        });

        it("should pass the new user to the Time Machine", () => {
          expect(AppStore.TimeMachine.forwardHistory).called;
        });

        it("should emit a change", () => {
          expect(AppStore.emitChange).not.called;
        });
      });
    });

    describe("marks an item as done", () => {
      let selection;

      beforeEach(() => {
        selection = 'hi';

        action = {
          actionType: AppStoreConstants.TOGGLE_COMPLETE,
          selection: selection
        }
        AppStore.ViewModel.checkDone = sinon.spy();
        AppStore.handleAction(action);
      });

      it("checks done on the view model", () => {
        expect(AppStore.ViewModel.checkDone).calledWith(selection);
      });

      it("emits a change", () => {
        expect(AppStore.emitChange).called;
      });
    });

    describe("highlights an item", () => {
      let selection;

      beforeEach(() => {
        selection = 'hi';

        action = {
          actionType: AppStoreConstants.SET_HIGHLIGHT,
          selection: selection,
          status: true,
          context: 'sidebar'
        }
        AppStore.ViewModel.setHighlight = sinon.spy();
        AppStore.handleAction(action);
      });

      it("checks done on the view model", () => {
        expect(AppStore.ViewModel.setHighlight).calledWith(selection, true, 'sidebar');
      });

      it("emits a change", () => {
        expect(AppStore.emitChange).called;
      });
    });

    describe("update props", () => {
      let propData;;

      beforeEach(() => {
        let propName = 'title';
        let value = 'Hello World';
        propData = { propName, value };

        action = {
          actionType: AppStoreConstants.UPDATE_MODEL_PROP,
          propData: propData
        }
        AppStore.ViewModel.update = sinon.spy();
        AppStore.handleAction(action);
      });

      it("update the prop on the view model", () => {
        expect(AppStore.ViewModel.update).calledWith(propData);
      });

      it("emits a change", () => {
        expect(AppStore.emitChange).called;
      });
    });

    describe("update criteria", () => {
      let selection;

      beforeEach(() => {
        selection = { resource: 1, 'clarity': 2 };

        action = {
          actionType: AppStoreConstants.UPDATE_CRITERIA,
          selection: selection
        };

        AppStore.ViewModel.updateCriteria = sinon.spy();
        AppStore.handleAction(action);
      });

      it("with a new value", () => {
        expect(AppStore.ViewModel.updateCriteria).calledWith({
          levels: levels.toJS(), criterium: selection
        });
      });

      it("emits a change", () => {
        expect(AppStore.emitChange).called;
      });
    });
  });
});

function createPropertyStub(object, propertyName, state){
  Object.defineProperty(object, propertyName, {
    get(){ return { toJS(){ return state; } } }
  });
}
