import React from 'react';

function Notification({ message, type }) {
  const style = type === 'error' ? { color: 'red' } : { color: 'green' };

  return message ? <p style={style}>{message}</p> : null;
}

export default Notification;