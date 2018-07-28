import Background from './Background';
import Block from './Block';

import two from './two';
import websocket from './websocket';

export default () => {
  two.appendTo(document.body);

  const background = new Background();
  two.scene.add(background);
  background.didMount();

  const receiveData = (data) => {
    const block = new Block(data);
    two.scene.add(block);
    block.didMount();

    background.notifyOfNewBlock(block);
  };

  websocket.onmessage = (ev) => {
    receiveData(JSON.parse(ev.data));
  };
};
