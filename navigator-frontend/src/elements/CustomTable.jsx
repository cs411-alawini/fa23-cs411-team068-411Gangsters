import React, { useEffect, useState } from 'react';
import '../assets/styles/CustomTable.css';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';

export const CustomTable = ({ rows, columns }) => {
    return (
        <Sheet className="data-table" sx={{ height: 350, overflow: 'auto' }}>
            <Table 
                
                stickyHeader
            >
            <thead>
                <tr>
                    {
                        columns.map((column) => {
                            return <th>{column.label}</th>;
                        })
                    }
                </tr>
            </thead>
            <tbody>
                {
                    rows.map((row) => {
                        return (
                            <tr>
                                {
                                    columns.map((column) => {
                                        return <td>{column.renderCell(row)}</td>;
                                    })
                                }
                            </tr>
                        );
                    })
                }
                
            </tbody>
            </Table>
        </Sheet>
       
      );

};