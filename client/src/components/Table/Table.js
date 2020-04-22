import React from "react";
import MaterialTable from "material-table";

// Icons
import { tableIcons } from "./components/TableIcons";

export default function Table({ title, columns, data, onAdd, onUpdate, onDelete }) {
  return (
    <MaterialTable
      icons={tableIcons}
      title={title}
      columns={columns}
      data={data}
      editable={{
        onRowAdd: newData =>
          new Promise(resolve => {
            onAdd(newData, resolve);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            if (oldData) {
              onUpdate(newData, resolve);
            }
          }),
        onRowDelete: oldData =>
          new Promise(resolve => {
            onDelete(oldData, resolve);
          }),
      }}
    />
  );
}
