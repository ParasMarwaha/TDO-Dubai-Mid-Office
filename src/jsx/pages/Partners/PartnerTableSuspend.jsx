import axios from "axios";
import Swal from "sweetalert2";
import {Link, useNavigate} from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import { useTable, useGlobalFilter, useFilters, usePagination } from 'react-table';
import PageTitle from "../../layouts/PageTitle.jsx";
import { Server_URL } from "../../../helpers/config.js";
import { adminAuthToken } from "../../../helpers/config.js";
import { ColumnFilter } from "../../components/table/FilteringTable/ColumnFilter.jsx";
import * as XLSX from "xlsx";
import {Logout} from "../../../store/actions/AuthActions.js";
import {useDispatch} from "react-redux";

const SuspendedPartnersTable = () => {
    const COLUMNS_SUSPENDED_PARTNERS = [
        {
            accessor: 'id',
            Cell: ({ value }) => (
                <Link to="/agent-details" state={{id: value}}
                    // to={{
                    //     pathname: `/agent-details`,
                    //     state: { id: value }
                    // }}
                >
                    <i className="fa fa-eye text-info" style={{ cursor: 'pointer' }} />
                </Link>
            ),
            disableFilters: true,
        },
        {
            Header: 'Emirates',
            Footer: 'Emirates',
            accessor: 'emirates',
            Filter: ColumnFilter,
        },
        {
            Header: 'Establishment Name',
            Footer: 'Establishment Name',
            accessor: 'establishment_name',
            Filter: ColumnFilter,
        },
        {
            Header: 'Email',
            Footer: 'Email',
            accessor: 'email',
            Filter: ColumnFilter,
        },
        {
            Header: 'Mobile',
            Footer: 'Mobile',
            accessor: 'mobile',
            Filter: ColumnFilter,
        },
    ];

    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const handleDetailsClick = (id) => {
    //     navigate(`/agent-details`, { state: { id } });
    // };

    const [suspendedPartners, setSuspendedPartners] = useState(null);

    function onLogout() {
        dispatch(Logout(navigate));
    }
    const fetchSuspendedPartners = async () => {
        try {
            let data = localStorage.getItem(adminAuthToken);
            if (data) {
                data = JSON.parse(data);
            }

            const api = Server_URL + 'admin/agents';
            const res = await axios.get(api, {
                headers: {
                    authorization: `Bearer ${data.idToken}`
                }
            });

            if(res.data.message === 'Session Expired' || res.data.message === 'Token Missing') {
                return onLogout()
            }
            if (res.status === 200 && res.data.responseCode === 1 && res.data.error) {
                Swal.fire({ icon: 'error', title: res.data.message });
            } else if (res.status === 200 && res.data.responseCode === 1 && res.data.warning) {
                Swal.fire({ icon: 'warning', title: res.data.message });
            } else if (res.status === 200 && res.data.responseCode === 2) {
                // Filter suspended partners by status (assuming 'suspended' status is "2")
                const filteredData = res.data.data.filter((item) => item.status === "2");
                setSuspendedPartners(filteredData);
            }
        } catch (e) {
            Swal.fire({ icon: 'error', title: e.message });
        }
    };

    useEffect(() => {
        fetchSuspendedPartners();
    }, []);

    const columns = useMemo(() => COLUMNS_SUSPENDED_PARTNERS, []);
    const data = useMemo(() => suspendedPartners || [], [suspendedPartners]);
    const tableInstance = useTable({
        columns,
        data,
        initialState: { pageIndex: 0 }
    }, useFilters, useGlobalFilter, usePagination);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        state,
        page,
        gotoPage,
        pageCount,
        pageOptions,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        setGlobalFilter,
    } = tableInstance;

    const { globalFilter, pageIndex } = state;

    const columnsToExclude = ['id']; // Add columns you want to exclude

    const exportToExcel = (fileName) => {
        // Generate the Excel file name with timestamp
        let currentTime = new Date().getTime();
        let file = `${currentTime}_${fileName}.xlsx`;

        // Create the worksheet data, excluding specified columns
        const wsData = suspendedPartners.map(partner =>
            COLUMNS_SUSPENDED_PARTNERS.reduce((acc, col) => {
                if (!columnsToExclude.includes(col.accessor)) {
                    acc[col.accessor] = partner[col.accessor];
                }
                return acc;
            }, {})
        );

        // Create a worksheet from the filtered data
        const ws = XLSX.utils.json_to_sheet(wsData);

        // Create a new workbook and add the worksheet to it
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // Write the file
        XLSX.writeFile(wb, file);
    };

    return (
        <div>
            <PageTitle motherMenu="Partners" activeMenu="/suspended-agents" pageContent="Suspended Partners" />

            <div className="card">
                <div className="card-header">
                    <h4 style={{color:'orange'}} className="card-title">Suspended Partners</h4>
                    <button
                        onClick={() => exportToExcel('SuspendedPartners')}
                        className="btn btn-sm btn-success">
                        Export to Excel <i className="fa fa-file-excel"></i>
                    </button>
                </div>

                <div className="card-body">
                    {suspendedPartners ? (
                        suspendedPartners.length > 0 ? (
                            <div className="table-responsive">
                                {/*<GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>*/}

                                <table id="SuspendedPartners" {...getTableProps()} className="table dataTable display">
                                    <thead>
                                    {headerGroups.map(headerGroup => (
                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map(column => (
                                                <th {...column.getHeaderProps()}>
                                                    {column.render('Header')}
                                                    {column.canFilter ? column.render('Filter') : null}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                    </thead>
                                    <tbody {...getTableBodyProps()}>
                                    {page.map((row) => {
                                        prepareRow(row);
                                        return (
                                            <tr {...row.getRowProps()}>
                                                {row.cells.map((cell) => (
                                                    <td {...cell.getCellProps()}> {cell.render('Cell')} </td>
                                                ))}
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>

                                {/* Page Count */}
                                <div className="d-flex justify-content-between">
                                    <span>
                                        Page{' '}
                                        <strong>
                                            {pageIndex + 1} of {pageOptions.length}
                                        </strong>{''}
                                    </span>

                                    <span className="table-index">
                                        Go to page : {' '}
                                        <input type="number"
                                               className="ml-2"
                                               defaultValue={pageIndex + 1}
                                               onChange={e => {
                                                   const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                                                   gotoPage(pageNumber);
                                               }}
                                        />
                                    </span>
                                </div>

                                {/* Pagination */}
                                <div className="text-center">
                                    <div className="filter-pagination mt-3">
                                        <button className="previous-button" onClick={() => gotoPage(0)}
                                                disabled={!canPreviousPage}>{'<<'}</button>

                                        <button className="previous-button" onClick={() => previousPage()}
                                                disabled={!canPreviousPage}>
                                            Previous
                                        </button>
                                        <button className="next-button" onClick={() => nextPage()}
                                                disabled={!canNextPage}>
                                            Next
                                        </button>
                                        <button className="next-button" onClick={() => gotoPage(pageCount - 1)}
                                                disabled={!canNextPage}>{'>>'}</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <span className="badge-danger light badge fs-20">No Data Available</span>
                            </div>
                        )
                    ) : (
                        <div className="text-center">
                            <span className="spinner spinner-border"></span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SuspendedPartnersTable;
