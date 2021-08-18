import React, { FC, CSSProperties, useCallback } from 'react';
import { CreateMenu, CloseModalButton } from '@components/Menu/styles';

interface Props {
  style: CSSProperties;
  show: boolean;
  onCloseModal: () => void;
  closeButton?: boolean;
}
const Menu: FC<Props> = ({children, style, show, onCloseModal, closeButton}) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <CreateMenu onClick={onCloseModal}>
      <div style={style} onClick={stopPropagation}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}  
      </div>    
    </CreateMenu>
  );
};
Menu.defaultProps = {
  closeButton: true,
};

export default Menu;