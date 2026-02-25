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
} from '@mui/icons-material';

const OrderActionsMenu = ({ onUpdate, onUndispatch, onAddNote }) => {
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
          <MoreVert fontSize="small" />
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
        <MenuItem onClick={(e) => handleAction(onUpdate, e)}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Order</ListItemText>
        </MenuItem>

        {onUndispatch && (
          <MenuItem onClick={(e) => handleAction(onUndispatch, e)}>
            <ListItemIcon>
              <LocalShipping fontSize="small" />
            </ListItemIcon>
            <ListItemText>Undispatch</ListItemText>
          </MenuItem>
        )}

        <MenuItem onClick={(e) => handleAction(onAddNote, e)}>
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
      </Menu>
    </>
  );
};

export default React.memo(OrderActionsMenu);