import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectUser } from '../../features/user/userSlice';
import { Form, useLoaderData } from "react-router-dom";
import { mainLoaderData } from '../../Router';
import { Add, selectTable, selectTableFields, setTableData, sortTable, Edit, Remove } from '../../features/table/tableSlice';

import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';

const App: React.FC = () => {
    const dispatch = useAppDispatch();

    const user = useAppSelector(selectUser);

    const loaderData = useLoaderData() as mainLoaderData;
    let tableData = loaderData && !(loaderData instanceof Response) ? loaderData.table.data : null;

    const data = useAppSelector(selectTable);
    const tableFields = useAppSelector(selectTableFields);

    useEffect(() => {
        if (tableData) {
            dispatch(setTableData(tableData))
        }
    }, [tableData, dispatch])

    return (
        <>
            <header>
                <span>{user.name}</span>
                <Form method='post'>
                    <input type="submit" value="Выйти" />
                </Form>
            </header>
            <main>
                {
                    data && data.length &&
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${tableFields.length + 1}, minmax(max-content, 1fr))`,
                        // gridTemplateRows: 'repeat(8, minmax(max-content, 1fr))',
                        // gridAutoColumns: 'minmax(max-content, 1fr)',
                        // gridAutoFlow: 'column',
                        gap: '15px',
                        overflowY: 'auto',
                    }}>
                        {
                            tableFields.map(k =>
                                <div key={k}>
                                    <span>{k}</span>
                                    <ArrowDropUpIcon onClick={() => dispatch(sortTable({ field: k, order: 'desc' }))} />
                                    <ArrowDropDownIcon onClick={() => dispatch(sortTable({ field: k, order: 'asc' }))} />
                                </div>
                            )
                        }
                        <span></span>
                        {
                            data.map((p, row) =>
                                <>
                                    {
                                        tableFields.map((f, i) =>
                                            <span key={p[f] + p.id + i}>{p[f]}</span>
                                        )
                                    }
                                    <div key={row}>
                                        <EditIcon onClick={() => dispatch(Edit(p))}/>
                                        <DeleteForeverIcon  onClick={() => dispatch(Remove(p.id))} />
                                    </div>
                                </>
                            )
                        }
                    </div>
                }
                <button onClick={() => data ? dispatch(Add(data[0])) : {}}>add</button>
            </main>
        </>
    )
};

export default App;