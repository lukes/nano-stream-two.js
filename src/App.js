import Circle from './Circle';
import InfoText from './InfoText';

import two from './two';
import websocket from './websocket';

export default () => {
  const receiveData = (data) => {
    const circle = new Circle(data);
    two.scene.add(circle);
    circle.didMount();

    // TODO use a Two.Group
    const text = new InfoText(circle, data);
    two.scene.add(text);
    text.didMount();
  };

  two.appendTo(document.body);

  websocket.onmessage = (ev) => {
    receiveData(JSON.parse(ev.data));
  };
};
