import React from "react";
import {format} from 'date-fns';
import {ColumnFilter} from './ColumnFilter';

const handleDetailsClick = (id) => {
    // For example, navigate to a details page
    // or trigger a modal with user information
    // navigate(`/user-details/${id}`);
    // or
    // openUserDetailsModal(id);
};

export const COLUMNS = [
    {
        Header: 'Id',
        Footer: 'Id',
        accessor: 'id',
        Filter: ColumnFilter,
        // disableFilters: true,
    },
    {
        Header: 'First Name',
        Footer: 'First Name',
        accessor: 'first_name',
        Filter: ColumnFilter,
    },
    {
        Header: 'Last Name',
        Footer: 'Last Name',
        accessor: 'last_name',
        Filter: ColumnFilter,
    },
    {
        Header: 'Email Id',
        Footer: 'Email Id',
        accessor: 'email',
        Filter: ColumnFilter,
    },
    {
        Header: 'Date of  Birth',
        Footer: 'Date of  Birth',
        accessor: 'date_of_birth',
        Cell: ({value}) => {
            return format(new Date(value), 'dd/mm/yyyy')
        },
        Filter: ColumnFilter,
    },
    {
        Header: 'Country',
        Footer: 'Country',
        accessor: 'country',
        Filter: ColumnFilter,
    },
    {
        Header: 'Phone',
        Footer: 'Phone',
        accessor: 'phone',
        Filter: ColumnFilter,
    },
]

export const COLUMNS_PARTNERS = [
    {
        accessor: 'id',
        Cell: ({value}) => (
            <i onClick={() => handleDetailsClick(value)} className="fa fa-eye text-info"/>
        ),
        disableFilters: true,
    },
    {
        Header: '',
        Footer: '',
        accessor: 'status',
        Cell: ({value}) => value === '0' ? <span className="badge light badge-danger">
                        <i className="fa fa-circle text-danger me-1"/>
                        Inactive </span> : <span className="badge light badge-success">
                        <i className="fa fa-circle text-success me-1"/>Active</span>,
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
]

export const GROUPED_COLUMNS = [
    {
        Header: 'Id',
        Footer: 'Id',
        accessor: 'id'
    },
    {
        Header: 'Name',
        Footer: 'Name',
        columns: [
            {
                Header: 'First Name',
                Footer: 'First Name',
                accessor: 'first_name'
            },
            {
                Header: 'Last Name',
                Footer: 'Last Name',
                accessor: 'last_name'
            },
        ]
    },
    {
        Header: 'Info',
        Footer: 'Info',
        columns: [
            {
                Header: 'Date of  Birth',
                Footer: 'Date of  Birth',
                accessor: 'date_of_birth'
            },
            {
                Header: 'Country',
                Footer: 'Country',
                accessor: 'country',
            },
            {
                Header: 'Phone',
                Footer: 'Phone',
                accessor: 'phone'
            },
        ]
    },
]