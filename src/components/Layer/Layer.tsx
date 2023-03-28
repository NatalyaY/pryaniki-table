import React from 'react';
import { Outlet } from 'react-router-dom';

const Layer = () => (
    <div>
        <div>
            <Outlet />
        </div>
    </div>
)

export default Layer