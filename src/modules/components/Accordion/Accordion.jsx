import * as React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { Box, colors, IconButton, Tooltip } from '@mui/material'
import { Delete } from '@mui/icons-material'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import { useTheme } from '@mui/material/styles'

export default function AccordionComponent(props) {
  const theme = useTheme()
  return (
    <Accordion
      defaultExpanded={!props.defaultExpanded}
      sx={{
        boxShadow: ' rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
        // border: '1px solid ' + theme.palette.grey[300],
        borderTop: props.bordered === 'true' ? `2px solid ${theme.palette.primary.main}` : ``,
      }}
    >
      <AccordionSummary
        component='div'
        expandIcon={<ArrowDropDownIcon />}
        aria-controls='panel1-content'
        id='panel1-header'
        sx={{
          borderBottom: '1px solid #ccc',
          height: 40,
          paddingBlock: props.subtitle ? 4 : 0,
          margin: 0
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: props.subtitle ? 'flex-start' : 'center',
            width: '100%',
            flexDirection: props.subtitle ? 'column' : 'row',
            '& svg': {
              fontSize: 20
            }
          }}
        >
          <Typography component='span' sx={{ fontSize: 14, fontWeight: props.bold ?? 500 }}>
            {props.title}
          </Typography>
          {props.subtitle && (
            <Typography variant='caption' color='textSecondary' fontSize={14}>
              {props.subtitle}
            </Typography>
          )}
          {props.icons && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Tooltip title='Clone'>
                <IconButton
                  size='small'
                  sx={{ color: colors.grey[500] }}
                  onClick={e => {
                    e.stopPropagation()
                  }}
                >
                  <FileCopyIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title='Delete'>
                <span>
                  <IconButton
                    size='small'
                    disabled={props.fieldsLength < 2}
                    color='error'
                    onClick={e => {
                      e.stopPropagation()
                      props.handleDelete()
                    }}
                  >
                    <Delete />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ paddingBlock: props.paddingBlock ?? 5 }}>
        {props.content}
      </AccordionDetails>
    </Accordion>
  )
}
