import React, { useEffect, useState } from 'react';

import 'jquery-connections';

import './Hierarchy.scss';
import { HierItem } from '../HierItem/HierItem';


export interface HierarchyData {
    id?: number,
    parentNode: HierarchyData | null,
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
        parentNode: null,
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
        console.log(parentStrId);
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
    // for some reason jquery-connections does not work okay when immediately called
    console.log(elementsPair);
    const elements = document.querySelectorAll('.connection');
    console.log(elements);
    for(let el of elements) {
        el.remove();
    }
    console.log(document.getElementsByClassName('connection'));
    setTimeout(() => {
        elementsPair.forEach(el => {

            // @ts-ignore
            $(`#${el[0]}`).connections({ to: `#${el[1]}` , css: {
                border: '1px solid #C6C6C6',
                'pointer-events': 'none',
            }});
        });
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

    const [creating, setCreating] = useState<HierarchyData | undefined>();


    useEffect(() => {
        createLines();
    }, [data]);


    useEffect(() => {
        elementsPair.forEach(el => {
            // @ts-ignore
            $(`#${el[0]}`).connections("update");
            // // @ts-ignore
            // $(`#${el[1]}`).connections("update");
        })
    });

    const removeTemp = () => {
        if (creating) {
            if (creating.parentNode === null) {
                data.splice(data.indexOf(creating), 1);
            } else {
                const parent = creating.parentNode;
                parent.child?.splice(parent.child.indexOf(creating), 1);
            }
        }
    }

    const addItem = (parentNode: HierarchyData | null) => {
        removeTemp();
        if (parentNode) {
            const newItem = createItem({
                parentId: parentNode.id,
                parentNode,
                temp: true,
            });
            parentNode.child?.push(newItem);
            setCreating(newItem);
        } else {
            const newItem = createItem({
                temp: true,
                parentNode: null
            });
            data.push(newItem);
            setCreating(newItem);
        }
        setData([...data]);
    }

    const deleteItem = async (item: HierarchyData, parentNode: HierarchyData | null) => {
        const res = await fetch(`http://185.244.172.108:8081/v1/outlay-rows/entity/22/row/${item.id}/delete`, {
            method: 'DELETE'
        });
        if (res.ok) {
            if(parentNode) {
                parentNode.child = parentNode.child?.filter(el => el.id !== item.id);
                setData([...data]);
            } else {
                let newData = data;
                newData = data.filter(el => el.id !== item.id);
                setData([...newData]);
            }
            

        }
    }

    const sendItem = async (item: HierarchyData, parentNode: HierarchyData | null) => {
        const itemToSend = { ...item, parentNode: null };
        const res = await fetch('http://185.244.172.108:8081/v1/outlay-rows/entity/22/row/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemToSend),
        });
        if (res.ok) {
            const newItem: { current: { id: number } } = await res.json();
            item.id = newItem.current.id;
            if (parentNode) {
                parentNode.child?.push(item);
            } else {
                data.push(item);
            }
            removeTemp();
            setData([...data]);
            setCreating(undefined);

        }
    }

    const editItem = () => {

    }

    const renderItems = (data: HierarchyData, idx: number, parentIdx: string, level = 0, parentNode: HierarchyData | null = null): JSX.Element => {
        const id = getId(parentIdx, idx);
        console.log(elementsPair);
        return (
            <React.Fragment key={data.id}>
                <HierItem
                    parentNode={parentNode}
                    data={data}
                    id={id}
                    level={level}
                    addItem={addItem}
                    sendItem={sendItem}
                    deleteItem={deleteItem}
                    editItem={editItem}
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