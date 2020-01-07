
import { PAGE_STAGE } from '../js/enum';
import React from 'react';

import AppWelcome from './app-welcome';
import AppPropertyPanel from './app-property-panel';
import AppMain from './app-main'

const AppBody = props => {
    if (props.pageStage === PAGE_STAGE.WELCOME) {
      return (
        <div className="app__body">
          <AppWelcome {...props} />
        </div>
      );
    } else {
      return (
        <div className="app__body">
          <AppMain {...props} />
          <AppPropertyPanel {...props} />
        </div>
      );
    }
  };

export default AppBody;