import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

var options = ["None"];

const ITEM_HEIGHT = 48;

export default function CustomMenuOption(props: any) {
  options = props.MenuOptions;
  const icons = props?.menuIcons ? props.menuIcons : []; 
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const selection = (val: any) => {
    props.selection(val, props.item);
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls="long-menu"
        aria-expanded={openMenu ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "20ch",
            borderRadius: "8px"
          },
        }}
      >
        {options.map((option, index) => (
          <MenuItem key={option} onClick={() => selection(option)}>
            {(icons.length > 0 && icons[index]) ? icons[index] : "" } {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
