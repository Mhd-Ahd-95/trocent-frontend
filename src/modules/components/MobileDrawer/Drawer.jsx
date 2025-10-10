import * as React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Collapse, Chip, colors, Drawer } from "@mui/material";
import {
  HomeOutlined as Dashboard,
  LocalShippingOutlined as Order,
  GroupsOutlined as Customer,
  SettingsOutlined as Setting,
  GppGoodOutlined as Access,
  ExpandMore
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { RoleContext, ThemeContext, AddressBookContext } from '../../contexts'

const RouterLink = styled(Link)(({ theme, active, expanded }) => ({
  listStyle: "none",
  textDecoration: "none",
  "& .item-opt": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& .expand": {
      "& svg": {
        color: colors.grey[400],
        fontSize: 22,
        marginBottom: -7,
        transform: expanded === 'true' ? "rotate(180deg)" : "",
        transition: theme.transitions.create("transform", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      },
    },
  },
  "& li": {
    color:
      active === "true" ? theme.palette.primary.main : theme.palette.grey[700],
    fontSize: 14,
    width: "100%",
    whiteSpace: "nowrap",
    fontWeight: 600,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    paddingBlock: 7,
    marginBottom: 10,
    backgroundColor: active === "true" ? theme.palette.grey[200] : "",
    borderRadius: 7,
    // borderLeft:
    //   active === "true" ? "3px solid " + theme.palette.primary.main : "",
    "& svg": {
      color:
        active === "true"
          ? theme.palette.primary.main
          : theme.palette.grey[600],
      fontSize: 25,
      paddingInline: 8,
      marginLeft: 2,
    },
    "&:hover": {
      backgroundColor: theme.palette.grey[200],
    },
  },
}));

const SubRouterLink = styled(Link)(({ theme, active }) => ({
  listStyle: "none",
  textDecoration: "none",

  color:
    active === "true" ? theme.palette.primary.main : theme.palette.grey[600],
  "& li": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "& .chip": {
      width: "auto",
      backgroundColor: colors.orange[50],
      height: "auto",
      "& span": {
        paddingBlock: 2,
        paddingInline: 6,
        fontSize: 10,
        textAlign: "center",
        marginBottom: -1,
      },
    },
    marginBlock: 3,
    fontSize: 14,
    whiteSpace: "nowrap",
    fontWeight: 500,
    paddingBlock: 7,
    paddingLeft: 50,
    borderRadius: 7,
    backgroundColor: active === "true" ? theme.palette.grey[200] : "",
    "&:hover": {
      backgroundColor: theme.palette.grey[200],
    },
    position: "relative",
    "&:before": {
      content: `''`,
      position: "absolute",
      height: 7,
      width: 7,
      backgroundColor: theme.palette.grey[500],
      borderRadius: 25,
      top: 15,
      left: 20,
    },
  },
}));

const ListItem = styled("ul")(({ theme, active }) => ({
  margin: 0,
  padding: 0,
  paddingBottom: 10,
  paddingLeft: 4,
  "& a": {
    position: "relative",
    "&:not(:last-child):after": {
      content: `''`,
      position: "absolute",
      height: 31,
      width: 0.5,
      backgroundColor: theme.palette.grey[500],
      left: 23,
      top: 22,
      zIndex: 100,
    },
  },
}));

export default function MobileDrawer(props) {

  const { open, handleClose } = props;
  const roleContext = React.useContext(RoleContext)
  const addressContext = React.useContext(AddressBookContext)

  const { expandItem, setExpandItem } = React.useContext(ThemeContext)

  const itemsLinks = [
    { text: "Dashboard", icon: <Dashboard />, url: "/" },
    { text: "Orders", icon: <Order />, url: "/orders" },
    {
      text: "Customers",
      icon: <Customer />,
      options: [
        { text: "Customers", url: "/customers" },
        { text: "Fuel Surcharges", url: "/fuel-surcharges" },
        { text: "Rate Sheets", url: "/rate-sheets" },
      ],
    },
    {
      text: "Fleet Management",
      icon: <Order />,
      options: [
        { text: "Companies", url: "/companies" },
        { text: "Drivers", url: "/drivers" },
        { text: "Interliners", url: "/interliners" },
      ],
    },
    {
      text: "Settings",
      icon: <Setting />,
      options: [
        { text: "Accessorials", url: "/accessorials" },
        { text: "Vehicle Types", url: "/vehicle-types" },
        { text: "Address Book", url: "/address-books", chip: addressContext?.addressBooks?.length ?? 0 },
      ],
    },
    {
      text: "Access Management",
      icon: <Access />,
      options: [
        { text: "Roles", url: "/roles", chip: roleContext?.roles?.length ?? 0 },
        { text: "Users", url: "/users" },
      ],
    },
  ];

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 270,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          height: 71,
          alignItems: "center",
          px: 2,
          "& h6": {
            fontSize: 18,
            fontWeight: 600,
          },
          borderBottom: `1px solid ${colors.grey[300]}`,
        }}
      >
        <Typography variant="h6">Trocent</Typography>
      </Box>
      <Box
        sx={{
          pt: 3,
          pb: 5,
          height: "calc(100vh - 65px)",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <ul style={{ margin: 0, paddingBlock: 0, paddingInline: 7 }}>
          {itemsLinks.map(({ text, icon, url, options }, index) =>
            url ? (
              <RouterLink
                active={text === props.active ? "true" : "false"}
                key={index}
                to={url}
              >
                <Typography component={"li"}>
                  {icon} {text}
                </Typography>
              </RouterLink>
            ) : (
              <React.Fragment key={index}>
                <RouterLink
                  active={
                    !props.open &&
                      options.map((op) => op.text).includes(props.active)
                      ? "true"
                      : "false"
                  }
                  key={index}
                  onClick={() =>
                    setExpandItem({ ...expandItem, [text]: !expandItem[text] })
                  }
                  className="item-opt"
                  expanded={expandItem[text] ? 'true' : 'false'}
                >
                  <Typography component={"li"} className="item-opt">
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      {icon} {text}
                    </span>
                    <Box className="expand">
                      <ExpandMore />
                    </Box>
                  </Typography>
                </RouterLink>
                <Collapse
                  in={props.open ? expandItem[text] : false}
                  timeout={"auto"}
                  unmountOnExit
                >
                  <ListItem>
                    {options.map((option, index) => (
                      <SubRouterLink
                        key={index}
                        to={option.url}
                        active={props.active === option.text ? "true" : "false"}
                      >
                        <Typography component={"li"}>
                          {option.text}
                          {option.chip > 0 && (
                            <Chip
                              className="chip"
                              label={option.chip}
                              size="small"
                              color={"primary"}
                              variant="outlined"
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
    </Drawer>
  );
}
