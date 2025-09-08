import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { GridRowModes, GridActionsCellItem } from "@mui/x-data-grid";

const getActions = ({ id }) => {
  return [
    <GridActionsCellItem
      icon={<EditIcon />}
      label="Edit"
      className="textPrimary"
      onClick={handleEditClick(id)}
      color="inherit"
    />,
    <GridActionsCellItem
      icon={<DeleteIcon />}
      label="Delete"
      onClick={handleDeleteClick(id)}
      color="inherit"
    />,
  ];
};
