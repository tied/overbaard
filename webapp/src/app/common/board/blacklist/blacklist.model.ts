import {List} from 'immutable';
import {makeTypedFactory, TypedRecord} from 'typed-immutable-record';

export interface BlacklistState {
  states: List<string>;
  issueTypes: List<string>;
  priorities: List<string>;
  issues: List<string>;
}


const DEFAULT_STATE: BlacklistState = {
  states: List<string>(),
  issueTypes: List<string>(),
  priorities: List<string>(),
  issues: List<string>()
};

export interface BlacklistStateRecord extends TypedRecord<BlacklistStateRecord>, BlacklistState {
}

const STATE_FACTORY = makeTypedFactory<BlacklistState, BlacklistStateRecord>(DEFAULT_STATE);
export const initialBlacklistState: BlacklistState = STATE_FACTORY(DEFAULT_STATE);

export class BlacklistUtil {
  static fromJs(input: any): BlacklistState {
    const state: BlacklistState = {
      states: List<string>(input['states'] ? input['states'] : []),
      issueTypes: List<string>(input['issue-types'] ? input['issue-types'] : []),
      priorities: List<string>(input['priorities'] ? input['priorities'] : []),
      issues: List<string>(input['issues'] ? input['issues'] : [])
    };

    return STATE_FACTORY(state);
  }

  static toStateRecord(s: BlacklistState): BlacklistStateRecord {
    // TODO do some checks. TS does not allow use of instanceof when the type is an interface (since they are compiled away)
    return <BlacklistStateRecord>s;
  }
}

