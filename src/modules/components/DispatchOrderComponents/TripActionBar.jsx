import React from 'react';
import { Box, IconButton, Tooltip, Divider } from '@mui/material';
import { Edit, Timeline } from '@mui/icons-material';

const TripActionsBar = ({ onUpdateStatus, onShowTimeline }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      <Tooltip title="Update Trip Status" placement='top' arrow>
        <span>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onUpdateStatus?.();
            }}
            sx={{
              bgcolor: 'primary.50',
              '&:hover': {
                bgcolor: 'primary.100',
              },
            }}
          >
            <Edit fontSize="small" color="primary" />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Driver Activity Timeline" arrow>
        <span>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onShowTimeline?.();
            }}
            sx={{
              bgcolor: 'success.50',
              '&:hover': {
                bgcolor: 'success.100',
              },
            }}
          >
            <Timeline fontSize="small" color="success" />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};

export default React.memo(TripActionsBar);