import React, { useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from '@material-ui/core/TablePagination';
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import AnalyticsContent from "./AnalyticsContent";
import "./style/WebsiteTable.css"
function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell className="text_element">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell className="text_element" align="left">{row.url}</TableCell>
        <TableCell className="text_element" align="right">{row.siteId}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="text_element" style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <AnalyticsContent siteId={row.siteId} open={open} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function WebsiteTable({ data  }) {
  const [rows, setRows] = useState(data);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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
  return (
    <Paper >
      <Table stickyHeader style={{overflow: 'auto'}} className="table" aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell className="text_element" />
            <TableCell>URL</TableCell>
            <TableCell align="right">Website ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody style={{overflow: 'auto'}}>
          {rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
            <Row  key={index} row={row} />
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 20, 50]}
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
