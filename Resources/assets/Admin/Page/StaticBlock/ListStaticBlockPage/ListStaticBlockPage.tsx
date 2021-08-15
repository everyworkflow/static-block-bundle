/*
 * @copyright EveryWorkflow. All rights reserved.
 */

import React, {useContext, useEffect} from 'react';
import {useHistory} from "react-router-dom";
import PanelContext from "@EveryWorkflow/AdminPanelBundle/Admin/Context/PanelContext";
import {ACTION_SET_PAGE_TITLE} from "@EveryWorkflow/AdminPanelBundle/Admin/Reducer/PanelReducer";
import DataGridComponent from "@EveryWorkflow/DataGridBundle/Component/DataGridComponent";
import {DATA_GRID_TYPE_PAGE} from "@EveryWorkflow/DataGridBundle/Component/DataGridComponent/DataGridComponent";

const ListStaticBlockPage = () => {
    const {dispatch: panelState} = useContext(PanelContext);
    const history = useHistory();

    useEffect(() => {
        panelState({type: ACTION_SET_PAGE_TITLE, payload: 'Static block'});
    }, [panelState]);

    return (
        <>
            <DataGridComponent
                dataGridUrl={'/cms/static-block' + history.location.search}
                dataGridType={DATA_GRID_TYPE_PAGE}
            />
        </>
    );
};

export default ListStaticBlockPage;
