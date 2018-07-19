import Group from './Group';
import Background from './Background';

import two from './two';
import websocket from './websocket';

export default () => {
  const receiveData = (data) => {
    const group = new Group(data);
    two.scene.add(group);
    group.didMount();
  };

  two.appendTo(document.body);
  two.scene.add(new Background());

  websocket.onmessage = (ev) => {
    receiveData(JSON.parse(ev.data));
  };
};
