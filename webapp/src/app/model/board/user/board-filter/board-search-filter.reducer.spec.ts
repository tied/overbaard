import {Dictionary} from '../../../../common/dictionary';
import {Set} from 'immutable';
import {UserSettingActions} from '../user-setting.reducer';
import {BoardSearchFilterState, initialBoardSearchFilterState} from './board-search-filter.model';
import {BoardSearchFilterActions, boardSearchFilterMetaReducer} from './board-search-filter.reducer';
import {IssueQlNode} from '../../../../common/parsers/issue-ql/ast/node.iql';
import {IssueQlUtil} from '../../../../common/parsers/issue-ql/issue-ql.util';

describe('BoardSearchFilter reducer tests', () => {


  describe('Querystring tests', () => {
    it('No querystring', () => {
      const qs: Dictionary<string> = {};
      const state: BoardSearchFilterState = boardSearchFilterMetaReducer(
        initialBoardSearchFilterState,
        UserSettingActions.createInitialiseFromQueryString(qs));
      expect(state).toBe(initialBoardSearchFilterState);
    });

    it ('With querystring', () => {
      const qs: Dictionary<string> = {
        's.ids': 'TEST-1,TEST-2',
        's.text': 'Some%20text',
        's.hide': 'true',
        's.iql': encodeURIComponent('labels="test"')
      };
      const state: BoardSearchFilterState = boardSearchFilterMetaReducer(
        initialBoardSearchFilterState,
        UserSettingActions.createInitialiseFromQueryString(qs));
      const filterChecker: SearchFilterChecker = new SearchFilterChecker();
      filterChecker.containingText = 'Some text';
      filterChecker.issueIds = ['TEST-1', 'TEST-2'];
      filterChecker.hideNonMatches = true;
      filterChecker.issueQl = 'labels="test"';
      filterChecker.check(state);
    });
  });

  describe('Update tests', () => {
    let state: BoardSearchFilterState;
    beforeEach(() => {
      const qs: Dictionary<string> = {
        's.ids': 'TEST-1,TEST-2',
        's.text': 'Some%20text',
        's.hide': 'false',
        's.iql': encodeURIComponent('labels="test"')
      };
      state = boardSearchFilterMetaReducer(
        initialBoardSearchFilterState,
        UserSettingActions.createInitialiseFromQueryString(qs));
    });

    it ('Update ids', () => {
      state = boardSearchFilterMetaReducer(state, BoardSearchFilterActions.createUpdateIssueIds(Set<string>(['TEST-1', 'TEST-3'])));
      const checker: SearchFilterChecker = new SearchFilterChecker();
      checker.issueIds = ['TEST-1', 'TEST-3'];
      checker.containingText = 'Some text';
      checker.issueQl = 'labels="test"';
      checker.check(state);
    });

    it ('Reset ids', () => {
      // Don't think the component will use null for this value, but test it just in case
      state = boardSearchFilterMetaReducer(state, BoardSearchFilterActions.createUpdateIssueIds(null));
      const checker: SearchFilterChecker = new SearchFilterChecker();
      checker.issueIds = [];
      checker.containingText = 'Some text';
      checker.issueQl = 'labels="test"';
      checker.check(state);
    });

    it ('Update text', () => {
      state = boardSearchFilterMetaReducer(state, BoardSearchFilterActions.createUpdateContainingText('Hello there'));
      const checker: SearchFilterChecker = new SearchFilterChecker();
      checker.issueIds = ['TEST-1', 'TEST-2'];
      checker.containingText = 'Hello there';
      checker.issueQl = 'labels="test"';
      checker.check(state);
    });

    it ('Reset text', () => {
      // Don't think the component will use null for this value, but test it just in case
      state = boardSearchFilterMetaReducer(state, BoardSearchFilterActions.createUpdateContainingText(null));
      const checker: SearchFilterChecker = new SearchFilterChecker();
      checker.issueIds = ['TEST-1', 'TEST-2'];
      checker.issueQl = 'labels="test"';
      checker.check(state);
    });

    it ('Update IssueQl', () => {
      state = boardSearchFilterMetaReducer(state, BoardSearchFilterActions.createUpdateIssueQl('labels="test123"'));
      const checker: SearchFilterChecker = new SearchFilterChecker();
      checker.issueIds = ['TEST-1', 'TEST-2'];
      checker.containingText = 'Some text';
      checker.issueQl = 'labels="test123"';
      checker.check(state);
    });

    it ('Reset IssueQl', () => {
      // Don't think the component will use null for this value, but test it just in case
      state = boardSearchFilterMetaReducer(state, BoardSearchFilterActions.createUpdateIssueQl(''));
      const checker: SearchFilterChecker = new SearchFilterChecker();
      checker.issueIds = ['TEST-1', 'TEST-2'];
      checker.containingText = 'Some text';
      checker.check(state);
    });

    it('Update hideNonMatches', () => {
      state = boardSearchFilterMetaReducer(state, BoardSearchFilterActions.createUpdateHideNonMatches(true));
      const checker: SearchFilterChecker = new SearchFilterChecker();
      checker.issueIds = ['TEST-1', 'TEST-2'];
      checker.containingText = 'Some text';
      checker.issueQl = 'labels="test"';
      checker.hideNonMatches = true;
      checker.check(state);
      state = boardSearchFilterMetaReducer(state, BoardSearchFilterActions.createUpdateHideNonMatches(false));
      checker.hideNonMatches = false;
      checker.check(state);
    });
  });
});

export class SearchFilterChecker {
  containingText = '';
  issueIds: string[] = [];
  hideNonMatches = false;
  issueQl = '';

  check(filterState: BoardSearchFilterState) {
    this.checkFilter(this.issueIds, filterState.issueIds);
    expect(this.containingText).toEqual(filterState.containingText);
    expect(this.hideNonMatches).toEqual(filterState.hideNonMatches);
    expect(this.issueQl).toEqual(filterState.issueQl);
    if (this.issueQl) {
      expect(filterState.parsedIssueQl).toBeTruthy();
      const expectedParsed = IssueQlUtil.createIssueQlNode(this.issueQl);
      expect(filterState.parsedIssueQl).toEqual(expectedParsed);
    } else {
      expect(filterState.parsedIssueQl).toBeFalsy();
    }
  }

  checkFilter(expected: string[], actual: Set<string>) {
    expect(actual.size).toBe(expected.length);
    const eSorted: string[] = [...expected].sort((a, b) => a.localeCompare(b));
    const aSorted: string[] = [...actual.toArray()].sort((a, b) => a.localeCompare(b));
    expect(aSorted).toEqual(eSorted);
  }
}
