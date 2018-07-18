// import Circle from './Circle';
// import InfoText from './InfoText';
import Group from './Group';

import two from './two';
import websocket from './websocket';

export default () => {
  const receiveData = (data) => {
    const group = new Group(data);
    two.scene.add(group);
    group.didMount();
  };

  two.appendTo(document.body);

  websocket.onmessage = (ev) => {
    receiveData(JSON.parse(ev.data));
  };
};
