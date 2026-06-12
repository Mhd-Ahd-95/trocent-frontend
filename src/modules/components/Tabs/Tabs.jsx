import * as React from 'react'
import PropTypes from 'prop-types'
import { useTheme, styled } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Grid, useMediaQuery } from '@mui/material'

const Appbar = styled(AppBar)(({ theme, size }) => ({
  minWidth: 300,
  maxWidth: size === 'large' ? 550 : 420,
  borderRadius: 10,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.grey[600],
  backgroundColor: '#fff',
  boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;',
  [theme.breakpoints.down('sm')]: {
    minWidth: '100%',
    maxWidth: '100%',
    borderRadius: 7,
  }
}))

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  }
}

export default function CustomTabs(props) {
  const { labels, contents, icons, size } = props
  const theme = useTheme()
  const [value, setValue] = React.useState(0)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const handleChange = (event, newValue) => {
    setValue(newValue)
    props?.onTabChange?.(newValue)
  }

  return (
    <Grid container sx={{ width: '100%' }}>
      <Grid size={12}>
        <Box
          sx={{
            bgcolor: 'transparent',
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Appbar position='static' size={size}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor='inherits'
              // centered
              textColor='primary'
              variant={isMobile ? 'scrollable' : icons ? 'fullWidth' : 'scrollable'}
              aria-label='full width tabs example'
              scrollButtons={false}
            >
              {labels.map((label, index) => (
                <Tab
                  key={index}
                  onMouseEnter={() => props?.onTabHover?.(index)}
                  iconPosition="start"
                  icon={icons ? icons[index] : undefined}
                  label={label}
                  {...a11yProps(index)}
                  sx={{
                    fontSize: 14,
                    textTransform: 'capitalize',
                    fontWeight: 600,
                    minWidth: { xs: 'auto', sm: undefined },
                    px: { xs: 1, sm: 2 },
                  }}
                />
              ))}
            </Tabs>
          </Appbar>
        </Box>
      </Grid>
      <Grid size={12}>
        {contents.map((content, index) => (
          <TabPanel
            value={value}
            index={index}
            key={index}
            dir={theme.direction}
          >
            {content}
          </TabPanel>
        ))}
      </Grid>
    </Grid>
  )
}
