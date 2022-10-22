import React, { useEffect, useState } from 'react';

import 'jquery-connections';

import './Hierarchy.scss';
import { HierItem } from '../HierItem/HierItem';


export interface HierarchyData {
    id?: number,
    parentId?: number | null,
    rowName?: string,
    total?: number,
    salary?: number,
    mimExploitation?: number,
    machineOperatorSalary?: number,
    materials?: number,
    mainCosts?: number,
    supportCosts?: number,
    equipmentCosts?: number,
    overheads?: number,
    estimatedProfit?: number,
    child?: HierarchyData[],
    temp?: boolean,
}

export const createItem = (item: HierarchyData): HierarchyData => {
    const hierBase: HierarchyData = {
        parentId: null,
        id: 0,
        rowName: "",
        total: 0,
        salary: 0,
        mimExploitation: 0,
        machineOperatorSalary: 0,
        materials: 0,
        mainCosts: 0,
        supportCosts: 0,
        equipmentCosts: 0,
        overheads: 0,
        estimatedProfit: 0,
        child: [],
    }
    return { ...hierBase, ...item };
}

let elementsPair: string[][] = [];

const getId = (parentStrId: string, idx: number) => {
    let id;
    if (parentStrId !== '') {
        elementsPair.push([parentStrId, `${parentStrId}${idx}`])
        id = `${parentStrId}${idx}`;
    } else {
        id = `folder${idx}`;
    }
    return id;
}

const fetchedData = async () => {
    const res = await fetch('http://185.244.172.108:8081/v1/outlay-rows/entity/22/row/list');
    if (res.ok) {
        return res.json();
    }
    return [];
}

const createLines = () => {
    setTimeout(() => {
        elementsPair.forEach(el => {
            // @ts-ignore
            $(`#${el[0]}`).connections("remove");
            // @ts-ignore
            $(`#${el[1]}`).connections("remove");
        })
        elementsPair.forEach(el => {

            // @ts-ignore
            $(`#${el[0]}`).connections({ to: `#${el[1]}` , css: {
                border: '1px solid #C6C6C6',
                'pointer-events': 'none',
            }});
        })
        elementsPair = [];
    }, 10);
}

export const Hierarchy = () => {
    const [data, setData] = useState<HierarchyData[]>([]);

    useEffect(() => {
        (async () => {
            setData(await fetchedData());
        })();
    }, []);

    let [childCreating, setChildCreating] = useState<HierarchyData | HierarchyData[] | undefined>();

    const [createNew, setCreateNew] = useState(false);

    useEffect(() => {
        // for some reason jquery-connections does not work okay when immediately called
        createLines();
    }, [data]);

    const removeTemp = () => {
        if (childCreating) {
            if ((childCreating as HierarchyData).child?.length) {
                (childCreating as HierarchyData).child = (childCreating as HierarchyData).child?.filter(el => !el.temp);
            } else {
                console.log(childCreating);
                childCreating = (childCreating as HierarchyData[]).filter(el => !el.temp);
                console.log(childCreating);
            }
        }
        console.log(childCreating);
        return childCreating
    }

    const addItem = (item: HierarchyData) => {
        removeTemp();
        if (item.parentId) {
            item.child?.push(
                createItem({
                    temp: true,
                })
            )
        } else {
            data.push(createItem({
                    temp: true,
                }));
            setChildCreating(data);
        }

        setData([...data]);
    }

    const deleteItem = async (item: HierarchyData, parentNode: HierarchyData | null) => {
        const res = await fetch(`http://185.244.172.108:8081/v1/outlay-rows/entity/22/row/${item.id}/delete`, {
            method: 'DELETE'
        });
        if (res.ok) {
            if(parentNode) {
                parentNode.child = parentNode.child?.filter(el => el.id === item.id);
                setData([...data]);
            } else {
                let newData = data;
                newData = data.filter(el => el.id !== item.id);
                setData([...newData]);
            }

        }
    }

    const sendItem = async (item: HierarchyData, parentNode: HierarchyData | null) => {
        let newData = data;
        const res = await fetch('http://185.244.172.108:8081/v1/outlay-rows/entity/22/row/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
        if (res.ok) {
            if (parentNode) {
                parentNode.child?.push(item);
                parentNode.child = parentNode.child?.filter(el => !el.temp);
            } else {
                newData.push(item);
                newData = newData.filter(el => !el.temp);
            }
            
            setData([...newData]);
        }
    }

    const editItem = () => {

    }

    const renderItems = (data: HierarchyData, idx: number, parentIdx: string, level = 0, parentNode: HierarchyData | null = null): JSX.Element => {
        const id = getId(parentIdx, idx);

        return (
            <React.Fragment key={data.id}>
                <HierItem
                    parentNode={null}
                    data={data}
                    id={id}
                    level={level}
                    addItem={addItem}
                    sendItem={sendItem}
                    deleteItem={deleteItem}
                />
                {data.child?.map((row, idx) => {
                    return renderItems(row, idx, id,  level + 1, data || null)
                })}
            </React.Fragment>
        )
    }
    return (
        <>
            {data.map((el, idx) => renderItems(el, idx, ''))}
        </>
    )
}