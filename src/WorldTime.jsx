// WorldTime.jsx
import React from 'react';

export default function WorldTime() {
  return (
    <iframe
      scrolling="no"
      frameborder="no"
      width="720"
      height="375"
      style={{ border: 'none', overflow: 'hidden' }}
      src="https://www.clocklink.com/clocks/HTML5/html5-world.html?Chelyabinsk&Calgary&New_York&720&gray"
    />
  );
}
