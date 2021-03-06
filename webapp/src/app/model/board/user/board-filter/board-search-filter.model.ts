import {Map, Set} from 'immutable';
import {makeTypedFactory, TypedRecord} from 'typed-immutable-record';
import {IssueQlNode} from '../../../../common/parsers/issue-ql/ast/node.iql';

export interface BoardSearchFilterState {
  issueIds: Set<string>;
  containingText: string;
  issueQl: string;
  parsedIssueQl: IssueQlNode;
  hideNonMatches: boolean;
}

const DEFAULT_STATE: BoardSearchFilterState = {
  issueIds: Set<string>(),
  containingText: '',
  issueQl: '',
  parsedIssueQl: null,
  hideNonMatches: false
};

interface BoardSearchFilterStateRecord extends TypedRecord<BoardSearchFilterStateRecord>, BoardSearchFilterState {
}

const STATE_FACTORY = makeTypedFactory<BoardSearchFilterState, BoardSearchFilterStateRecord>(DEFAULT_STATE);
export const initialBoardSearchFilterState: BoardSearchFilterState = STATE_FACTORY(DEFAULT_STATE);

export class BoardSearchFilterUtil {
  static updateBoardSearchFilterState(
    boardSearchFilterState: BoardSearchFilterState, mutate: (mutable: BoardSearchFilterState) => any): BoardSearchFilterState {
    return (<BoardSearchFilterStateRecord>boardSearchFilterState).withMutations(mutable => {
      return mutate(mutable);
    });
  }


  static fromObject(object: BoardSearchFilterState) {
    return STATE_FACTORY(object);
  }

  static containingTextAboveMinimumLength(containingText: string): boolean {
    return containingText && containingText.length >= 3;
  }
}


