import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Paper, Typography, Collapse, Chip, colors } from '@mui/material'
import {
  HomeOutlined as Dashboard,
  LocalShippingOutlined as Order,
  GroupsOutlined as Customer,
  SettingsOutlined as Setting,
  GppGoodOutlined as Access,
  ExpandMore
} from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import { useTheme } from '@emotion/react'
import { RoleContext, AddressBookContext } from '../../contexts'

const RouterLink = styled(Link)(({ theme, active, expanded }) => ({
  listStyle: 'none',
  textDecoration: 'none',
  '& .item-opt': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& .expand': {
      '& svg': {
        color: colors.grey[400],
        fontSize: 22,
        marginBottom: -7,
        transform: expanded === 'true' ? 'rotate(180deg)' : '',
        transition: theme.transitions.create('transform', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        })
      }
    }
  },
  '& li': {
    color:
      active === 'true' ? theme.palette.primary.main : theme.palette.grey[700],
    fontSize: 14,
    width: '100%',
    whiteSpace: 'nowrap',
    fontWeight: 600,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
    paddingBlock: 7,
    marginBottom: 10,
    backgroundColor: active === 'true' ? theme.palette.grey[200] : '',
    borderRadius: 7,
    // borderLeft:
    //   active === "true" ? "3px solid " + theme.palette.primary.main : "",
    '& svg': {
      color:
        active === 'true'
          ? theme.palette.primary.main
          : theme.palette.grey[600],
      fontSize: 25,
      paddingInline: 8,
      marginLeft: 2
    },
    '&:hover': {
      backgroundColor: theme.palette.grey[200]
    }
  }
}))

const SubRouterLink = styled(Link)(({ theme, active }) => ({
  listStyle: 'none',
  textDecoration: 'none',

  color:
    active === 'true' ? theme.palette.primary.main : theme.palette.grey[600],
  '& li': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& .chip': {
      width: 'auto',
      backgroundColor: colors.orange[50],
      height: 'auto',
      '& span': {
        paddingBlock: 2,
        paddingInline: 6,
        fontSize: 10,
        textAlign: 'center',
        marginBottom: -1
      }
    },
    marginBlock: 3,
    fontSize: 14,
    whiteSpace: 'nowrap',
    fontWeight: 500,
    paddingBlock: 7,
    paddingLeft: 50,
    borderRadius: 7,
    backgroundColor: active === 'true' ? theme.palette.grey[200] : '',
    '&:hover': {
      backgroundColor: theme.palette.grey[200]
    },
    position: 'relative',
    '&:before': {
      content: `''`,
      position: 'absolute',
      height: 7,
      width: 7,
      backgroundColor: theme.palette.grey[500],
      borderRadius: 25,
      top: 15,
      left: 20
    }
  }
}))

const ListItem = styled('ul')(({ theme, active }) => ({
  margin: 0,
  padding: 0,
  paddingLeft: 4,
  paddingBottom: 10,
  '& a': {
    position: 'relative',
    '&:not(:last-child):after': {
      content: `''`,
      position: 'absolute',
      height: 31,
      width: 0.5,
      backgroundColor: theme.palette.grey[500],
      left: 23,
      top: 22,
      zIndex: 100
    }
  }
}))

function SideMenu(props) {
  const theme = useTheme()

  const roleContext = React.useContext(RoleContext)
  const addressContext = React.useContext(AddressBookContext)

  const [expandItem, setExpandItem] = React.useState({
    Customers: true,
    "Fleet Management": true,
    Settings: true,
    "Access Management": true,
  });

  const itemsLinks = [
    { text: 'Dashboard', icon: <Dashboard />, url: '/' },
    { text: 'Orders', icon: <Order />, url: '/orders' },
    {
      text: 'Customers',
      icon: <Customer />,
      options: [
        { text: 'Customers', url: '/customers' },
        { text: 'Fuel Surcharges', url: '/fuel-surcharges' },
        { text: 'Rate Sheets', url: '/rate-sheets' }
      ]
    },
    {
      text: 'Fleet Management',
      icon: <Order />,
      options: [
        { text: 'Companies', url: '/companies' },
        { text: 'Drivers', url: '/drivers' },
        { text: 'Interliners', url: '/interliners' }
      ]
    },
    {
      text: 'Settings',
      icon: <Setting />,
      options: [
        { text: 'Accessorials', url: '/accessorials' },
        { text: 'Vehicle Types', url: '/vehicle-types' },
        {
          text: 'Address Book',
          url: '/address-books',
          chip: addressContext?.countAddress?.count ?? 0
        }
      ]
    },
    {
      text: 'Access Management',
      icon: <Access />,
      options: [
        { text: 'Roles', url: '/roles', chip: roleContext?.roles?.length ?? 0 },
        { text: 'Users', url: '/users' }
      ]
    }
  ]

  return (
    <Paper
      elevation={props.open ? 2 : 0}
      sx={{
        width: props.open ? 290 : 57,
        height: 'calc(100vh - 115px)',
        position: 'sticky',
        borderRadius: 0,
        top: 65,
        marginTop: 2,
        flexShrink: 0,
        paddingBlock: 3,
        zIndex: 100,
        overflow: 'hidden auto',
        transition: theme.transitions.create(['width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        }),
      }}
    >
      <Box>
        <ul style={{ margin: 0, paddingBlock: 0, paddingInline: 7 }}>
          {itemsLinks.map(({ text, icon, url, options }, index) =>
            url ? (
              <RouterLink
                active={text === props.active ? 'true' : 'false'}
                key={index}
                to={url}
              >
                <Typography component={'li'}>
                  {icon} {text}
                </Typography>
              </RouterLink>
            ) : (
              <React.Fragment key={index}>
                <RouterLink
                  active={
                    !props.open &&
                      options.map(op => op.text).includes(props.active)
                      ? 'true'
                      : 'false'
                  }
                  to='#'
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setExpandItem({ ...expandItem, [text]: !expandItem[text] })
                  }}
                  className='item-opt'
                  expanded={expandItem[text] ? 'true' : 'false'}
                >
                  <Typography component={'li'} className='item-opt'>
                    <span
                      style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                    >
                      {icon} {text}
                    </span>
                    <Box className='expand'>
                      <ExpandMore />
                    </Box>
                  </Typography>
                </RouterLink>
                <Collapse
                  in={props.open ? expandItem[text] : false}
                  timeout={'auto'}
                  unmountOnExit
                >
                  <ListItem>
                    {options.map((option, index) => (
                      <SubRouterLink
                        key={index}
                        to={option.url}
                        active={props.active === option.text ? 'true' : 'false'}
                      >
                        <Typography component={'li'}>
                          {option.text}
                          {option.chip > 0 && (
                            <Chip
                              className='chip'
                              label={option.chip}
                              size='small'
                              color={'primary'}
                              variant='outlined'
                              sx={{ marginRight: 1 }}
                            />
                          )}
                        </Typography>
                      </SubRouterLink>
                    ))}
                  </ListItem>
                </Collapse>
              </React.Fragment>
            )
          )}
        </ul>
      </Box>
    </Paper>
  )
}

export default React.memo(SideMenu)