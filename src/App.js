import Background from './Background';
import Burst from './Burst';
import Group from './Group';
import Loader from './Loader';

import two from './two';
import websocket from './websocket';

export default () => {
  const receiveData = (data) => {
    const group = new Group(data);
    two.scene.add(group);
    group.didMount();
  };

  two.appendTo(document.body);

  const background = new Background();
  two.scene.add(background);
  background.didMount();

  const burst = new Burst();
  two.scene.add(burst);
  burst.didMount();

  const loader = new Loader();
  two.scene.add(loader);
  loader.didMount();

  websocket.onmessage = (ev) => {
    receiveData(JSON.parse(ev.data));
  };
};
