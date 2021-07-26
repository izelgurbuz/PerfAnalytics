import React, { useState, useEffect, useContext, lazy, Suspense } from "react";
import { useAPI } from "../hooks/useApi";
import { AppContext } from "../AppContainer";
import ConfirmModal from "./ConfirmModal";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./style/WebsiteTable.css";
import "./style/DarkMode.css";
const AnalyticsContent = lazy(() => import("./AnalyticsContent"));

function Row(props) {
  const { row } = props;
  const {
    state: { darkMode },
  } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [commonClass, setCommonClass] = useState("");

  useEffect(() => {
    setCommonClass(darkMode ? "darkmode_light" : "");
  }, [darkMode]);

  const handleDelete = (siteId) => {
    props.setToDelete(siteId);
    props.setOpenModal(true);
  };

  console.log(row, "row");
  return (
    <>
      <TableRow className={commonClass}>
        <TableCell className="text_element">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => handleDelete(row.siteId)}
            className={` expand_button ${commonClass}`}
          >
            <HighlightOffRoundedIcon />
          </IconButton>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            className={` expand_button ${commonClass}`}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell className={commonClass} align="left">
          {row.url}
        </TableCell>
        <TableCell className={commonClass} align="right">
          {row.siteId}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          className={commonClass}
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box className="analytics_content_box" margin={1}>
              <Suspense fallback={<CircularProgress />}>
                <AnalyticsContent siteId={row.siteId} open={open} />
              </Suspense>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function WebsiteTable({ data, renderToggle, setRenderToggle }) {
  const {
    state: { darkMode },
  } = useContext(AppContext);
  const { post } = useAPI();
  const [rows, setRows] = useState(data);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [commonClass, setCommonClass] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const question = "Do you really want to remove this website?";

  useEffect(() => {
    setCommonClass(darkMode ? "darkmode_medium" : "");
  }, [darkMode]);

  useEffect(() => {
    setRows(data);
  }, [data]);
  useEffect(() => {
    setPage(0);
  }, [rows]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const onAgree = () => {
    post(`website/${toDelete}`)
      .then((res) => {
        setRenderToggle(!renderToggle);
        setToDelete(null);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onDisagree = () => {
    setToDelete(null);
  };

  return (
    <Paper>
      <ConfirmModal
        question={question}
        open={openModal}
        setOpen={setOpenModal}
        onAgree={onAgree}
        onDisagree={onDisagree}
      />
      <Table
        stickyHeader
        style={{ overflow: "auto" }}
        className={`table ${commonClass} `}
        aria-label="collapsible table"
      >
        <TableHead>
          <TableRow>
            <TableCell className={`text_element ${commonClass}`} />
            <TableCell className={commonClass}>URL</TableCell>
            <TableCell className={commonClass} align="right">
              Website ID
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody style={{ overflow: "auto" }}>
          {rows
            ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => (
              <Row
                key={index}
                row={row}
                setToDelete={setToDelete}
                setOpenModal={setOpenModal}
              />
            ))}
        </TableBody>
      </Table>
      <TablePagination
        className={commonClass}
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
