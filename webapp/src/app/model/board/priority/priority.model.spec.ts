import {Priority, PriorityUtil} from './priority.model';
import {cloneObject} from '../../utils/test-util.spec';

describe('Priority unit tests', () => {

  describe('Deserialize', () => {
    const input: any = cloneObject({
      name : 'Blocker',
      icon : 'https://example.com/blocker.png'
    });

    it('Deserialize', () => {
      // Check the full record here. Other tests will check the initials calculated
      const priority: Priority = PriorityUtil.fromJS(input);
      expect(priority).toEqual(jasmine.anything());
      expect(priority.name).toEqual('Blocker');
      expect(priority.icon).toEqual('https://example.com/blocker.png');
    });
  });
});