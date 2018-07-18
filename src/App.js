import Circle from './Circle';

import two from './two';
import websocket from './websocket';

export default () => {
  const receiveData = (data) => {
    const circle = new Circle(data);
    two.scene.add(circle);
    circle.didMount();
  };

  two.appendTo(document.body);

  websocket.onmessage = (ev) => {
    receiveData(JSON.parse(ev.data));
  };
};
