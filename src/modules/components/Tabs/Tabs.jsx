import * as React from 'react'
import PropTypes from 'prop-types'
import { useTheme, styled } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { Grid, useMediaQuery } from '@mui/material'

const Appbar = styled(AppBar)(({ theme, size }) => ({
  minWidth: 300,
  maxWidth: size === 'large' ? 630 : 420,
  width: '100%',
  borderRadius: 10,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.grey[600],
  backgroundColor: '#fff',
  boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    minWidth: '100%',
    maxWidth: '100%',
    borderRadius: 7,
  }
}))

function TabPanel(props) {
  const { children, value, isMobile, index, ...other } = props
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (<Box sx={{ p: isMobile ? 0.5: 3 }}><Box>{children}</Box></Box>)}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
}

function a11yProps(index) {
  return { id: `full-width-tab-${index}`, 'aria-controls': `full-width-tabpanel-${index}` }
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
      <Grid size={12} sx={{ width: '100%', overflow: 'hidden' }}>
        <Box sx={{ bgcolor: 'transparent', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Appbar position='static' size={size}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor='inherits'
              textColor='primary'
              variant='scrollable'
              scrollButtons={isMobile ? 'auto' : false}
              allowScrollButtonsMobile
              aria-label='full width tabs example'
              sx={{
                width: '100%',
                minWidth: 0,
                maxWidth: '100%',
                '& .MuiTabs-scroller': {
                  overflowX: 'auto !important',
                  WebkitOverflowScrolling: 'touch',
                },
                '& .MuiTabs-flexContainer': {
                  width: 'max-content',
                },
              }}
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
                    fontSize: 15,
                    textTransform: 'capitalize',
                    fontWeight: 700,
                    minWidth: 'auto',
                    whiteSpace: 'nowrap',
                    px: { xs: 1.25, sm: 2 },
                  }}
                />
              ))}
            </Tabs>
          </Appbar>
        </Box>
      </Grid>
      <Grid size={12}>
        {contents.map((content, index) => (
          <TabPanel value={value} index={index} key={index} dir={theme.direction} isMobile={isMobile}>
            {content}
          </TabPanel>
        ))}
      </Grid>
    </Grid>
  )
}