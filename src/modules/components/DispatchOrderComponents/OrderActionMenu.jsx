import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  LocalShipping,
  NoteAdd,
  Update,
  MoreHoriz,
  UploadFile,
} from '@mui/icons-material';

const OrderActionsMenu = ({ onUndispatch, onAddNote, onUpdateTerminal, onUploadFile }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event?.stopPropagation();
    setAnchorEl(null);
  };

  const handleAction = (action, event) => {
    event?.stopPropagation();
    action?.();
    handleClose();
  };

  return (
    <>
      <Tooltip title="Actions">
        <IconButton
          size="small"
          onClick={handleClick}
          sx={{
            '&:hover': {
              bgcolor: 'primary.50',
            },
          }}
        >
          <MoreHoriz fontSize="small" />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={(e) => e.stopPropagation()}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {onUndispatch && (
          <MenuItem onClick={(e) => handleAction(onUndispatch, e)}>
            <ListItemIcon>
              <LocalShipping fontSize="small" />
            </ListItemIcon>
            <ListItemText>Undispatch</ListItemText>
          </MenuItem>
        )}

        <MenuItem onClick={(e) => handleAction(onUpdateTerminal, e)}>
          <ListItemIcon>
            <Update fontSize="small" />
          </ListItemIcon>
          <ListItemText>Update Terminal</ListItemText>
        </MenuItem>

        <MenuItem onClick={(e) => handleAction(onAddNote, e)}>
          <ListItemIcon>
            <NoteAdd fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add Note</ListItemText>
        </MenuItem>
        <MenuItem onClick={(e) => handleAction(onUploadFile, e)}>
          <ListItemIcon>
            <UploadFile fontSize="small" />
          </ListItemIcon>
          <ListItemText>Upload File</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default React.memo(OrderActionsMenu);