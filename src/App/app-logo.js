import React from 'react';

function AppLogo(props) {
  return <img className="app__logo" src="/logo192.png" alt="logo" />;
}

export default React.memo(AppLogo);
