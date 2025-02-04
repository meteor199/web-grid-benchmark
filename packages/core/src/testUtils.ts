/**
 * Scrolling starts at 5px per update, accelerating all the way up to 1000px, this way mimicking flick scrolling on a touchpad or an unlocked mouse wheel. At a predefined distance of 50,000px, the scrolling stops and a callback is called.
 * @param options
 */

export function testScrollElement(options: {
  element?: Element;
  distance?: number;
  speed?: number;
  maxSpeed?: number;
  acceleration?: number;
  scrollFn?: (scrollTop: number) => void;
}) {
  let scrollTop = 0;

  let {
    element,
    distance = 50000,
    speed = 5,
    maxSpeed = 1000,
    acceleration = 1,
    scrollFn,
  } = Object.assign({}, options);

  return new Promise<void>((resolve, reject) => {
    const intervalId = setInterval(() => {
      if (scrollFn) {
        scrollFn(scrollTop);
      } else if (element) {
        element.scrollTop = scrollTop;
      }

      scrollTop += speed;

      if (speed < maxSpeed) speed += acceleration;

      if (scrollTop > distance) {
        console.log('scroll stop');
        clearInterval(intervalId);
        resolve();
      }
    }, 1);
  });
}
