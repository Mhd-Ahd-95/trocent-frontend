import * as React from 'react'
import PropTypes from 'prop-types'
import { useTheme, styled } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Grid, Paper } from '@mui/material'

const StyledPaper = styled(Paper)(({ theme }) => ({
  boxShadow:
    'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
  borderRadius: theme.spacing(1)
}))

function TabPanel (props) {
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

function a11yProps (index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  }
}

export default function StyledTabs (props) {
  const { labels, contents } = props
  const theme = useTheme()
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <StyledPaper>
      <Grid container>
        <Grid size={12}>
          <Box
            sx={{
              bgcolor: 'transparent',
              width: '100%',
              display: 'flex',
              borderBottom: '1px solid rgba(27, 31, 35, 0.15)'
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor='inherits'
              textColor='primary'
              variant='scrollable'
              aria-label='full width tabs example'
            >
              {labels.map((label, index) => (
                <Tab
                  key={index}
                  label={label}
                  {...a11yProps(index)}
                  sx={{
                    fontSize: 14,
                    textTransform: 'capitalize',
                    fontWeight: 600
                  }}
                />
              ))}
            </Tabs>
          </Box>
        </Grid>
        {contents && contents.length > 0 && (
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
        )}
      </Grid>
    </StyledPaper>
  )
}
