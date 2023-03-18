import { FC } from 'basic-utility-types';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { UpdateStore } from 'stores/update.store';
import { DownloadProgress } from './download-progress';
import { UpdateNotification } from './update-notification';

type Props = {
  updateStore: UpdateStore;
};

export const UpdatePopup: FC<Props> = observer( ( { updateStore } ) => {
  const {
    isShowingNotificationAllowed,
    version,
    releaseNotes,
    isDownloading,
    currentPercentage,
    isNotificationOpened,
    updateGame,
    openNotification,
    closeNotification,
  } = updateStore;

  useEffect( () => {
    if ( isShowingNotificationAllowed && version !== null && releaseNotes !== null ) {
      openNotification();
    }
  }, [ version, releaseNotes ] );

  return (
    <>
      { version !== null &&
        releaseNotes !== null &&
        ( !isDownloading ? (
          <UpdateNotification
            isOpened={ isNotificationOpened }
            version={ version }
            releaseNotes={ releaseNotes }
            updateGame={ updateGame }
            fnForClosing={ closeNotification }
          />
        ) : (
          <DownloadProgress percentage={ currentPercentage } />
        ) ) }
    </>
  );
} );
